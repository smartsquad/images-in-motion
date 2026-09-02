import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const ERoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: ERoot,
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      'images-in-motion/react': fileURLToPath(new URL('../src/react/index.ts', import.meta.url)),
      'images-in-motion/core': fileURLToPath(new URL('../src/core/index.ts', import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
  },
  server: {
    host: '127.0.0.1',
    port: 4179,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4179,
    strictPort: true,
  },
})
