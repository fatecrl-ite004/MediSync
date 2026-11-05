export type CalendarVisit = {
  id: number;
  service: string;
  doctorName: string;
  startsAt: string;
  durationMinutes?: number;
};

function escapeText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

// RFC 5545 content lines use CRLF and fold at a maximum of 75 UTF-8 octets.
function foldLine(value: string) {
  const encoder = new TextEncoder();
  let line = '', size = 0;
  const lines: string[] = [];
  for (const character of value) {
    const bytes = encoder.encode(character).length;
    if (size + bytes > 75) { lines.push(line); line = ' '; size = 1; }
    line += character;
    size += bytes;
  }
  lines.push(line);
  return lines.join('\r\n');
}

export function createCalendarText(visit: CalendarVisit, createdAt = new Date()) {
  const start = new Date(visit.startsAt);
  const minutes = visit.durationMinutes ?? 50;
  if (!Number.isSafeInteger(visit.id) || visit.id < 0 || !Number.isFinite(start.getTime()) || !Number.isFinite(createdAt.getTime()) || !Number.isInteger(minutes) || minutes < 10 || minutes > 240) {
    throw new Error('Não foi possível preparar o calendário desta consulta.');
  }
  const stamp = (value: Date) => value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MediSync//Agenda//PT-BR', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', `UID:consulta-${visit.id}@medisync.local`, `DTSTAMP:${stamp(createdAt)}`,
    `DTSTART:${stamp(start)}`, `DTEND:${stamp(new Date(start.getTime() + minutes * 60000))}`,
    `SUMMARY:${escapeText('Consulta: ' + visit.service)}`,
    `DESCRIPTION:${escapeText(visit.doctorName + '\nConfira os detalhes no MediSync. Se a consulta mudar, atualize o evento no seu calendário. Demonstração com dados fictícios.')}`,
    `LOCATION:${escapeText(visit.service === 'Teleconsulta' ? 'Online: abra o MediSync' : 'Presencial: confirme o endereço com a clínica')}`,
    'END:VEVENT', 'END:VCALENDAR'
  ].map(foldLine).join('\r\n') + '\r\n';
}

export function downloadCalendar(visit: CalendarVisit) {
  const url = URL.createObjectURL(new Blob([createCalendarText(visit)], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = `medisync-consulta-${visit.id}.ics`;
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
