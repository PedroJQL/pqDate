// pqDate core: UTC-first, immutable operations

export type Duration = Partial<{
  years: number; months: number; days: number; hours: number; minutes: number; seconds: number;
}>;

export type PqErrorCode = 'E_PARSE_INVALID' | 'E_RANGE' | 'E_ARG_INVALID';

export class PqDateError extends Error {
  public code: PqErrorCode;
  constructor(code: PqErrorCode, message: string) {
    super(message);
    this.name = 'PqDateError';
    this.code = code;
  }
}

function isValidDate(d: Date): boolean {
  return d instanceof Date && !isNaN(d.getTime());
}

export function assertValid(d: Date): void {
  if (!isValidDate(d)) {
    throw new PqDateError('E_PARSE_INVALID', 'Invalid date');
  }
}

// RF-01 parseISO: ISO 8601 input only
export function parseISO(input: string): Date {
  if (typeof input !== 'string') {
    throw new PqDateError('E_ARG_INVALID', 'parseISO expects string input');
  }
  // Rely on native ISO parser; reject non-ISO quickly
  // Basic ISO shape check (YYYY-MM-DD...) to avoid locale inputs
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(input) && !/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    throw new PqDateError('E_PARSE_INVALID', 'Input must be ISO 8601');
  }
  const d = new Date(input);
  assertValid(d);
  return new Date(d.getTime());
}

// RF-01 formatISO
export function formatISO(d: Date): string {
  assertValid(d);
  return new Date(d.getTime()).toISOString();
}

function daysInMonthUTC(year: number, monthIndex: number): number {
  // monthIndex: 0..11; construct first day of next month in UTC then go one day back
  const firstNext = Date.UTC(monthIndex === 11 ? year + 1 : year, (monthIndex + 1) % 12, 1);
  const lastCurrent = new Date(firstNext - 24 * 3600 * 1000);
  return lastCurrent.getUTCDate();
}

function clampDayUTC(year: number, monthIndex: number, day: number): number {
  return Math.min(day, daysInMonthUTC(year, monthIndex));
}

function addMonthsUTC(d: Date, months: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const dt = d.getUTCDate();
  const hh = d.getUTCHours();
  const mm = d.getUTCMinutes();
  const ss = d.getUTCSeconds();
  const ms = d.getUTCMilliseconds();

  const totalMonths = m + (months || 0);
  const targetYear = y + Math.floor(totalMonths / 12);
  const targetMonth = ((totalMonths % 12) + 12) % 12;
  const day = clampDayUTC(targetYear, targetMonth, dt);
  const ts = Date.UTC(targetYear, targetMonth, day, hh, mm, ss, ms);
  return new Date(ts);
}

function addYearsUTC(d: Date, years: number): Date {
  return addMonthsUTC(d, (years || 0) * 12);
}

function addDaysUTC(d: Date, days: number): Date {
  const ts = d.getTime() + (days || 0) * 24 * 3600 * 1000;
  return new Date(ts);
}

function addHMSUTC(d: Date, hours = 0, minutes = 0, seconds = 0): Date {
  const delta = ((hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)) * 1000;
  return new Date(d.getTime() + delta);
}

// RF-03 add
export function add(d: Date, dur: Duration): Date {
  assertValid(d);
  if (!dur || typeof dur !== 'object') {
    throw new PqDateError('E_ARG_INVALID', 'add expects Duration');
  }
  let r = new Date(d.getTime());
  if (dur.years) r = addYearsUTC(r, dur.years);
  if (dur.months) r = addMonthsUTC(r, dur.months);
  if (dur.days) r = addDaysUTC(r, dur.days);
  if (dur.hours || dur.minutes || dur.seconds) {
    r = addHMSUTC(r, dur.hours, dur.minutes, dur.seconds);
  }
  return r;
}

// RF-03 sub
export function sub(d: Date, dur: Duration): Date {
  const negate: Duration = {};
  if (dur?.years) negate.years = -dur.years;
  if (dur?.months) negate.months = -dur.months;
  if (dur?.days) negate.days = -dur.days;
  if (dur?.hours) negate.hours = -dur.hours;
  if (dur?.minutes) negate.minutes = -dur.minutes;
  if (dur?.seconds) negate.seconds = -dur.seconds;
  return add(d, negate);
}

// RF-03/04 startOf, endOf
export function startOf(d: Date, unit: 'day'|'month'|'year'): Date {
  assertValid(d);
  if (unit === 'day') {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
  }
  if (unit === 'month') {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0));
  }
  if (unit === 'year') {
    return new Date(Date.UTC(d.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
  }
  throw new PqDateError('E_ARG_INVALID', 'Invalid unit');
}

export function endOf(d: Date, unit: 'day'|'month'|'year'): Date {
  assertValid(d);
  if (unit === 'day') {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  }
  if (unit === 'month') {
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const dim = daysInMonthUTC(y, m);
    return new Date(Date.UTC(y, m, dim, 23, 59, 59, 999));
  }
  if (unit === 'year') {
    return new Date(Date.UTC(d.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
  }
  throw new PqDateError('E_ARG_INVALID', 'Invalid unit');
}

// RF-04 comparisons
export function isBefore(a: Date, b: Date): boolean {
  assertValid(a); assertValid(b);
  return a.getTime() < b.getTime();
}

export function isAfter(a: Date, b: Date): boolean {
  assertValid(a); assertValid(b);
  return a.getTime() > b.getTime();
}

export function isWithinInterval(d: Date, itv: {start: Date; end: Date;}): boolean {
  assertValid(d);
  assertValid(itv?.start as Date);
  assertValid(itv?.end as Date);
  const start = itv.start.getTime();
  const end = itv.end.getTime();
  if (start > end) throw new PqDateError('E_RANGE', 'Interval start > end');
  const t = d.getTime();
  return t >= start && t <= end;
}

// RF-05 timezone: toLocal
// Convert a UTC-internal Date to a Date whose local wall-time equals the original UTC components.
// Example: 2025-01-31T00:00:00Z -> new Date(2025,0,31,0,0,0) (local time)
export function toLocal(dUTC: Date): Date {
  assertValid(dUTC);
  return new Date(
    dUTC.getUTCFullYear(),
    dUTC.getUTCMonth(),
    dUTC.getUTCDate(),
    dUTC.getUTCHours(),
    dUTC.getUTCMinutes(),
    dUTC.getUTCSeconds(),
    dUTC.getUTCMilliseconds()
  );
}

