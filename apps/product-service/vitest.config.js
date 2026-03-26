import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    testTimeout: 180_000,
    hookTimeout: 180_000,
    clearMocks: true,
    restoreMocks: true,
  },
});
