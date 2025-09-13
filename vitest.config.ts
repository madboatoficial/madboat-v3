/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/test-utils.ts',
        '**/vitest.setup.ts',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@madboat/core': resolve(__dirname, './packages/core/src'),
      '@madboat/ui': resolve(__dirname, './packages/ui/src'),
      '@madboat/api': resolve(__dirname, './packages/api/src'),
      '@madboat/auth': resolve(__dirname, './packages/auth/src'),
      '@madboat/rlvr': resolve(__dirname, './packages/rlvr/src'),
    },
  },
})