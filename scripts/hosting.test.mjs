import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const { io } = createRequire(new URL('../frontend/package.json', import.meta.url))('socket.io-client');
const entry = path.join(root, 'scripts/host-demo.cjs');
const origin = 'http://127.0.0.1:3194';
const password = 'codigo-ficticio-para-teste-123456';
const event = (socket, name) => new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error('Evento ausente: ' + name)), 5000);
  socket.once(name, value => { clearTimeout(timeout); resolve(value); });
});
test('hospedagem recusa iniciar sem código de acesso', () => {
  const result = spawnSync(process.execPath, [entry], { cwd: root, encoding: 'utf8', env: { ...process.env, NODE_ENV: 'production', MEDISYNC_DEMO_PASSWORD: '' } });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /MEDISYNC_DEMO_PASSWORD/);
});
test('um endereço protege frontend, API e Socket.IO; mantém os dois perfis e encerra a API filha', { timeout: 25000 }, async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'medisync-hosting-'));
  let child;
  const clients = [];
  const env = { ...process.env, PORT: '3194', NODE_ENV: 'production', MEDISYNC_PUBLIC_URL: origin, MEDISYNC_DEMO_PASSWORD: password, MEDISYNC_DATA_FILE: path.join(directory, 'data.json') };
  delete env.RENDER_EXTERNAL_URL;
  try {
    child = spawn(process.execPath, [entry], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', value => { stderr += value; });
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout: ' + stderr)), 10000);
      child.stdout.on('data', value => { if (String(value).includes('demonstração protegida')) { clearTimeout(timer); resolve(); } });
      child.once('exit', code => { clearTimeout(timer); reject(new Error('Saída ' + code + ': ' + stderr)); });
    });
    const get = (url, options = {}) => fetch(origin + url, { redirect: 'manual', ...options });
    assert.equal((await get('/healthz')).status, 200);
    const locked = await get('/');
    assert.equal(locked.status, 303);
    assert.equal(locked.headers.get('location'), '/demo/login');
    assert.match(await (await get('/demo/login')).text(), /Código de acesso/);
    assert.equal((await get('/api/doctor/profile')).status, 401);
    assert.equal((await get('/socket.io/?EIO=4&transport=polling')).status, 401);
    const badClient = io(origin, { autoConnect: false, transports: ['websocket'], reconnection: false }); clients.push(badClient);
    const rejected = event(badClient, 'connect_error'); badClient.connect(); await rejected; badClient.disconnect();
    const login = code => get('/demo/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: origin }, body: new URLSearchParams({ password: code }) });
    assert.equal((await login('incorreto')).status, 401);
    const logged = await login(password);
    assert.equal(logged.status, 303);
    const cookie = logged.headers.get('set-cookie');
    assert.match(cookie, /HttpOnly/); assert.match(cookie, /SameSite=Strict/);
    assert.equal(cookie.includes(password), false);
    const credentials = cookie.split(';')[0];
    const headers = { Cookie: credentials, Origin: origin, 'Content-Type': 'application/json', 'X-Demo-Role': 'DOCTOR' };
    const index = await get('/', { headers }); assert.equal(index.status, 200);
    const html = await index.text();
    assert.match(html, /MediSync/);
    const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map(match => match[1]);
    assert.ok(assets.length >= 2);
    for (const asset of assets) { assert.equal((await get(asset, { headers })).status, 200); assert.equal((await get(asset)).status, 303); }
    assert.match(index.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    assert.equal((await get('/api/doctor/profile', { headers })).status, 200);
    assert.equal((await get('/api/doctor/profile', { headers: { ...headers, Origin: 'https://untrusted.example' } })).status, 403);
    assert.equal((await get('/api/doctor/profile', { headers: { ...headers, Cookie: credentials + 'forged' } })).status, 401);
    for (const [id, transport] of [[1, 'polling'], [101, 'websocket']]) {
      const client = io(origin, { autoConnect: false, transports: [transport], upgrade: false, reconnection: false, extraHeaders: { Cookie: credentials, Origin: origin } }); clients.push(client);
      const connected = event(client, 'connect'); client.connect(); await connected;
      await new Promise(resolve => client.emit('user:join', { userId: id }, resolve));
    }
    const doctor = clients[1], patient = clients[2];
    const received = event(patient, 'chat:message');
    const [sent, delivered] = await Promise.all([get('/api/conversations/1/messages', { method: 'POST', headers, body: JSON.stringify({ senderId: 1, senderRole: 'DOCTOR', senderName: 'Dra. Ana Martins', content: 'Mensagem fictícia pelo endereço hospedado.' }) }), received]);
    assert.equal(sent.status, 201);
    assert.equal(delivered.message.content, 'Mensagem fictícia pelo endereço hospedado.');
    assert.equal(doctor.connected, true);
    const logout = await get('/demo/logout', { method: 'POST', headers });
    assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
    for (const client of clients) client.disconnect();
    const exited = new Promise(resolve => child.once('exit', resolve)); child.kill('SIGTERM'); await exited;
    assert.equal(child.exitCode, 0);
    await assert.rejects(fetch(origin + '/healthz'));
    assert.equal(stderr, '');
  } finally {
    for (const client of clients) client.disconnect();
    if (child && child.exitCode === null) { const exited = new Promise(resolve => child.once('exit', resolve)); child.kill('SIGTERM'); await exited; }
    await rm(directory, { recursive: true, force: true });
  }
});
