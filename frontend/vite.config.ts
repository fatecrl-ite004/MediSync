import { defineConfig } from 'vite';
const securityHeaders = { 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()' };
const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'";

// The browser uses its own host. This also works when testing from a phone.
const proxy = {
  '/api': { target: 'http://127.0.0.1:3000' },
  '/socket.io': { target: 'http://127.0.0.1:3000', ws: true }
};
export default defineConfig({ plugins: [{ name: 'privacy-build-policy', apply: 'build', transformIndexHtml(html) { return html.replace('<head>', `<head><meta http-equiv="Content-Security-Policy" content="${csp}" />`); } }], server: { headers: securityHeaders, host: '0.0.0.0', allowedHosts: ['terminal.local'], proxy }, preview: { headers: { ...securityHeaders, 'Content-Security-Policy': csp + "; frame-ancestors 'self'" }, host: '0.0.0.0', allowedHosts: ['terminal.local'], proxy } });
