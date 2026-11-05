import { useEffect, useRef, useState } from 'react';
import { Modal, statusLabel } from './DoctorWorkspace';
import { UiIcon } from './UiIcon';
import { downloadCalendar } from './calendar';

export type PatientVisit = { id: number; doctorName: string; patientId: number; patientName: string; doctorId: number; service: string; startsAt: string; durationMinutes?: number; status: string; conversationId: number | null; telemedicineRoomId: number | null };
type Service = { id: number; title: string; description: string; durationMinutes: number };
type Profile = { name: string; crm: string; city: string; state: string; services: Service[] };
type Request = <T = any>(path: string, options?: RequestInit) => Promise<T>;
type Slot = { startsAt: string; day: string; period: string };
type Entry = { id: number; serviceId: number; service: string; period: string; lastNotifiedAt?: string };
const zone = { timeZone: 'America/Sao_Paulo' };
const dateLabel = (value: string) => new Date(value).toLocaleDateString('pt-BR', { ...zone, weekday: 'long', day: 'numeric', month: 'long' });
const hourLabel = (value: string) => new Date(value).toLocaleTimeString('pt-BR', { ...zone, hour: '2-digit', minute: '2-digit' });
const periodLabel: Record<string, string> = { any: 'Qualquer período', morning: 'Manhã', afternoon: 'Tarde' };

function ErrorNotice({ message }: { message: string }) {
  return message ? <div className="patient-error" role="alert"><strong>Não foi possível continuar.</strong><span>{message}</span></div> : null;
}
function VisitSummary({ visit }: { visit: PatientVisit }) {
  return <div className="visit-summary"><strong>{visit.service}</strong><span>{visit.doctorName}</span><span>{dateLabel(visit.startsAt)}, às <b>{hourLabel(visit.startsAt)}</b></span><small>Horário de Brasília</small></div>;
}

