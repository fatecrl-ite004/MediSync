import { defineConfig } from 'vite';

// The browser uses its own host. This also works when testing from a phone.
const proxy = {
  '/api': { target: 'http://127.0.0.1:3000' },
  '/socket.io': { target: 'http://127.0.0.1:3000', ws: true }
};
export default defineConfig({ server: { host: '0.0.0.0', allowedHosts: ['terminal.local'], proxy }, preview: { host: '0.0.0.0', allowedHosts: ['terminal.local'], proxy } });
