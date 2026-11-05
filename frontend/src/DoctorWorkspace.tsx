import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { UiIcon } from './UiIcon';

export type Patient = { id: number; name: string; birthDate: string; email: string; phone: string; allergies: string };
export type ClinicalRecord = { id: number; appointmentId: number; patientId: number; summary: string; plan: string; updatedAt: string; author: string };
export type Visit = { id: number; patientId: number; patientName: string; service: string; startsAt: string; durationMinutes?: number; status: string; conversationId: number | null; cancellationReason?: string };
export const statusLabel: Record<string, string> = { CONFIRMED: 'Confirmada', IN_PROGRESS: 'Em atendimento', COMPLETED: 'Concluída', CANCELLED: 'Cancelada' };
type Request = <T = any>(path: string, options?: RequestInit) => Promise<T>;
const date = (v: string) => new Date(v).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
function localDate(value: string) { const d = new Date(value); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); }

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const focusable = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), summary, [tabindex]') || []).filter(element => {
      if (element.tabIndex < 0 || !element.getClientRects().length || getComputedStyle(element).visibility === 'hidden') return false;
      for (let parent = element.parentElement; parent && parent !== ref.current; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS' && !parent.hasAttribute('open') && parent.querySelector('summary') !== element) return false;
      }
      return true;
    });
    focusable()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeRef.current(); }
      if (e.key === 'Tab') {
        const items = focusable(), first = items[0], last = items[items.length - 1];
        if (!ref.current?.contains(document.activeElement)) { e.preventDefault(); (e.shiftKey ? last : first)?.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); if (previous?.isConnected) previous.focus(); };
  }, []);
  return <div className="modal-backdrop"><section ref={ref} className="modal-card doctor-modal" role="dialog" aria-modal="true" aria-label={title}><div className="section-title"><h2>{title}</h2><button className="btn" onClick={onClose} aria-label="Fechar formulário">✕</button></div>{children}</section></div>;
}

