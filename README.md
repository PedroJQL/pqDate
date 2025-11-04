pqDate — Minimal, predictable, UTC-first date library

Overview
- UTC-first, immutable operations with month/year EOM safety
- Predictable API: parseISO, formatISO, add, sub, startOf, endOf, comparisons
- Localized output via Intl for es-ES and en-US
- Business rule: lastBusinessDayOfMonth
- Modular, tree-shakable, no heavy deps, works in Node and browsers (UMD)

Install
- npm: npm install pqdate
- Import ESM: import { add, parseISO } from 'pqdate'
- UMD: dist/pqdate.umd.cjs exposes global pqDate

Quick Start
import { parseISO, add, formatISO } from 'pqdate';
const d = parseISO('2025-01-31T00:00:00Z');
const n = add(d, { months: 1 });
console.log(formatISO(n)); // 2025-02-28T00:00:00.000Z

API
- Core
  - parseISO(input: string): Date
  - formatISO(d: Date): string
  - type Duration = Partial<{ years; months; days; hours; minutes; seconds }>
  - add(d: Date, dur: Duration): Date
  - sub(d: Date, dur: Duration): Date
  - startOf(d: Date, unit: 'day'|'month'|'year'): Date
  - endOf(d: Date, unit: 'day'|'month'|'year'): Date
  - isBefore(a: Date, b: Date): boolean
  - isAfter(a: Date, b: Date): boolean
  - isWithinInterval(d: Date, itv:{start:Date,end:Date}): boolean
  - assertValid(d: Date): void
  - toLocal(dUTC: Date): Date

- Intl
  - formatLocal(d: Date, opts?: { locale?: 'es-ES'|'en-US', dateStyle?: 'short'|'medium'|'long', timeStyle?: 'short'|'medium'|'long' }): string

- Rules
  - lastBusinessDayOfMonth(d: Date): Date

Design Notes
- Inmutability: all functions return new Date instances
- UTC policy: all arithmetic and truncation use UTC getters/setters
- toLocal: returns a Date constructed with the original UTC components as local wall time
- Validation: invalid inputs/intervals throw PqDateError with codes: E_PARSE_INVALID, E_RANGE, E_ARG_INVALID

Build
- tsup builds ESM/CJS/UMD into dist/
- size-limit enforces core bundle ≤ 20KB gzip
- Tests: vitest under tests/

Examples
- examples/browser-umd: plain script with global pqDate
- examples/esm: simple ESM usage

