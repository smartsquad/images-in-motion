import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const src = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      'images-in-motion/core': src('../../../src/core/index.ts'),
      'images-in-motion': src('../../../src/js/index.ts'),
    },
  },
})
