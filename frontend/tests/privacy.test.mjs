import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COOKIE_KEY, NOTICE_TTL, readStorageNotice, storageNotice } from '../src/privacy.ts';
test('aviso não interpreta ausência, corrupção ou preferências de tracking como consentimento', () => {
  for (const raw of [null, '', 'broken', 'null', '{}', JSON.stringify({...storageNotice(), analytics:true}), JSON.stringify({...storageNotice(), marketing:true})]) assert.equal(readStorageNotice(raw),false);
  assert.equal(readStorageNotice(JSON.stringify(storageNotice())),true);
});
test('ciência versionada expira e não aceita data futura', () => {
  const now=1900000000000;
  assert.equal(readStorageNotice(JSON.stringify(storageNotice(now)),now),true);
  assert.equal(readStorageNotice(JSON.stringify(storageNotice(now-NOTICE_TTL)),now),false);
  assert.equal(readStorageNotice(JSON.stringify(storageNotice(now+1)),now),false);
  assert.equal(readStorageNotice(JSON.stringify({...storageNotice(now), version:'outdated'}),now),false);
  assert.equal(COOKIE_KEY,'medisync.necessary-storage.v1');
});
test('interface não reintroduz captura real nem scripts de análise', () => {
  const source=['App.tsx','DoctorWorkspace.tsx','PatientExperience.tsx','Legal.tsx','main.tsx'].map(p=>readFileSync(new URL('../src/'+p,import.meta.url),'utf8')).join('\n');
  assert.doesNotMatch(source,/getUserMedia|RTCPeerConnection|googletagmanager\.com|google-analytics\.com|connect\.facebook\.net|hotjar\.com|images\.unsplash\.com/);
  const policy=readFileSync(new URL('../vite.config.ts',import.meta.url),'utf8');
  assert.match(policy,/script-src 'self'/); assert.match(policy,/connect-src 'self'/); assert.match(policy,/img-src 'self' data:/);
});
