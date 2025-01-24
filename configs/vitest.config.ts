import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      '@jest/globals': 'vitest'
    },
    include: ['__tests__/**/*.test.ts'],
    isolate: false,
    watch: false
  }
});
