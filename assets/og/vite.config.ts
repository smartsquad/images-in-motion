import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const ERoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: ERoot,
  resolve: {
    alias: {
      'images-in-motion': fileURLToPath(new URL('../../src/js/index.ts', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 4180,
    strictPort: true,
    fs: {
      allow: [fileURLToPath(new URL('../..', import.meta.url))],
    },
  },
})
