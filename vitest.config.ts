import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: false,
    threads: false
  },
  resolve: {
    alias: {
      '@pqdate/core': path.resolve(__dirname, 'packages/core/src/index.ts'),
      '@pqdate/intl': path.resolve(__dirname, 'packages/intl/src/index.ts'),
      '@pqdate/rules': path.resolve(__dirname, 'packages/rules/src/index.ts')
    }
  }
});
