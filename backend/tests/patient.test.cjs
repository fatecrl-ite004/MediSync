const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { mkdtempSync, rmSync, readFileSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');

test('Paciente: agenda, concorrência, reagendamento, fila e persistência compatível com v0.5', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'medisync-patient-'));
  const file = path.join(directory, 'data.json');
  const port = 3199;
  let child;
  async function start() {
    child = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT: String(port), MEDISYNC_DATA_FILE: file }, stdio: ['ignore', 'pipe', 'pipe'] });
    await new Promise((resolve, reject) => {
      let errors = '';
      const timer = setTimeout(() => reject(new Error('API timeout ' + errors)), 10000);
      child.stderr.on('data', chunk => { errors += chunk; });
      child.stdout.once('data', () => { clearTimeout(timer); resolve(); });
      child.once('exit', code => { clearTimeout(timer); reject(new Error('API exit ' + code + errors)); });
    });
  }
  async function stop() { if (child && child.exitCode === null) await new Promise(resolve => { child.once('exit', resolve); child.kill(); }); }
  async function req(url, method = 'GET', body, role = 'PATIENT') {
    const result = await fetch(`http://127.0.0.1:${port}/api${url}`, { method, headers: { 'Content-Type': 'application/json', 'X-Demo-Role': role }, body: body === undefined ? undefined : JSON.stringify(body) });
    return { status: result.status, data: await result.json() };
  }
  try {
    await start();
    assert.equal((await req('/patient/availability?serviceId=1', 'GET', undefined, 'DOCTOR')).status, 403);
    assert.equal((await req('/patient/availability?serviceId=99')).status, 400);
    const slots = (await req('/patient/availability?serviceId=1')).data.slots;
    assert.ok(slots.length > 20);
    assert.ok(slots.every(s => Date.parse(s.startsAt) > Date.now()));
    assert.ok(slots.every(s => ![0, 6].includes(new Date(s.day + 'T12:00:00Z').getUTCDay())));
    const data = { serviceId: 1, startsAt: slots[0].startsAt };
    assert.equal((await req('/patient/appointments', 'POST', { ...data, startsAt: new Date().toISOString() })).status, 409);
    const parallel = await Promise.all([req('/patient/appointments', 'POST', data), req('/patient/appointments', 'POST', data)]);
    assert.deepEqual(parallel.map(r => r.status).sort(), [201, 409]);
    const visit = parallel.find(r => r.status === 201).data;
    assert.equal(visit.patientId, 101);
    assert.equal((await req('/patient/appointments', 'POST', { ...data, appointmentId: 2 })).status, 404);
    assert.equal((await req('/patient/appointments/2/cancel', 'POST', {})).status, 404);
    assert.equal((await req('/patient/appointments/4/cancel', 'POST', {})).status, 409);
    assert.equal((await req('/patient/waitlist', 'POST', { serviceId: 1, period: 'invalid' })).status, 400);
    const entry = (await req('/patient/waitlist', 'POST', { serviceId: 1, period: slots[0].period })).data;
    await req('/patient/waitlist', 'POST', { serviceId: 1, period: slots[0].period });
    assert.equal((await req('/patient/waitlist')).data.length, 1);
    assert.equal((await req(`/patient/appointments/${visit.id}/cancel`, 'POST', {})).status, 200);
    assert.equal((await req(`/patient/appointments/${visit.id}/cancel`, 'POST', {})).status, 409);
    assert.ok((await req('/patient/waitlist')).data[0].lastNotifiedAt);
    assert.ok((await req('/notifications?userId=101')).data.some(n => n.title === 'Um horário foi liberado'));
    const rebook = await req('/patient/appointments', 'POST', data);
    assert.equal(rebook.status, 201);
    assert.equal((await req('/patient/waitlist')).data.length, 0);
    const target = (await req(`/patient/availability?serviceId=1&appointmentId=${rebook.data.id}`)).data.slots.find(s => s.startsAt !== data.startsAt);
    assert.equal((await req('/patient/appointments', 'POST', { serviceId: 1, startsAt: target.startsAt, appointmentId: rebook.data.id })).status, 200);
    assert.ok((await req('/patient/availability?serviceId=1')).data.slots.some(s => s.startsAt === data.startsAt));
    // A doctor releasing a matching hour must also trigger the patient's queue notification.
    const doctorSlot = (await req('/patient/availability?serviceId=2')).data.slots.find(s => s.period === 'afternoon');
    const doctorVisit = (await req('/appointments', 'POST', { patientId: 102, startsAt: doctorSlot.startsAt, durationMinutes: 30, service: 'Retorno' }, 'DOCTOR')).data;
    await req('/patient/waitlist', 'POST', { serviceId: 2, period: 'morning' });
    assert.equal((await req(`/appointments/${doctorVisit.id}`, 'PATCH', { status: 'CANCELLED', reason: 'Teste fictício' }, 'DOCTOR')).status, 200);
    assert.equal((await req('/patient/waitlist')).data.find(e => e.serviceId === 2).lastNotifiedAt, undefined);
    const another = (await req('/appointments', 'POST', { patientId: 102, startsAt: doctorSlot.startsAt, durationMinutes: 30, service: 'Retorno' }, 'DOCTOR')).data;
    await req('/patient/waitlist', 'POST', { serviceId: 2, period: 'afternoon' });
    assert.equal((await req(`/appointments/${another.id}`, 'PATCH', { status: 'CANCELLED', reason: 'Teste fictício' }, 'DOCTOR')).status, 200);
    assert.ok((await req('/patient/waitlist')).data.find(e => e.serviceId === 2).lastNotifiedAt);
    await stop(); await start();
    assert.equal((await req('/appointments?role=PATIENT&userId=101')).data.find(a => a.id === rebook.data.id).startsAt, target.startsAt);
    const persisted = (await req('/patient/waitlist')).data;
    assert.equal(persisted.length, 1); assert.equal(persisted[0].serviceId, 2);
    await req(`/patient/waitlist/${persisted[0].id}`, 'DELETE');
    assert.equal((await req('/patient/waitlist')).data.length, 0);
    // Existing v0.5 snapshots have no waitlist key. Opening them must preserve all other data.
    await stop();
    const old = JSON.parse(readFileSync(file, 'utf8')); delete old.waitlist; writeFileSync(file, JSON.stringify(old));
    await start();
    assert.deepEqual((await req('/patient/waitlist')).data, []);
    assert.ok((await req('/appointments?role=PATIENT&userId=101')).data.some(a => a.id === rebook.data.id));
    assert.equal((await req('/patients', 'GET', undefined, 'DOCTOR')).data.length, 3);
  } finally { await stop(); rmSync(directory, { recursive: true, force: true }); }
});
