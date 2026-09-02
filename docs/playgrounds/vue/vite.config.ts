import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const src = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'images-in-motion/vue': src('../../../src/vue/index.ts'),
      'images-in-motion/core': src('../../../src/core/index.ts'),
      'images-in-motion': src('../../../src/js/index.ts'),
    },
  },
})
