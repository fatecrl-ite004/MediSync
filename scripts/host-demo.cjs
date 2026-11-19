// Private academic demonstration: static frontend and loopback API on one URL.
// The original API's production block remains unchanged.
const { createRequire } = require('node:module');
const { createHash, createHmac, randomBytes, timingSafeEqual } = require('node:crypto');
const { spawn } = require('node:child_process');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const fs = require('node:fs');
const { once } = require('node:events');
const root = path.resolve(__dirname, '..');
const express = createRequire(path.join(root, 'backend/package.json'))('express');
const password = process.env.MEDISYNC_DEMO_PASSWORD || '';
const port = Number(process.env.PORT || 10000);
const publicURL = process.env.RENDER_EXTERNAL_URL || process.env.MEDISYNC_PUBLIC_URL || `http://localhost:${port}`;
const origin = new URL(publicURL).origin;
const secure = origin.startsWith('https://');
const frontend = path.join(root, 'frontend/dist');
const cookieName = 'medisync_demo';
const ttl = 12 * 60 * 60;
const digest = value => createHash('sha256').update(value).digest();
const same = (a, b) => timingSafeEqual(digest(a), digest(b));
const sign = value => createHmac('sha256', password).update(value).digest('hex');
function authenticated(req) {
  const cookie = String(req.headers.cookie || '').split(';').map(value => value.trim()).find(value => value.startsWith(cookieName + '='));
  if (!cookie) return false;
  const parts = cookie.slice(cookieName.length + 1).split('.');
  if (parts.length !== 3) return false;
  const [expires, nonce, signature] = parts;
  const now = Math.floor(Date.now() / 1000);
  return /^\d+$/.test(expires) && Number(expires) > now && Number(expires) <= now + ttl && /^[a-f0-9]{32}$/.test(nonce) && same(signature, sign(`${expires}.${nonce}`));
}
function cookie(value, maxAge) {
  return `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}
function loginPage(failed = false) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>MediSync — acesso à demonstração</title><style>body{margin:0;background:#edf7f6;color:#173b3b;font:18px/1.5 system-ui,sans-serif;display:grid;min-height:100dvh;place-items:center}main{box-sizing:border-box;margin:24px;padding:32px;max-width:480px;width:calc(100% - 48px);background:white;border:1px solid #b9d8d5;border-radius:20px}h1{margin:0;font-size:32px}p{margin:16px 0}label{display:block;font-weight:600}input,button{box-sizing:border-box;width:100%;font:inherit;border-radius:10px;padding:12px;margin-top:8px}input{border:1px solid #597e7a}button{margin-top:20px;background:#086c64;color:white;border:0;cursor:pointer}input:focus-visible,button:focus-visible{outline:3px solid #2388b9;outline-offset:3px}.error{color:#a22222}small{display:block;margin-top:24px;font-size:16px}</style></head><body><main><h1>MediSync</h1><p>Acesso à demonstração acadêmica.</p><form method="post" action="/demo/login"><label for="password">Código de acesso</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256">${failed ? '<p role="alert" class="error">Código incorreto. Tente novamente.</p>' : ''}<button type="submit">Entrar</button></form><small>Use apenas dados fictícios. As salas de chamada são simuladas.</small></main></body></html>`;
}
async function main() {
  if (password.length < 16 || password.length > 256) throw new Error('Defina MEDISYNC_DEMO_PASSWORD com 16 a 256 caracteres para proteger a demonstração.');
  if (!fs.existsSync(path.join(frontend, 'index.html'))) throw new Error('Compile o frontend antes de iniciar a demonstração hospedada.');
  const reservation = net.createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const internalPort = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, [path.join(root, 'backend/server.js')], {
    cwd: root,
    env: { ...process.env, NODE_ENV: 'demo', PORT: String(internalPort), MEDISYNC_ALLOWED_ORIGINS: origin },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const app = express();
  app.disable('x-powered-by');
  const server = http.createServer(app);
  const sockets = new Set();
  let ready = false;
  let stopping = false;
  const shutdown = (code = 0) => {
    if (stopping) return;
    stopping = true;
    ready = false;
    for (const socket of sockets) socket.destroy();
    server.close();
    if (child.exitCode === null) child.kill('SIGTERM');
    const timeout = setTimeout(() => { child.kill('SIGKILL'); process.exit(code); }, 3000);
    child.once('exit', () => { clearTimeout(timeout); process.exit(code); });
    if (child.exitCode !== null) { clearTimeout(timeout); process.exit(code); }
  };
  process.once('SIGTERM', () => shutdown());
  process.once('SIGINT', () => shutdown());
  child.once('error', () => { console.error('Não foi possível iniciar a API de demonstração.'); shutdown(1); });
  child.once('exit', () => { if (!stopping) { console.error('A API de demonstração encerrou.'); shutdown(1); } });
  child.stderr.on('data', data => process.stderr.write(data));
  const startup = setTimeout(() => { console.error('A API não iniciou dentro do prazo.'); shutdown(1); }, 15000);
  child.stdout.on('data', data => {
    if (!ready && String(data).includes('MediSync API')) {
      ready = true;
      clearTimeout(startup);
      server.listen(port, '0.0.0.0', () => console.log(`MediSync — demonstração protegida na porta ${port}`));
    }
  });
  server.on('error', () => { console.error('Não foi possível abrir a porta pública.'); shutdown(1); });
  app.use((req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', 'X-Robots-Tag': 'noindex, nofollow', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" });
    next();
  });
  app.get('/healthz', (_, res) => res.status(ready ? 200 : 503).json({ ok: ready }));
  app.get('/demo/login', (_, res) => res.type('html').send(loginPage()));
  app.post('/demo/login', express.urlencoded({ extended: false, limit: '1kb' }), (req, res) => {
    if (req.get('Origin') && req.get('Origin') !== origin) return res.sendStatus(403);
    if (typeof req.body.password !== 'string' || !same(req.body.password, password)) return res.status(401).type('html').send(loginPage(true));
    const value = `${Math.floor(Date.now() / 1000) + ttl}.${randomBytes(16).toString('hex')}`;
    res.set('Set-Cookie', cookie(`${value}.${sign(value)}`, ttl)).redirect(303, '/');
  });
  app.post('/demo/logout', (req, res) => {
    if (req.get('Origin') && req.get('Origin') !== origin) return res.sendStatus(403);
    res.set('Set-Cookie', cookie('', 0)).redirect(303, '/demo/login');
  });
  app.use((req, res, next) => {
    if (authenticated(req)) return next();
    if (req.path === '/api' || req.path.startsWith('/api/') || req.path.startsWith('/socket.io')) return res.status(401).json({ message: 'Acesse a demonstração com o código de acesso. Atualize a página para entrar.' });
    return res.redirect(303, '/demo/login');
  });
  function proxy(req) {
    return http.request({ hostname: '127.0.0.1', port: internalPort, path: req.url, method: req.method, headers: { ...req.headers, host: `127.0.0.1:${internalPort}` } });
  }
  app.use((req, res, next) => {
    if (!(req.path === '/api' || req.path.startsWith('/api/') || req.path.startsWith('/socket.io'))) return next();
    const outgoing = proxy(req);
    outgoing.on('response', incoming => { res.writeHead(incoming.statusCode, incoming.headers); incoming.pipe(res); });
    outgoing.on('error', () => { if (!res.headersSent) res.status(502).json({ message: 'A demonstração está reiniciando. Atualize a página.' }); else res.destroy(); });
    res.once('close', () => outgoing.destroy());
    req.pipe(outgoing);
  });
  app.use(express.static(frontend, { dotfiles: 'deny', index: 'index.html' }));
  app.get('*', (_, res) => res.sendFile(path.join(frontend, 'index.html')));
  app.use((_, req, res, next) => { if (!res.headersSent) res.status(400).send('Requisição inválida.'); });
  server.on('upgrade', (req, socket, head) => {
    if (!req.url.startsWith('/socket.io/') || !authenticated(req) || (req.headers.origin && req.headers.origin !== origin)) {
      socket.end('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n'); return;
    }
    const outgoing = proxy(req);
    outgoing.once('upgrade', (response, upstream, upstreamHead) => {
      sockets.add(socket); sockets.add(upstream);
      socket.once('close', () => { sockets.delete(socket); upstream.destroy(); });
      upstream.once('close', () => { sockets.delete(upstream); socket.destroy(); });
      socket.on('error', () => upstream.destroy()); upstream.on('error', () => socket.destroy());
      let headers = `HTTP/1.1 ${response.statusCode} ${response.statusMessage}\r\n`;
      for (let i = 0; i < response.rawHeaders.length; i += 2) headers += `${response.rawHeaders[i]}: ${response.rawHeaders[i + 1]}\r\n`;
      socket.write(headers + '\r\n');
      if (upstreamHead.length) socket.write(upstreamHead);
      if (head.length) upstream.write(head);
      socket.pipe(upstream); upstream.pipe(socket);
    });
    outgoing.once('response', response => { response.resume(); socket.end('HTTP/1.1 502 Bad Gateway\r\nConnection: close\r\n\r\n'); });
    outgoing.once('error', () => socket.destroy());
    socket.once('close', () => outgoing.destroy());
    outgoing.end();
  });
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
