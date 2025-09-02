/// <reference types="vitest" />
// @ts-nocheck - Vite 6 + React plugin types issue
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // @ts-ignore - Vitest config
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@madboat/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@madboat/core': path.resolve(__dirname, '../../packages/core/src'),
    }
  }
})