export function PatientExperience({ mode, name, profile, appointments, chatEnabled, request, onBook, onSaved, onChat, onCall, onRate, onNavigate }: {
  mode: 'dashboard' | 'appointments'; name: string; profile: Profile; appointments: PatientVisit[]; chatEnabled: boolean; request: Request;
  onBook: (visit?: PatientVisit) => void; onSaved: (visit: PatientVisit) => void; onChat: (visit: PatientVisit) => void; onCall: (visit: PatientVisit) => void; onRate: (visit: PatientVisit) => void; onNavigate: (page: 'appointments' | 'messages' | 'more' | 'waitlist') => void;
}) {
  const [cancel, setCancel] = useState<PatientVisit | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [calendarNotice, setCalendarNotice] = useState('');
  const [visible, setVisible] = useState(6);
  const [historyVisible, setHistoryVisible] = useState(6);
  const upcoming = appointments.filter(a => ['CONFIRMED', 'IN_PROGRESS'].includes(a.status) && (Date.parse(a.startsAt) > Date.now() || a.status === 'IN_PROGRESS')).sort((a, b) => (a.status === 'IN_PROGRESS' ? 0 : 1) - (b.status === 'IN_PROGRESS' ? 0 : 1) || Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const previous = appointments.filter(a => !upcoming.some(u => u.id === a.id)).sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt));
  const next = upcoming[0];
  const detail = appointments.find(a => a.id === detailId);
  const isUpcoming = (a: PatientVisit) => upcoming.some(u => u.id === a.id);
  function openDetails(a: PatientVisit) { setError(''); setCalendarNotice(''); setDetailId(a.id); }
  async function cancelVisit() {
    if (!cancel || busy) return;
    setBusy(true); setError('');
    try {
      const visit = await request<PatientVisit>(`/patient/appointments/${cancel.id}/cancel`, { method: 'POST', body: '{}' });
      onSaved(visit); setCancel(null); setNotice('Consulta cancelada. O horário foi liberado.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Tente novamente.'); }
    finally { setBusy(false); }
  }
  function exportCalendar(a: PatientVisit) {
    try { downloadCalendar(a); setCalendarNotice('Arquivo preparado. Abra-o no calendário que você utiliza. Se reagendar, atualize o evento no seu calendário.'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível preparar o calendário.'); }
  }
  const status = (a: PatientVisit) => <span className={`patient-status status-${a.status.toLowerCase()}`}>{a.status === 'CONFIRMED' && <UiIcon name="check" size={15} />}{statusLabel[a.status] || a.status}</span>;
  const row = (a: PatientVisit) => <article className="calm-visit-row" key={a.id}>
    <time className="calm-row-time" dateTime={a.startsAt}><strong>{hourLabel(a.startsAt)}</strong><span>{new Date(a.startsAt).toLocaleDateString('pt-BR', { ...zone, day: 'numeric', month: 'short', year: 'numeric' })}</span></time>
    <div className="calm-row-person"><h3>{a.service}</h3><span>{a.doctorName}</span></div>{status(a)}<button className="btn" aria-label={`Ver detalhes de ${a.service} em ${dateLabel(a.startsAt)} às ${hourLabel(a.startsAt)}`} onClick={() => openDetails(a)}>Ver detalhes<UiIcon name="arrow" size={17} /></button>
  </article>;
  return <div className="patient-experience calm-patient">
    {notice && <div className="patient-notice" role="status"><UiIcon name="check" /><span>{notice}</span></div>}
    {mode === 'dashboard' ? <>
      <header className="calm-heading"><div><span className="eyebrow">Seu cuidado</span><h1 tabIndex={-1}>Olá, {name.split(' ')[0]}.</h1><p>Encontre aqui o seu próximo compromisso.</p></div><button className="btn primary" onClick={() => onBook()}><UiIcon name="appointments" size={20} />Agendar consulta</button></header>
      <div className="patient-section-title"><h2>Sua próxima consulta</h2><button className="patient-link" onClick={() => onNavigate('appointments')}>Ver todas <UiIcon name="arrow" size={17} /></button></div>
      {next ? <article className="card calm-focus-card"><div className="calm-focus-top">{status(next)}<span>{dateLabel(next.startsAt)}</span></div><div className="calm-focus-main"><div><time dateTime={next.startsAt} className="calm-focus-time">{hourLabel(next.startsAt)}</time><h3>{next.service}</h3><p>{next.doctorName}</p><small>Horário de Brasília</small></div><button className="btn primary" onClick={() => openDetails(next)}>Ver detalhes<UiIcon name="arrow" size={19} /></button></div></article> : <section className="card patient-empty"><UiIcon name="appointments" size={32} /><h2>Nenhuma consulta marcada</h2><p>Toque em Agendar consulta para escolher um horário.</p></section>}
      <div className="calm-quiet-links"><button className="patient-link" onClick={() => onNavigate('waitlist')}><UiIcon name="waitlist" size={19} />Fila de espera</button><button className="patient-link" onClick={() => onNavigate('more')}><UiIcon name="help" size={19} />Ajuda para usar</button></div>
    </> : <>
      <header className="calm-heading"><div><span className="eyebrow">Sua agenda</span><h1 tabIndex={-1}>Minhas consultas</h1><p>Abra uma consulta para ver os detalhes ou alterar o horário.</p></div><button className="btn primary" onClick={() => onBook()}>Agendar consulta</button></header>
      <div className="calm-list-heading"><h2>Próximas consultas</h2><span>{upcoming.length} {upcoming.length === 1 ? 'consulta' : 'consultas'}</span></div>
      <div className="card calm-visit-list">{upcoming.length ? upcoming.slice(0, visible).map(row) : <div className="patient-empty"><p>Você ainda não tem consultas futuras.</p></div>}</div>
      {upcoming.length > visible && <button className="btn calm-load-more" onClick={() => setVisible(n => n + 6)}>Ver mais consultas ({upcoming.length - visible})</button>}
      <details className="card patient-history calm-history"><summary>Histórico de consultas ({previous.length})</summary><div className="calm-visit-list">{previous.length ? previous.slice(0, historyVisible).map(row) : <p>Nenhum atendimento no histórico.</p>}{previous.length > historyVisible && <button className="btn calm-load-more" onClick={() => setHistoryVisible(n => n + 6)}>Ver mais do histórico</button>}</div></details>
      <button className="patient-link waitlist-link" onClick={() => onNavigate('waitlist')}><UiIcon name="waitlist" size={19} />Consultar minha fila de espera</button>
    </>}
    {detail && <Modal title="Detalhes da consulta" onClose={() => setDetailId(null)}><div className="calm-detail-status">{status(detail)}</div><VisitSummary visit={detail} />
      <p className="visit-hint">{detail.service === 'Teleconsulta' ? 'Por chamada. A sala aparece quando a médica liberar o atendimento.' : `Presencial · ${profile.city}, ${profile.state}. Confirme o endereço com a clínica.`}</p>
      {isUpcoming(detail) && <div className="calm-detail-primary">{detail.telemedicineRoomId && <button className="btn primary" onClick={() => { setDetailId(null); onCall(detail); }}>Entrar na chamada</button>}<button className={`btn ${detail.telemedicineRoomId ? '' : 'primary'}`} disabled={!chatEnabled} onClick={() => { setDetailId(null); onChat(detail); }}><UiIcon name="messages" size={19} />Conversar com a médica</button></div>}
      {!chatEnabled && isUpcoming(detail) && <p className="muted">A conversa está indisponível no momento.</p>}
      {detail.status === 'CONFIRMED' && isUpcoming(detail) && <><div className="calm-detail-tools"><button className="btn" onClick={() => { setDetailId(null); onBook(detail); }}>Reagendar</button><button className="btn" onClick={() => exportCalendar(detail)}><UiIcon name="appointments" size={18} />Adicionar ao calendário</button></div><details className="calm-cancel-disclosure"><summary>Não vou conseguir comparecer</summary><p>Você pode escolher outro horário ou liberar esta vaga para outra pessoa.</p><button className="btn patient-cancel" onClick={() => { setDetailId(null); setCancel(detail); setError(''); }}>Cancelar consulta</button></details></>}
      {detail.status === 'COMPLETED' && <button className="btn primary" onClick={() => { setDetailId(null); onRate(detail); }}>Avaliar atendimento</button>}
      {calendarNotice && <p className="patient-notice" role="status">{calendarNotice}</p>}<ErrorNotice message={error} />
    </Modal>}
    {cancel && <Modal title="Cancelar esta consulta?" onClose={() => { if (!busy) setCancel(null); }}><VisitSummary visit={cancel} /><p className="cancel-explanation">Seu horário será liberado para outra pessoa. Se quiser apenas mudar o dia, escolha reagendar.</p><ErrorNotice message={error} /><div className="patient-confirm-actions"><button className="btn primary" disabled={busy} onClick={() => { setCancel(null); openDetails(cancel); }}>Manter consulta</button><button className="btn" disabled={busy} onClick={() => { setCancel(null); onBook(cancel); }}>Reagendar</button><button className="btn patient-cancel" disabled={busy} onClick={cancelVisit}>{busy ? 'Cancelando…' : 'Confirmar cancelamento'}</button></div></Modal>}
  </div>;
}

export function PatientBooking({ profile, changing, request, onSaved, onClose, onWaitlist }: {
  profile: Profile; changing: PatientVisit | null; request: Request; onSaved: (visit: PatientVisit) => void; onClose: () => void; onWaitlist: () => void;
}) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(profile.services.find(s => s.title === changing?.service)?.id || profile.services[0]?.id || 0);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [day, setDay] = useState('');
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [saved, setSaved] = useState<PatientVisit | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const service = profile.services.find(s => s.id === serviceId);
  useEffect(() => { heading.current?.focus(); }, [step]);
  useEffect(() => {
    if (step !== 1) return;
    const controller = new AbortController();
    setLoading(true); setError(''); setSlots([]);
    request<{ slots: Slot[] }>(`/patient/availability?serviceId=${serviceId}${changing ? `&appointmentId=${changing.id}` : ''}`, { signal: controller.signal }).then(data => {
      if (controller.signal.aborted) return;
      setSlots(data.slots);
      setDay(current => data.slots.some(slot => slot.day === current) ? current : data.slots[0]?.day || '');
      setSelected(current => data.slots.some(slot => slot.startsAt === current) ? current : '');
    }).catch(e => { if (!controller.signal.aborted) setError(e.message || 'Não foi possível buscar horários.'); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [step, serviceId, changing?.id, reload]);
  async function confirm() {
    if (busy || !service || !selected) return;
    setBusy(true); setError('');
    try {
      const visit = await request<PatientVisit>('/patient/appointments', { method: 'POST', body: JSON.stringify({ serviceId, startsAt: selected, ...(changing ? { appointmentId: changing.id } : {}) }) });
      onSaved(visit); setSaved(visit); setStep(3);
    } catch (e) { setError(e instanceof Error ? e.message : 'Tente novamente.'); }
    finally { setBusy(false); }
  }
  const days = [...new Set(slots.map(s => s.day))];
  return <section className="patient-experience patient-booking">
    {step < 3 && <><div className="booking-top"><button className="patient-link" disabled={busy} onClick={() => { setError(''); step ? setStep(step - 1) : onClose(); }}>← {step ? 'Voltar uma etapa' : 'Voltar para consultas'}</button><span>{changing ? 'Reagendamento' : 'Novo agendamento'}</span></div><ol className="booking-steps" aria-label="Etapas do agendamento">{['Consulta', 'Horário', 'Confirmar'].map((label, i) => <li key={label} aria-current={step === i ? 'step' : undefined} className={i <= step ? 'reached' : ''}><span>{i < step ? <UiIcon name="check" size={16} /> : i + 1}</span>{label}</li>)}</ol></>}
    <div className="card booking-card">
      <span className="eyebrow">{step < 3 ? `Etapa ${step + 1} de 3 · No seu ritmo` : 'Tudo pronto'}</span>
      <h1 ref={heading} tabIndex={-1}>{step === 0 ? 'Qual consulta você precisa?' : step === 1 ? 'Escolha o dia e o horário' : step === 2 ? 'Confira antes de confirmar' : changing ? 'Consulta reagendada!' : 'Consulta confirmada!'}</h1>
      {step === 0 && <><p>Atendimento com {profile.name}. Escolha uma opção para continuar.</p><fieldset className="service-options"><legend className="sr-only">Tipo de consulta</legend>{profile.services.map(s => <label className={`service-option ${s.id === serviceId ? 'chosen' : ''}`} key={s.id}><input type="radio" name="service" value={s.id} checked={s.id === serviceId} onChange={() => { setServiceId(s.id); setDay(''); setSelected(''); }} /><span><strong>{s.title}</strong><small>{s.description}</small><small>Em média, {s.durationMinutes} minutos · {s.title === 'Teleconsulta' ? 'Por chamada' : 'Presencial'}</small></span></label>)}</fieldset></>}
      {step === 1 && <><p>{service?.title} · {profile.name}</p><p className="booking-timezone">Todos os horários são de Brasília. Agenda de demonstração para os próximos 21 dias, de segunda a sexta.</p>{loading ? <p className="patient-loading" role="status">Buscando horários disponíveis…</p> : slots.length ? <><label className="booking-day">Escolha o dia<select value={day} onChange={e => { setDay(e.target.value); setSelected(''); }}>{days.map(d => <option key={d} value={d}>{dateLabel(d + 'T12:00:00-03:00')}</option>)}</select></label><fieldset className="time-options"><legend>Escolha o horário</legend><div className="time-grid">{slots.filter(s => s.day === day).map(s => <label key={s.startsAt} className={`time-option ${selected === s.startsAt ? 'chosen' : ''}`}><input className="sr-only" type="radio" name="time" checked={selected === s.startsAt} onChange={() => setSelected(s.startsAt)} /><span>{hourLabel(s.startsAt)}</span></label>)}</div></fieldset><p className="slot-explanation">O horário será reservado depois da sua confirmação.</p></> : !error && <div className="patient-empty"><h2>Nenhum horário disponível agora</h2><p>Entre na fila de espera para receber um aviso quando uma vaga compatível for liberada.</p><button className="btn" onClick={onWaitlist}>Entrar na fila de espera</button></div>}{error && <button className="btn" onClick={() => setReload(n => n + 1)}>Buscar horários novamente</button>}</>}
      {step === 2 && <><p>Está tudo certo? Sua consulta só será {changing ? 'alterada' : 'marcada'} ao tocar em confirmar.</p><div className="booking-review"><span className="patient-status"><UiIcon name="appointments" size={17} />{changing ? 'Nova data e horário' : 'Dados da sua consulta'}</span><h2>{service?.title}</h2><p>{profile.name}<br />{profile.crm}</p><p><strong>{dateLabel(selected)}</strong><br />às <strong>{hourLabel(selected)}</strong> · Horário de Brasília</p><p>{service?.title === 'Teleconsulta' ? 'Por chamada · A sala será liberada pela médica.' : `Presencial · ${profile.city}, ${profile.state}. Confirme o endereço com a clínica.`}</p>{changing && <small>A consulta anterior será substituída somente após a confirmação.</small>}</div></>}
      {step === 3 && saved && <><div className="booking-success-icon"><UiIcon name="check" size={36} /></div><p>A data e os detalhes ficaram salvos em Minhas consultas.</p><VisitSummary visit={saved} /><button className="btn primary full" onClick={onClose}>Ver minhas consultas<UiIcon name="arrow" size={19} /></button></>}
      <ErrorNotice message={error} />
      {step < 3 && <div className="booking-bottom">{step === 2 ? <><button className="btn primary" disabled={busy} onClick={confirm}>{busy ? 'Confirmando…' : changing ? 'Confirmar reagendamento' : 'Confirmar consulta'}</button>{error && <button className="btn" disabled={busy} onClick={() => { setError(''); setStep(1); }}>Escolher outro horário</button>}</> : <button className="btn primary" disabled={step === 0 ? !service : !selected || loading} onClick={() => { setError(''); setStep(step + 1); }}>Continuar<UiIcon name="arrow" size={19} /></button>}<small>{step === 2 ? 'Você pode alterar a consulta depois.' : 'Você pode voltar e revisar suas escolhas.'}</small></div>}
    </div>
    {step < 3 && <p className="patient-demo-note">Demonstração com dados fictícios. Não há cobrança.</p>}
  </section>;
}

export function PatientWaitlist({ profile, request, onBook }: { profile: Profile; request: Request; onBook: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [serviceId, setServiceId] = useState(profile.services[0]?.id || 0);
  const [period, setPeriod] = useState('any');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    request<Entry[]>('/patient/waitlist', { signal: controller.signal }).then(data => { if (!controller.signal.aborted) { setEntries(data); setPeriod(data.find(entry => entry.serviceId === serviceId)?.period || 'any'); } }).catch(e => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [request, reload]);
  async function join() {
    setBusy(true); setError(''); setNotice('');
    try { const entry = await request<Entry>('/patient/waitlist', { method: 'POST', body: JSON.stringify({ serviceId, period }) }); setEntries(old => [...old.filter(e => e.id !== entry.id), entry]); setNotice('Preferência salva. Você receberá um aviso no aplicativo quando uma vaga compatível for liberada, se os avisos de consultas estiverem ativados.'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Tente novamente.'); }
    finally { setBusy(false); }
  }
  async function remove(entry: Entry) {
    setBusy(true); setError('');
    try { await request(`/patient/waitlist/${entry.id}`, { method: 'DELETE' }); setEntries(old => old.filter(e => e.id !== entry.id)); setNotice('Você saiu desta fila. Suas consultas continuam marcadas.'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Tente novamente.'); }
    finally { setBusy(false); }
  }
  return <section className="patient-experience patient-waitlist"><header className="patient-page-heading"><div><span className="eyebrow">Mais possibilidades</span><h1 tabIndex={-1}>Fila de espera</h1><p>Receba um aviso quando outro paciente liberar um horário.</p></div></header><div className="card booking-card"><h2>Qual horário você procura?</h2><p>Escolha sua preferência. Entrar na fila não cancela consultas e não reserva uma vaga.</p><label>Tipo de consulta<select value={serviceId} onChange={e => { const id = Number(e.target.value); setServiceId(id); setPeriod(entries.find(entry => entry.serviceId === id)?.period || 'any'); }}>{profile.services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></label><label>Período de preferência<select value={period} onChange={e => setPeriod(e.target.value)}>{Object.entries(periodLabel).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><ErrorNotice message={error} />{notice && <div className="patient-notice" role="status">{notice}</div>}<button className="btn primary" disabled={busy || loading} onClick={join}>{busy ? 'Salvando…' : 'Salvar preferência na fila'}</button></div><section className="card booking-card"><h2>Suas preferências</h2>{loading ? <p role="status">Carregando sua fila…</p> : error && !entries.length ? <button className="btn" onClick={() => setReload(n => n + 1)}>Tentar carregar novamente</button> : entries.length ? entries.map(e => <div className="waitlist-entry" key={e.id}><div><strong>{e.service}</strong><span>{periodLabel[e.period]}</span>{e.lastNotifiedAt && <small>Uma vaga foi liberada. Consulte os horários disponíveis.</small>}</div><button className="btn" disabled={busy} onClick={() => remove(e)}>Sair desta fila</button></div>) : <p>Você ainda não está em nenhuma fila.</p>}<button className="patient-link" onClick={onBook}>Ver horários disponíveis<UiIcon name="arrow" size={18} /></button><p className="slot-explanation">Os avisos ficam no aplicativo. A vaga é confirmada por quem concluir o agendamento primeiro. Não há reserva exclusiva ou aviso por WhatsApp nesta versão.</p></section></section>;
}
