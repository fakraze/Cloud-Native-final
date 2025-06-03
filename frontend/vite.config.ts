/// <reference types="node" />
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log("📦 VITE_BASE_PATH =", process.env.VITE_BASE_PATH);

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',

  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