export function DoctorWorkspace({ mode, appointments, patients, records, profile, request, refresh, onChat, onCall, onRate, selectedPatient, onPatient, initialVisitId, chatEnabled }: {
  mode: 'appointments' | 'patients'; appointments: Visit[]; patients: Patient[]; records: ClinicalRecord[]; profile: any; request: Request; refresh: () => Promise<void>;
  onChat: (visit: Visit) => void; onCall: (visit: Visit) => void; onRate: (visit: Visit) => void; selectedPatient: number | null; onPatient: (id: number | null) => void; initialVisitId?: number | null; chatEnabled: boolean;
}) {
  const [query, setQuery] = useState(''), [filter, setFilter] = useState('ALL'), [day, setDay] = useState('');
  const [view, setView] = useState<'upcoming' | 'today' | 'history'>('upcoming');
  const [visible, setVisible] = useState(6);
  const [detailsId, setDetailsId] = useState<number | null>(initialVisitId || null);
  const [editor, setEditor] = useState<'visit' | 'patient' | 'record' | 'cancel' | null>(null);
  const [visit, setVisit] = useState<Visit | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const dirty = useRef(false), busyRef = useRef(false);
  useEffect(() => { if (initialVisitId) setDetailsId(initialVisitId); }, [initialVisitId]);
  useEffect(() => { setVisible(6); }, [query, filter, day, view, selectedPatient]);
  const close = () => { if (!busyRef.current && (!dirty.current || window.confirm('Descartar as alterações não salvas?'))) { setEditor(null); dirty.current = false; setError(''); if (visit) setDetailsId(visit.id); } };
  const open = (kind: typeof editor, v: Visit | null = null) => { setDetailsId(null); setEditor(kind); setVisit(v); setError(''); dirty.current = false; };
  async function perform(path: string, body: unknown, method = 'POST', reopenId = visit?.id) {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setError(''); setNotice('');
    let saved = false;
    try {
      await request(path, { method, body: JSON.stringify(body) }); saved = true;
      dirty.current = false; setEditor(null);
      await refresh(); setNotice('Alterações salvas.');
      if (reopenId) setDetailsId(reopenId);
    } catch (e) {
      if (saved) setNotice('Alterações salvas. Reabra a agenda para atualizar a lista.');
      else setError(e instanceof Error ? e.message : 'Não foi possível salvar.');
    } finally { busyRef.current = false; setBusy(false); }
  }
  const patient = patients.find(p => p.id === selectedPatient);
  const match = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
  const isUpcoming = (a: Visit) => a.status === 'IN_PROGRESS' || a.status === 'CONFIRMED' && Date.parse(a.startsAt) >= Date.now();
  const today = localDate(new Date().toISOString()).slice(0, 10);
  const visits = appointments.filter(a => (!patient || a.patientId === patient.id) && (patient || (view === 'upcoming' ? isUpcoming(a) : view === 'today' ? localDate(a.startsAt).slice(0, 10) === today : !isUpcoming(a))) && match(a.patientName + ' ' + a.service) && (filter === 'ALL' || a.status === filter) && (!day || localDate(a.startsAt).slice(0, 10) === day)).sort((a, b) => view === 'history' && !patient ? Date.parse(b.startsAt) - Date.parse(a.startsAt) : (a.status === 'IN_PROGRESS' ? 0 : 1) - (b.status === 'IN_PROGRESS' ? 0 : 1) || Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const detail = appointments.find(a => a.id === detailsId);
  const filtered = query !== '' || filter !== 'ALL' || day !== '';
  const matchedPatients = patients.filter(p => match(p.name + ' ' + p.email));
  const reset = () => { setQuery(''); setFilter('ALL'); setDay(''); };
  function renderVisit(a: Visit) {
    return <article className="calm-visit-row" key={a.id}>
      <time className="calm-row-time" dateTime={a.startsAt}><strong>{new Date(a.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong><span>{new Date(a.startsAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</span></time>
      <div className="calm-row-person"><h3>{a.patientName}</h3><span>{a.service}</span></div><span className={'status status-' + a.status.toLowerCase()}>{statusLabel[a.status]}</span><button className="btn" aria-label={`Abrir consulta de ${a.patientName} em ${date(a.startsAt)}`} onClick={() => { setDetailsId(a.id); setError(''); }}>Abrir consulta<UiIcon name="arrow" size={17} /></button>
    </article>;
  }
  function submitVisit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget));
    perform(visit ? `/appointments/${visit.id}` : '/appointments', { ...data, patientId: Number(data.patientId), durationMinutes: Number(data.durationMinutes), startsAt: new Date(String(data.startsAt)).toISOString() }, visit ? 'PATCH' : 'POST');
  }
  const currentRecord = records.find(r => r.appointmentId === visit?.id);
  return <section className="calm-workspace">
    <header className="calm-heading"><div><span className="eyebrow">Área médica</span><h1 tabIndex={-1}>{patient ? patient.name : mode === 'patients' ? 'Pacientes' : 'Agenda de consultas'}</h1><p>{patient ? 'Dados e atendimentos deste paciente.' : mode === 'patients' ? 'Encontre um paciente para abrir seu histórico.' : 'Escolha uma consulta para continuar.'}</p></div><button className="btn primary" onClick={() => open(mode === 'patients' && !patient ? 'patient' : 'visit')}>{mode === 'patients' && !patient ? 'Cadastrar paciente' : 'Nova consulta'}</button></header>
    {notice && <p role="status" className="inline-success">{notice}</p>}{error && !editor && !detail && <p role="alert" className="inline-error">{error}</p>}
    {patient && <details className="card calm-patient-data"><summary>Dados cadastrais e alergias</summary><div className="patient-summary"><div><small>Nascimento</small><strong>{patient.birthDate ? new Date(patient.birthDate + 'T12:00:00').toLocaleDateString('pt-BR') : 'Não informado'}</strong></div><div><small>Contato</small><strong>{patient.email || patient.phone || 'Não informado'}</strong><span>{patient.phone}</span></div><div><small>Alergias informadas</small><strong>{patient.allergies}</strong></div></div></details>}
    {mode === 'appointments' && !patient && <div className="calm-view-switch" role="group" aria-label="Visualização da agenda">{([['upcoming', 'Próximas'], ['today', 'Hoje'], ['history', 'Histórico']] as const).map(([key, label]) => <button className={view === key ? 'selected' : ''} aria-pressed={view === key} key={key} onClick={() => { setView(key); setFilter('ALL'); setDay(''); }}>{label}</button>)}</div>}
    <div className="calm-searchbar"><label className="calm-search"><span className="sr-only">Buscar</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={mode === 'patients' && !patient ? 'Buscar paciente' : 'Buscar por paciente ou consulta'} /></label>{(mode === 'appointments' || patient) && <details className="calm-filters"><summary><UiIcon name="settings" size={18} />Filtros{(filter !== 'ALL' || day) && <span className="calm-filter-dot" aria-label="Filtros ativos" />}</summary><div><label>Status<select value={filter} onChange={e => setFilter(e.target.value)}><option value="ALL">Todos os status</option>{Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label><label>Data<input type="date" value={day} onChange={e => setDay(e.target.value)} /></label></div></details>}{filtered && <button className="patient-link" onClick={reset}>Limpar busca e filtros</button>}</div>
    <div className="calm-list-heading"><h2>{mode === 'patients' && !patient ? 'Seus pacientes' : patient ? 'Consultas do paciente' : view === 'history' ? 'Histórico' : view === 'today' ? 'Agenda de hoje' : 'Próximos atendimentos'}</h2><span>{mode === 'patients' && !patient ? matchedPatients.length : visits.length} {mode === 'patients' && !patient ? matchedPatients.length === 1 ? 'paciente' : 'pacientes' : visits.length === 1 ? 'consulta' : 'consultas'}</span></div>
    {mode === 'patients' && !patient ? <div className="card calm-patient-list">{matchedPatients.slice(0, visible).map(p => <article className="calm-person-row" key={p.id}><span className="avatar">{p.name.charAt(0)}</span><div><h3>{p.name}</h3><span>{p.email || 'Contato não informado'}</span></div><button className="btn" onClick={() => onPatient(p.id)}>Abrir histórico<UiIcon name="arrow" size={17} /></button></article>)}{!matchedPatients.length && <div className="patient-empty">Nenhum paciente encontrado. Tente outro nome.</div>}</div> : <div className="card calm-visit-list">{visits.slice(0, visible).map(renderVisit)}{!visits.length && <div className="patient-empty"><h2>Nenhuma consulta nesta visualização</h2><p>{filtered ? 'Limpe a busca ou ajuste os filtros.' : 'Use as opções acima para consultar outras datas ou o histórico.'}</p></div>}</div>}
    {(mode === 'patients' && !patient ? matchedPatients.length : visits.length) > visible && <button className="btn calm-load-more" onClick={() => setVisible(n => n + 6)}>Ver mais resultados</button>}
    {patient && <details className="card section-card record-history calm-record-history"><summary>Registros de atendimento ({records.filter(r => r.patientId === patient.id).length})</summary>{records.filter(r => r.patientId === patient.id).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).map(r => <article className="record-entry" key={r.id}><strong>{date(r.updatedAt)} · {r.author}</strong><small>{statusLabel[appointments.find(a => a.id === r.appointmentId)?.status || 'IN_PROGRESS']}</small><h3>Resumo</h3><p>{r.summary}</p>{r.plan && <><h3>Plano e orientações</h3><p>{r.plan}</p></>}</article>)}{!records.some(r => r.patientId === patient.id) && <p>Nenhum registro salvo para este paciente.</p>}</details>}
    {detail && !editor && <Modal title="Detalhes do atendimento" onClose={() => { if (!busy) setDetailsId(null); }}><span className={'status status-' + detail.status.toLowerCase()}>{statusLabel[detail.status]}</span><h3 className="calm-detail-name">{detail.patientName}</h3><p>{detail.service}<br /><strong>{date(detail.startsAt)}</strong> · {detail.durationMinutes || 50} minutos</p>{detail.cancellationReason && <p>Motivo: {detail.cancellationReason}</p>}
      {error && <p className="inline-error" role="alert">{error}</p>}
      <div className="calm-detail-primary">
        {detail.status === 'CONFIRMED' && <button className="btn primary" disabled={busy} onClick={() => perform(`/appointments/${detail.id}`, { status: 'IN_PROGRESS' }, 'PATCH', detail.id)}>{busy ? 'Salvando…' : 'Iniciar atendimento'}</button>}
        {detail.status === 'IN_PROGRESS' && <button className="btn primary" onClick={() => open('record', detail)}>Registrar atendimento</button>}
        {detail.status === 'COMPLETED' && <button className="btn primary" onClick={() => open('record', detail)}>Ver registro</button>}
        <button className="btn" onClick={() => { setDetailsId(null); onPatient(detail.patientId); }}>Histórico do paciente</button>
      </div>
      <details className="calm-detail-extra"><summary>Comunicação e outras opções</summary><div className="calm-detail-tools"><button className="btn" disabled={!chatEnabled} onClick={() => { setDetailsId(null); onChat(detail); }}>Conversar</button>{['CONFIRMED', 'IN_PROGRESS'].includes(detail.status) && <button className="btn" onClick={() => { setDetailsId(null); onCall(detail); }}>Abrir chamada</button>}{detail.status === 'CONFIRMED' && <><button className="btn" onClick={() => open('visit', detail)}>Reagendar</button><button className="btn patient-cancel" onClick={() => open('cancel', detail)}>Cancelar consulta</button></>}{detail.status === 'COMPLETED' && <button className="btn" onClick={() => { setDetailsId(null); onRate(detail); }}>Avaliar</button>}</div></details>
      {detail.status === 'IN_PROGRESS' && <div className="calm-finish"><p className="muted">Salve o resumo do atendimento antes de concluir.</p><button className="btn" disabled={busy || !records.some(r => r.appointmentId === detail.id && r.summary.trim())} onClick={() => { if (window.confirm('Concluir atendimento? O registro ficará disponível apenas para leitura.')) perform(`/appointments/${detail.id}`, { status: 'COMPLETED' }, 'PATCH', detail.id); }}>Concluir atendimento</button></div>}
    </Modal>}
    {editor && <Modal title={editor === 'visit' ? visit ? 'Reagendar consulta' : 'Nova consulta' : editor === 'patient' ? 'Cadastrar paciente' : editor === 'cancel' ? 'Cancelar consulta' : 'Registro de atendimento'} onClose={close}>
      {error && <p role="alert" className="inline-error">{error}</p>}
      {editor === 'visit' && <form className="doctor-form" onChange={() => { dirty.current = true; }} onSubmit={submitVisit}>
        <label>Paciente<select name="patientId" defaultValue={visit?.patientId || patient?.id || ''} required disabled={!!visit}><option value="">Selecione um paciente</option>{patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label>Atendimento<select name="service" required defaultValue={visit?.service || profile.services[0]?.title}>{Array.from(new Set<string>([...profile.services.map((s: any) => s.title), ...(visit ? [visit.service] : [])])).map(s => <option key={s}>{s}</option>)}</select></label>
        <div className="form-grid"><label>Data e horário<input name="startsAt" type="datetime-local" required defaultValue={visit ? localDate(visit.startsAt) : ''} /></label><label>Duração (minutos)<input name="durationMinutes" type="number" min="10" max="240" required defaultValue={visit?.durationMinutes || 50} /></label></div>
        <p className="muted">Os horários seguem o fuso do seu computador. Sobreposições na agenda são bloqueadas.</p><button className="btn primary" disabled={busy}>{busy ? 'Salvando…' : 'Salvar consulta'}</button>
      </form>}
      {editor === 'patient' && <form className="doctor-form" onChange={() => { dirty.current = true; }} onSubmit={e => { e.preventDefault(); perform('/patients', Object.fromEntries(new FormData(e.currentTarget))); }}>
        <label>Nome completo<input name="name" required minLength={3} maxLength={120} /></label><div className="form-grid"><label>Nascimento<input name="birthDate" type="date" max={localDate(new Date().toISOString()).slice(0,10)} /></label><label>Telefone<input name="phone" type="tel" maxLength={30} /></label></div><label>E-mail<input name="email" type="email" maxLength={160} /></label><label>Alergias informadas<textarea name="allergies" maxLength={1000} placeholder="Não informado" /></label><button className="btn primary" disabled={busy}>{busy ? 'Salvando…' : 'Salvar paciente'}</button>
      </form>}
      {editor === 'cancel' && <form className="doctor-form" onChange={() => { dirty.current = true; }} onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); perform(`/appointments/${visit!.id}`, { status: 'CANCELLED', reason: data.get('reason') }, 'PATCH'); }}><p>{visit?.patientName} · {visit && date(visit.startsAt)}</p><label>Motivo do cancelamento<textarea name="reason" required maxLength={1000} /></label><button className="btn danger" disabled={busy}>Confirmar cancelamento</button></form>}
      {editor === 'record' && <form className="doctor-form" onChange={() => { dirty.current = true; }} onSubmit={e => { e.preventDefault(); perform(`/records/${visit!.id}`, Object.fromEntries(new FormData(e.currentTarget)), 'PUT'); }}><p>{visit?.patientName} · {visit && date(visit.startsAt)}</p>{!currentRecord && visit?.status === 'COMPLETED' && <p>Esta consulta de demonstração não possui registro.</p>}<label>Resumo do atendimento<textarea name="summary" rows={6} required maxLength={10000} defaultValue={currentRecord?.summary || ''} readOnly={visit?.status === 'COMPLETED'} /></label><label>Plano e orientações<textarea name="plan" rows={4} maxLength={10000} defaultValue={currentRecord?.plan || ''} readOnly={visit?.status === 'COMPLETED'} /></label>{visit?.status === 'IN_PROGRESS' ? <><p className="muted">Salve o registro antes de concluir a consulta na agenda.</p><button className="btn primary" disabled={busy}>{busy ? 'Salvando…' : 'Salvar registro'}</button></> : <p className="muted">Consulta concluída · leitura somente.</p>}</form>}
    </Modal>}
  </section>;
}

