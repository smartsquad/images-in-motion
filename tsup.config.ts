import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: {
      'core/index': 'src/core/index.ts',
      'js/index': 'src/js/index.ts',
      'react/index': 'src/react/index.ts',
      'vue/index': 'src/vue/index.ts',
    },
    format: ['esm'],
    dts: false,
    sourcemap: true,
    clean: true,
    splitting: false,
    treeshake: true,
    external: ['react', 'react/jsx-runtime', 'vue'],
    target: 'es2022',
  },
  {
    entry: { 'images-in-motion': 'src/js/runtime.ts' },
    format: ['iife'],
    globalName: 'ImagesInMotion',
    outDir: 'dist/iife',
    outExtension: () => ({ js: '.global.js' }),
    minify: true,
    sourcemap: true,
    target: 'es2022',
    footer: {
      js: 'if (typeof document !== "undefined") { ImagesInMotion.defineImagesInMotionElement() }',
    },
  },
])
