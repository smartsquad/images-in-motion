import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const src = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'images-in-motion/react': src('../../../src/react/index.ts'),
      'images-in-motion/core': src('../../../src/core/index.ts'),
      'images-in-motion': src('../../../src/js/index.ts'),
    },
  },
})
