import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// Both applications are installed for this integration check; no new dependency.
const { io } = createRequire(new URL('../frontend/package.json', import.meta.url))('socket.io-client');
const root = fileURLToPath(new URL('../', import.meta.url));
const port = 3195;
const origin = `http://127.0.0.1:${port}`;

function nextEvent(socket, name, matches = () => true) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { socket.off(name, receive); reject(new Error(`Evento ausente: ${name}`)); }, 3000);
    function receive(value) {
      if (!matches(value)) return;
      clearTimeout(timer); socket.off(name, receive); resolve(value);
    }
    socket.on(name, receive);
  });
}

test('Tempo real: lista, conversa nova, chat silenciado, regras e encerramento de salas', { timeout: 20000 }, async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'medisync-realtime-'));
  const clients = [];
  let child;
  async function request(route, method = 'GET', body, role = 'DOCTOR') {
    const response = await fetch(`${origin}/api${route}`, {
      method, headers: { 'Content-Type': 'application/json', 'X-Demo-Role': role },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    return { status: response.status, data: await response.json() };
  }
  async function client(userId) {
    const socket = io(origin, { autoConnect: false, forceNew: true, reconnection: false, transports: ['websocket'] });
    clients.push(socket);
    const ready = new Promise((resolve, reject) => { socket.once('connect', resolve); socket.once('connect_error', reject); });
    socket.connect(); await ready;
    await socket.timeout(3000).emitWithAck('user:join', { userId });
    return socket;
  }
  try {
    child = spawn(process.execPath, [path.join(root, 'backend/server.js')], {
      env: { ...process.env, NODE_ENV: 'test', PORT: String(port), MEDISYNC_DATA_FILE: path.join(directory, 'data.json') },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('API não iniciou')), 5000);
      child.stdout.once('data', () => { clearTimeout(timer); resolve(); });
      child.once('exit', code => { clearTimeout(timer); reject(new Error(`API encerrou: ${code}`)); });
    });
    const patient = await client(101);
    const doctor = await client(1);
    const booked = await request('/appointments', 'POST', { patientId: 101, service: 'Retorno', startsAt: new Date(Date.now() + 35 * 86400000).toISOString(), durationMinutes: 30 });
    assert.equal(booked.status, 201);
    const visit = booked.data;

    const created = nextEvent(patient, 'conversation:created');
    const chat = await request('/conversations/start', 'POST', { appointmentId: visit.id, requesterRole: 'DOCTOR' });
    assert.equal(chat.status, 201);
    assert.equal((await created).id, chat.data.id);
    await request(`/conversations/${chat.data.id}/mute`, 'PATCH', { userId: 101, muted: true });
    await request('/settings/101', 'PATCH', { notificationPreferences: { chat: false } });

    // The patient has not opened/joined the conversation. A muted chat still updates.
    const delivered = nextEvent(patient, 'chat:message');
    const sent = await request(`/conversations/${chat.data.id}/messages`, 'POST', { senderId: 1, senderRole: 'DOCTOR', senderName: 'Dra. Ana Martins', content: 'Mensagem fictícia de teste' });
    assert.equal(sent.status, 201);
    assert.equal((await delivered).message.id, sent.data.id);
    const read = nextEvent(doctor, 'chat:read');
    await request(`/conversations/${chat.data.id}/read`, 'PATCH', { readerId: 101, readerRole: 'PATIENT' });
    assert.equal((await read).readerId, 101);

    // Membership of both rooms must not duplicate a message.
    patient.emit('conversation:join', { conversationId: chat.data.id });
    await patient.timeout(3000).emitWithAck('user:join', { userId: 101 });
    const messages = [];
    const collect = event => messages.push(event);
    patient.on('chat:message', collect);
    const once = nextEvent(patient, 'chat:message');
    const second = await request(`/conversations/${chat.data.id}/messages`, 'POST', { senderId: 1, senderRole: 'DOCTOR', senderName: 'Dra. Ana Martins', content: 'Segunda mensagem fictícia' });
    await once;
    await new Promise(resolve => setTimeout(resolve, 40));
    assert.equal(messages.filter(event => event.message.id === second.data.id).length, 1);
    patient.off('chat:message', collect);

    const available = nextEvent(patient, 'telemedicine:room-created');
    const room = await request('/telemedicine/rooms', 'POST', { creatorId: 1, appointmentId: visit.id, mode: 'VIDEO' });
    assert.equal(room.status, 201);
    assert.equal((await available).id, room.data.id);
    assert.equal((await request('/appointments?role=PATIENT&userId=101')).data.find(item => item.id === visit.id).telemedicineRoomId, room.data.id);
    // User rooms receive closure even without joining a media/call room.
    const endedForPatient = nextEvent(patient, 'call:ended');
    const endedForDoctor = nextEvent(doctor, 'call:ended');
    assert.equal((await request(`/telemedicine/rooms/${room.data.id}/end`, 'PATCH', { userId: 1 })).status, 200);
    assert.equal((await endedForPatient).roomId, room.data.id);
    assert.equal((await endedForDoctor).roomId, room.data.id);
    assert.equal((await request('/appointments?role=PATIENT&userId=101')).data.find(item => item.id === visit.id).telemedicineRoomId, null);

    const another = await request('/telemedicine/rooms', 'POST', { creatorId: 1, appointmentId: visit.id, mode: 'VOICE' });
    const endedOnCancellation = nextEvent(patient, 'call:ended');
    assert.equal((await request(`/patient/appointments/${visit.id}/cancel`, 'POST', {}, 'PATIENT')).status, 200);
    assert.equal((await endedOnCancellation).roomId, another.data.id);

    const visibility = nextEvent(patient, 'chat:availability');
    await request('/settings/1', 'PATCH', { chatMode: 'HIDDEN' });
    assert.equal((await visibility).mode, 'HIDDEN');
    assert.equal((await request('/settings/101')).data.chatMode, 'HIDDEN');
    assert.equal((await request('/settings/101', 'PATCH', { largerText: true })).data.chatMode, 'HIDDEN');
    assert.equal((await request('/settings/101', 'PATCH', { chatMode: 'OPEN' })).status, 403);
    assert.deepEqual((await request('/conversations?role=PATIENT&userId=101')).data, []);
  } finally {
    clients.forEach(socket => socket.disconnect());
    if (child?.exitCode === null) await new Promise(resolve => { child.once('exit', resolve); child.kill(); });
    rmSync(directory, { recursive: true, force: true });
  }
});
