import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
if (!existsSync(path.join(root, 'frontend/node_modules/vite/bin/vite.js')) || !existsSync(path.join(root, 'backend/node_modules/express'))) {
  console.error('Instale as dependências primeiro: npm --prefix backend ci e npm --prefix frontend ci');
  process.exit(1);
}
const children = [];
let closing = false;
function close(code = 0) {
  if (closing) return;
  closing = true;
  for (const child of children) child.kill();
  process.exitCode = code;
}
const backend = spawn(process.execPath, ['backend/server.js'], { cwd: root, env: { ...process.env, PORT: '3000' }, stdio: ['ignore', 'pipe', 'inherit'] });
children.push(backend);
backend.stdout.on('data', data => {
  process.stdout.write(data);
  if (children.length === 1 && String(data).includes('MediSync API')) {
    const extra = process.argv.slice(2);
    const frontend = spawn(process.execPath, [path.join(root, 'frontend/node_modules/vite/bin/vite.js'), '--host', '0.0.0.0', '--port', '5173', '--strictPort', ...extra], { cwd: path.join(root, 'frontend'), env: process.env, stdio: 'inherit' });
    children.push(frontend);
    frontend.on('error', error => { console.error(error.message); close(1); });
    frontend.on('exit', code => close(code || 0));
  }
});
backend.on('error', error => { console.error(error.message); close(1); });
backend.on('exit', code => close(code || 0));
process.on('SIGINT', () => close());
process.on('SIGTERM', () => close());
