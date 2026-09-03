import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const ERoot = process.cwd()
const EConfig = readFileSync(path.join(ERoot, 'docs/.vitepress/config.ts'), 'utf8')

describe('docs SEO head', () => {
  it('declares Open Graph, Twitter Card, and search tags', () => {
    expect(EConfig).toContain("property: 'og:image:width'")
    expect(EConfig).toContain("property: 'og:image:height'")
    expect(EConfig).toContain("property: 'og:url'")
    expect(EConfig).toContain("property: 'og:site_name'")
    expect(EConfig).toContain("property: 'og:locale'")
    expect(EConfig).toContain("property: 'og:image:alt'")
    expect(EConfig).toContain("name: 'twitter:card'")
    expect(EConfig).toContain('summary_large_image')
    expect(EConfig).toContain("rel: 'canonical'")
    expect(EConfig).toContain('apple-touch-icon')
    expect(EConfig).toContain('favicon.ico')
    expect(EConfig).toContain('favicon-32x32.png')
    expect(EConfig).toContain('site.webmanifest')
    expect(EConfig).toContain('theme-color')
    expect(EConfig).toContain('application/ld+json')
    expect(EConfig).toContain('/og.jpg')
    expect(EConfig).not.toContain('/og.png')
  })

  it('keeps the social JPEG under the WhatsApp 500 KB limit', () => {
    const jpg = path.join(ERoot, 'assets/og.jpg')
    expect(existsSync(jpg)).toBe(true)
    expect(statSync(jpg).size).toBeLessThan(500 * 1024)
  })

  it('ships raster icons next to the SVG mark', () => {
    for (const file of [
      'assets/favicon.ico',
      'assets/favicon-32x32.png',
      'assets/apple-touch-icon.png',
      'docs/public/favicon.ico',
      'docs/public/site.webmanifest',
      'docs/public/robots.txt',
    ]) {
      expect(existsSync(path.join(ERoot, file))).toBe(true)
    }
  })
})
