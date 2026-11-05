import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCalendarText } from '../src/calendar.ts';
const visit = { id: 42, service: 'Retorno', doctorName: 'Dra. Ana Martins', startsAt: '2026-11-06T09:00:00-03:00', durationMinutes: 30 };
const createdAt = new Date('2026-11-05T12:00:00Z');

test('Calendário preserva horário de Brasília, duração e identidade da consulta', () => {
  const text = createCalendarText(visit, createdAt);
  assert.ok(text.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n'));
  assert.ok(text.endsWith('END:VCALENDAR\r\n'));
  assert.ok(text.includes('UID:consulta-42@medisync.local\r\n'));
  assert.ok(text.includes('DTSTART:20261106T120000Z\r\n'));
  assert.ok(text.includes('DTEND:20261106T123000Z\r\n'));
  assert.ok(text.includes('DTSTAMP:20261105T120000Z\r\n'));
  assert.equal(text.split('BEGIN:VEVENT').length, 2);
});

test('Calendário escapa dados de texto e dobra linhas UTF-8 sem criar propriedades extras', () => {
  const service = 'Avaliação, prevenção; clínica \\ revisão\nBEGIN:VEVENT\n' + 'Coração 💚 '.repeat(18);
  const text = createCalendarText({ ...visit, service }, createdAt);
  const unfolded = text.replace(/\r\n /g, '');
  assert.ok(unfolded.includes('SUMMARY:Consulta: Avaliação\\, prevenção\\; clínica \\\\ revisão\\nBEGIN:VEVENT\\n'));
  assert.equal(text.split('\r\nBEGIN:VEVENT\r\n').length, 2);
  assert.ok(text.split('\r\n').every(line => Buffer.byteLength(line, 'utf8') <= 75));
  assert.ok(!text.includes('\uFFFD'));
});

test('Calendário rejeita datas e durações inválidas', () => {
  assert.throws(() => createCalendarText({ ...visit, startsAt: 'inválido' }, createdAt));
  assert.throws(() => createCalendarText({ ...visit, id: '42\r\nBEGIN:VEVENT' }, createdAt));
  for (const minutes of [0, -30, 9, 241, 25.5, NaN]) assert.throws(() => createCalendarText({ ...visit, durationMinutes: minutes }, createdAt));
});
