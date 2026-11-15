const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const { mkdtempSync, rmSync, existsSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const server=path.join(__dirname,'..','server.js');
test('bloqueia inicialização de produção antes de criar dados',()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'medisync-production-'));const file=path.join(dir,'data.json');
 try { const p=spawnSync(process.execPath,[server],{env:{...process.env,NODE_ENV:'production',MEDISYNC_DATA_FILE:file},encoding:'utf8'});assert.equal(p.status,1);assert.match(p.stderr,/produção bloqueado/);assert.equal(existsSync(file),false); }
 finally {rmSync(dir,{recursive:true,force:true});}
});
test('minimiza cadastro, limita textos, bloqueia origem externa e sinaliza demo',async()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'medisync-privacy-'));const port=3196;let child;
 try {
  child=spawn(process.execPath,[server],{env:{...process.env,NODE_ENV:'test',PORT:String(port),MEDISYNC_DATA_FILE:path.join(dir,'data.json')},stdio:['ignore','pipe','pipe']});
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('timeout')),10000);child.stdout.once('data',()=>{clearTimeout(timer);resolve()});child.once('exit',code=>{clearTimeout(timer);reject(new Error('exit '+code))})});
  const req=async(url,body,origin)=>{const r=await fetch(`http://127.0.0.1:${port}/api${url}`,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-Demo-Role':'DOCTOR',...(origin?{Origin:origin}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,headers:r.headers,data:await r.json()}};
  const status=await req('/privacy/status');assert.equal(status.data.realPatientDataAllowed,false);assert.equal(status.data.analytics,false);assert.equal(status.data.mediaCapture,false);assert.equal(status.headers.get('cache-control'),'no-store');
  assert.equal((await req('/patients',{name:'Pessoa Real'})).status,400);
  assert.equal((await req('/patients',{name:'Paciente de teste 2',email:'teste@example.com'})).status,400);
  const saved=await req('/patients',{name:'Paciente de teste 2'});assert.equal(saved.status,201);assert.equal(saved.data.email,'');assert.equal(saved.data.birthDate,'');assert.equal(saved.data.phone,'');
  assert.equal((await req('/feedback',{userId:1,subject:'Teste',message:'x'.repeat(1001)})).status,400);
  assert.equal((await req('/patients',undefined,'https://untrusted.example')).status,403);
  assert.equal((await req('/patients',undefined,'http://localhost:5173')).status,200);
  const patch = async (url, body) => { const r = await fetch(`http://127.0.0.1:${port}/api${url}`, {method:'PATCH',headers:{'Content-Type':'application/json','X-Demo-Role':'DOCTOR'},body:JSON.stringify(body)}); return {status:r.status,data:await r.json()}; };
  assert.equal((await patch('/settings/1',{email:'teste@example.com'})).status,400);
  assert.equal((await patch('/settings/1',{notificationPreferences:{tracking:true}})).status,400);
  assert.equal((await patch('/settings/1',{largerText:'true'})).status,400);
  assert.equal((await patch('/settings/1',{largerText:true,notificationPreferences:{chat:false}})).status,200);
  const demoProfile=(await req('/doctor/profile')).data;
  assert.equal((await patch('/doctor/profile',{...demoProfile,crm:'CRM-SP 123456'})).status,400);
  assert.equal((await patch('/doctor/profile',{...demoProfile,specialties:'Cardiologia'})).status,400);
  assert.equal((await patch('/doctor/profile',{...demoProfile,headline:'Exemplo fictício'})).status,200);

  const profile=await req('/doctor/profile');assert.equal(profile.data.profilePhoto,'/avatar-medica.svg');assert.equal(profile.data.coverPhoto,'');assert.equal(profile.data.ratingCount,0);
 } finally {if(child && child.exitCode===null) await new Promise(resolve=>{child.once('exit',resolve);child.kill()});rmSync(dir,{recursive:true,force:true});}
});
