import { parseISO, add, formatISO, formatLocal } from '../../dist/index.mjs';

const d = parseISO('2025-01-31T00:00:00Z');
const n = add(d, { months: 1 });
console.log(formatISO(n));
console.log(formatLocal(n, { locale: 'en-US', dateStyle: 'long' }));

