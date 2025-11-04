import { describe, it, expect } from 'vitest';
import { parseISO, formatISO } from '../packages/core/src/index';
import { lastBusinessDayOfMonth } from '../packages/rules/src/index';

describe('RF-09 — Regla último día hábil de mes', () => {
  it('si fin de mes es fin de semana, retrocede a viernes', () => {
    // Agosto 2020 terminó en Lunes 31; busquemos uno en fin de semana: Octubre 2020 -> 31 es sábado
    const d = parseISO('2020-10-15T00:00:00Z');
    const lbd = lastBusinessDayOfMonth(d);
    expect(formatISO(lbd)).toBe('2020-10-30T00:00:00.000Z'); // Viernes 30
  });
  it('si fin de mes es día laboral, lo devuelve', () => {
    const d = parseISO('2025-03-01T00:00:00Z');
    const lbd = lastBusinessDayOfMonth(d);
    expect(formatISO(lbd)).toBe('2025-03-31T00:00:00.000Z');
  });
});

