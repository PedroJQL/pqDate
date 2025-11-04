import { describe, it, expect } from 'vitest';
import { parseISO } from '../packages/core/src/index';
import { formatLocal } from '../packages/intl/src/index';

describe('RF-08 — Formato local ES/EN con Intl', () => {
  const d = parseISO('2025-01-31T00:00:00Z');
  it('formato fecha ES corto', () => {
    const s = formatLocal(d, { locale: 'es-ES', dateStyle: 'short' });
    // Debe parecer DD/MM/AAAA en ES
    expect(/\d{1,2}\/\d{1,2}\/\d{2,4}/.test(s)).toBe(true);
  });
  it('formato fecha EN corto', () => {
    const s = formatLocal(d, { locale: 'en-US', dateStyle: 'short' });
    // Debe parecer MM/DD/YY en EN
    expect(/\d{1,2}\/\d{1,2}\/\d{2}/.test(s)).toBe(true);
  });
});

