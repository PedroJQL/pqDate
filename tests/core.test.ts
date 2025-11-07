import { describe, it, expect } from 'vitest';
import { parseISO, formatISO, add, sub, startOf, endOf, isBefore, isAfter, isWithinInterval, assertValid, toLocal, PqDateError, differenceInDays, isSame } from '../packages/core/src/index';

describe('RF-01 — Parse y formato ISO', () => {
  it('parseISO debe aceptar ISO y formatISO debe devolver ISO', () => {
    const d = parseISO('2025-01-31T00:00:00Z');
    expect(formatISO(d)).toBe('2025-01-31T00:00:00.000Z');
  });

  it('parseISO debe rechazar entradas no ISO', () => {
    expect(() => parseISO('31/01/2025')).toThrowError(PqDateError);
    try {
      parseISO('31/01/2025');
    } catch (e: any) {
      expect(e.code).toBe('E_PARSE_INVALID');
    }
  });
});

describe('RF-03 — Aritmética temporal con EOM-safe', () => {
  it('add months debe manejar fin de mes', () => {
    const d = parseISO('2025-01-31T00:00:00Z');
    const n = add(d, { months: 1 });
    expect(formatISO(n)).toBe('2025-02-28T00:00:00.000Z');
  });

  it('add y sub son inmutables', () => {
    const d = parseISO('2025-01-31T00:00:00Z');
    const n = add(d, { days: 1 });
    const m = sub(d, { days: 1 });
    expect(n).not.toBe(d);
    expect(m).not.toBe(d);
    expect(formatISO(d)).toBe('2025-01-31T00:00:00.000Z');
  });
});

describe('RF-03 — startOf/endOf', () => {
  const d = parseISO('2025-03-15T10:20:30Z');
  it('startOf day/month/year', () => {
    expect(formatISO(startOf(d, 'day'))).toBe('2025-03-15T00:00:00.000Z');
    expect(formatISO(startOf(d, 'month'))).toBe('2025-03-01T00:00:00.000Z');
    expect(formatISO(startOf(d, 'year'))).toBe('2025-01-01T00:00:00.000Z');
  });
  it('endOf day/month/year', () => {
    expect(formatISO(endOf(d, 'day'))).toBe('2025-03-15T23:59:59.999Z');
    expect(formatISO(endOf(d, 'month'))).toBe('2025-03-31T23:59:59.999Z');
    expect(formatISO(endOf(d, 'year'))).toBe('2025-12-31T23:59:59.999Z');
  });
});

describe('RF-04 — Comparaciones y rangos', () => {
  const a = parseISO('2025-01-01T00:00:00Z');
  const b = parseISO('2025-01-02T00:00:00Z');
  it('isBefore / isAfter', () => {
    expect(isBefore(a, b)).toBe(true);
    expect(isAfter(b, a)).toBe(true);
  });
  it('isWithinInterval inclusivo', () => {
    expect(isWithinInterval(a, { start: a, end: b })).toBe(true);
    expect(isWithinInterval(b, { start: a, end: b })).toBe(true);
  });
  it('isWithinInterval valida rango', () => {
    expect(() => isWithinInterval(a, { start: b, end: a })).toThrowError(PqDateError);
  });
});

describe('RF-05 — UTC a local', () => {
  it('toLocal produce coincidencia de pared local con componentes UTC', () => {
    const d = parseISO('2025-01-31T12:34:56Z');
    const local = toLocal(d);
    // Los componentes locales del Date original coincidien con los UTC del original tras toLocal
    expect(local.getFullYear()).toBe(d.getUTCFullYear());
    expect(local.getMonth()).toBe(d.getUTCMonth());
    expect(local.getDate()).toBe(d.getUTCDate());
    expect(local.getHours()).toBe(d.getUTCHours());
    expect(local.getMinutes()).toBe(d.getUTCMinutes());
  });
});

describe('RF-07 — Validación y seguridad', () => {
  it('assertValid lanza E_PARSE_INVALID', () => {
    const bad = new Date('invalid');
    expect(() => assertValid(bad as any)).toThrowError(PqDateError);
    try {
      assertValid(bad as any);
    } catch (e: any) {
      expect(e.code).toBe('E_PARSE_INVALID');
    }
  });
});

describe('RF-06 — Utilidades de igualdad y diferencias', () => {
  it('differenceInDays usa truncado a inicio de día UTC y redondeo al entero', () => {
    const a = parseISO('2025-03-02T10:00:00Z');
    const b = parseISO('2025-03-01T23:59:59Z');
    expect(differenceInDays(a, b)).toBe(1);
    expect(differenceInDays(b, a)).toBe(-1);
  });
  it('isSame compara por unidad en UTC', () => {
    const a = parseISO('2025-03-15T00:00:00Z');
    const b = parseISO('2025-03-15T23:59:59Z');
    const c = parseISO('2025-03-16T00:00:00Z');
    expect(isSame(a, b, 'day')).toBe(true);
    expect(isSame(a, c, 'day')).toBe(false);
    expect(isSame(parseISO('2025-03-01T00:00:00Z'), parseISO('2025-03-31T00:00:00Z'), 'month')).toBe(true);
    expect(isSame(parseISO('2025-01-01T00:00:00Z'), parseISO('2025-12-31T00:00:00Z'), 'year')).toBe(true);
  });
});