export function ProfileEditor({ profile, request, onSaved, onClose }: { profile: any; request: Request; onSaved: (p: any) => void; onClose: () => void }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const dirty = useRef(false), busyRef = useRef(false);
  const close = () => { if (!busyRef.current && (!dirty.current || window.confirm('Descartar alterações do perfil?'))) onClose(); };
  return <Modal title="Editar perfil profissional" onClose={close}><form className="doctor-form" onChange={() => { dirty.current = true; }} onSubmit={async e => {
    e.preventDefault(); if (busyRef.current) return; busyRef.current = true; setBusy(true); setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try { const updated = await request('/doctor/profile', { method: 'PATCH', body: JSON.stringify({ ...data, specialties: String(data.specialties).split(',').map(s => s.trim()).filter(Boolean) }) }); onSaved(updated); onClose(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Erro ao salvar.'); }
    finally { busyRef.current = false; setBusy(false); }
  }}>{error && <p role="alert" className="inline-error">{error}</p>}{[['name','Nome profissional'], ['crm','CRM'], ['headline','Título profissional'], ['city','Cidade'], ['state','Estado']].map(([key,label]) => <label key={key}>{label}<input name={key} required maxLength={key === 'state' ? 2 : 160} defaultValue={profile[key]} /></label>)}<label>Especialidades (separadas por vírgula)<input name="specialties" required maxLength={500} defaultValue={profile.specialties.join(', ')} /></label><label>Sobre<textarea name="about" required rows={5} maxLength={3000} defaultValue={profile.about} /></label><button className="btn primary" disabled={busy}>{busy ? 'Salvando…' : 'Salvar perfil'}</button></form></Modal>;
}

