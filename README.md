pqDate — Minimal, predictable, UTC-first date library

Descripción
- UTC-first, immutable operations with month/year EOM safety
- Predictable API: parseISO, formatISO, add, sub, startOf, endOf, comparisons
- Localized output via Intl for es-ES and en-US
- Business rule: lastBusinessDayOfMonth
- Modular, tree-shakable, no heavy deps, works in Node and browsers (UMD)

- Operaciones inmutables con prioridad UTC y seguridad de fin de mes/año

- API predecible: parseISO, formatISO, add, sub, startOf, endOf, comparaciones
- Salida localizada mediante Intl para es-ES y en-US

- Regla de negocio: último día hábil del mes

- Modular, optimizable mediante tree shaking, sin dependencias pesadas, compatible con Node y navegadores (UMD)

Instalar
- npm: npm install pqdate
- Import ESM: import { add, parseISO } from 'pqdate'
 - UMD: dist/pqdate.umd.js expone el global pqDate

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
  - differenceInDays(a: Date, b: Date): number
  - isSame(a: Date, b: Date, unit: 'day'|'month'|'year'): boolean
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

- Inmutabilidad: todas las funciones devuelven nuevas instancias de Date.

- Política UTC: todas las operaciones aritméticas y de truncamiento utilizan los métodos getter/setter de UTC.

- toLocal: devuelve un objeto Date construido con los componentes UTC originales como hora local.

- Validación: las entradas o intervalos no válidos generan una excepción PqDateError con los códigos: E_PARSE_INVALID, E_RANGE, E_ARG_INVALID.

Build
- tsup builds ESM/CJS/UMD into dist/
- size-limit enforces core bundle ≤ 20KB gzip
- Tests: vitest under tests/

Examples
- examples/browser-umd: plain script with global pqDate
- examples/esm: simple ESM usage

Ejemplos rápidas
- Rango de hoy a fin de mes

```ts
import { startOf, endOf, parseISO, formatISO } from 'pqdate';

const hoy = new Date();
const inicioHoy = startOf(hoy, 'day');
const finMes = endOf(hoy, 'month');
console.log(formatISO(inicioHoy), formatISO(finMes));
```

- Sumar meses respetando fin de mes

```ts
import { parseISO, add, formatISO } from 'pqdate';

const d = parseISO('2025-01-31T00:00:00Z');
console.log(formatISO(add(d, { months: 1 }))); // 2025-02-28T00:00:00.000Z
```

- Diferencia en días (UTC, truncado a inicio de día)

```ts
import { differenceInDays, parseISO } from 'pqdate';

const a = parseISO('2025-03-02T10:00:00Z');
const b = parseISO('2025-03-01T23:59:59Z');
console.log(differenceInDays(a, b)); // 1
```

- ¿Mismo día/mes/año?

```ts
import { isSame, parseISO } from 'pqdate';

const a = parseISO('2025-03-15T00:00:00Z');
const b = parseISO('2025-03-15T23:59:59Z');
console.log(isSame(a, b, 'day')); // true
```

- Último día hábil del mes

```ts
import { lastBusinessDayOfMonth, parseISO, formatISO } from 'pqdate';

const d = parseISO('2025-03-01T00:00:00Z');
console.log(formatISO(lastBusinessDayOfMonth(d))); // 2025-03-31T00:00:00.000Z
```

- Mostrar hora “de pared” local a partir de un UTC

```ts
import { toLocal, parseISO } from 'pqdate';

const utc = parseISO('2025-01-31T12:34:56Z');
const local = toLocal(utc);
// Los componentes locales de 'local' coinciden con los UTC de 'utc'
```

