import { renameSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
// Normalize UMD/IIFE bundle name
const iife1 = join(dist, 'index.global.js');
const iife2 = join(dist, 'index.iife.js');
const umdOut = join(dist, 'pqdate.umd.js');

// Normalize ESM/CJS names to stable targets for exports
const esmJs = join(dist, 'index.js');
const esmMjs = join(dist, 'index.mjs');
const cjsJs = join(dist, 'index.cjs');

try {
  if (existsSync(iife1)) renameSync(iife1, umdOut);
  else if (existsSync(iife2)) renameSync(iife2, umdOut);
  // ESM: prefer .mjs for clarity
  if (!existsSync(esmMjs) && existsSync(esmJs) && !existsSync(cjsJs)) {
    // Single ESM output as index.js -> rename to index.mjs
    renameSync(esmJs, esmMjs);
  } else if (!existsSync(esmMjs) && existsSync(esmJs) && existsSync(cjsJs)) {
    // Both formats exist: assume index.js is ESM, index.cjs is CJS
    renameSync(esmJs, esmMjs);
  }
} catch (e) {
  // Best-effort rename; non-fatal in CI environments
}
