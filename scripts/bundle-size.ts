import { constants, brotliCompressSync, gzipSync } from 'node:zlib'
import { readFileSync, statSync } from 'node:fs'

interface ISizeRow {
  label: string
  path: string
  minified: boolean
}

const EFiles: readonly ISizeRow[] = [
  { label: 'IIFE (CDN, minified as shipped)', path: 'dist/iife/images-in-motion.global.js', minified: true },
  { label: 'JS ESM (`images-in-motion`)', path: 'dist/js/index.js', minified: false },
  { label: 'Core ESM (`images-in-motion/core`)', path: 'dist/core/index.js', minified: false },
  { label: 'React ESM (`images-in-motion/react`)', path: 'dist/react/index.js', minified: false },
  { label: 'Vue ESM (`images-in-motion/vue`)', path: 'dist/vue/index.js', minified: false },
]

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(2)} KB`
}

function measure(buffer: Buffer): { raw: number; gzip: number; brotli: number } {
  return {
    raw: buffer.byteLength,
    gzip: gzipSync(buffer, { level: 9 }).byteLength,
    brotli: brotliCompressSync(buffer, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).byteLength,
  }
}

function print(label: string, sizes: { raw: number; gzip: number; brotli: number }): void {
  console.log(label)
  console.log(`  raw      ${kb(sizes.raw)}  (${sizes.raw} B)`)
  console.log(`  gzip -9  ${kb(sizes.gzip)}  (${sizes.gzip} B)`)
  console.log(`  brotli   ${kb(sizes.brotli)}  (${sizes.brotli} B)`)
}

for (const file of EFiles) {
  statSync(file.path)
  print(file.label, measure(readFileSync(file.path)))
}

const bundled = await Bun.build({
  entrypoints: ['dist/js/index.js'],
  minify: true,
  target: 'browser',
  format: 'esm',
})
if (!bundled.success) {
  throw new Error('Bun.build minify of dist/js/index.js failed.')
}
const minified = Buffer.from(await bundled.outputs[0]!.text())
print('JS ESM after Bun.build minify', measure(minified))
