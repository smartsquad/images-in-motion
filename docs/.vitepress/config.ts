import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import llmsVitePlugin, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms'
import { version } from '../../package.json'
import { frameworkNavItems, frameworkSidebarItems } from './frameworks'

const ESiteOrigin = 'https://iim.smartsquad.io'
const EBase = '/'
const ESiteDescription = 'Open-source JS library for displaying independent columns, opposite directions: a continuous animated image pattern for the web.'
const EOgImage = `${ESiteOrigin}/og.jpg`
const EOgImageAlt = 'Open-source JS library for displaying independent columns, opposite directions: a continuous animated image pattern for the web.'
const EPublicAsset = (file: string) => `${EBase}${file}`
const ESrc = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))

function pageCanonicalUrl(relativePath: string): string {
  const path = relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html')
  return `${ESiteOrigin}/${path}`
}

/** StackBlitz WebContainers need a cross-origin isolated parent. `credentialless` keeps Unsplash and other no-cors assets loadable. */
const ECrossOriginIsolationHeaders = {
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

function crossOriginIsolation(): Plugin {
  const apply = (_req: unknown, res: { setHeader: (name: string, value: string) => void }, next: () => void) => {
    res.setHeader('Cross-Origin-Embedder-Policy', ECrossOriginIsolationHeaders['Cross-Origin-Embedder-Policy'])
    res.setHeader('Cross-Origin-Opener-Policy', ECrossOriginIsolationHeaders['Cross-Origin-Opener-Policy'])
    next()
  }
  return {
    name: 'images-in-motion-coop-coep',
    configureServer(server) {
      server.middlewares.use(apply)
    },
    configurePreviewServer(server) {
      server.middlewares.use(apply)
    },
  }
}

function copyIifeToDocsPublic(): Plugin {
  return {
    name: 'images-in-motion-copy-iife',
    buildStart() {
      const from = ESrc('../../dist/iife/images-in-motion.global.js')
      const to = ESrc('../public/images-in-motion.global.js')
      if (!existsSync(from)) {
        return
      }
      mkdirSync(dirname(to), { recursive: true })
      copyFileSync(from, to)
    },
  }
}

export default defineConfig({
  lang: 'en-US',
  title: 'Images in motion',
  description: ESiteDescription,
  base: EBase,
  outDir: '.vitepress/dist',
  cacheDir: '.vitepress/cache',
  cleanUrls: false,
  lastUpdated: false,
  appearance: true,
  sitemap: {
    hostname: ESiteOrigin,
  },
  transformPageData(pageData) {
    const url = pageCanonicalUrl(pageData.relativePath)
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
    )
  },
  head: [
    ['link', { rel: 'icon', href: EPublicAsset('favicon.ico'), sizes: 'any' }],
    ['link', { rel: 'icon', href: EPublicAsset('favicon-32x32.png'), type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'icon', href: EPublicAsset('favicon.svg'), type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: EPublicAsset('favicon-light.svg'), type: 'image/svg+xml', media: '(prefers-color-scheme: light)' }],
    ['link', { rel: 'icon', href: EPublicAsset('favicon-dark.svg'), type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' }],
    ['link', { rel: 'apple-touch-icon', href: EPublicAsset('apple-touch-icon.png'), sizes: '180x180' }],
    ['link', { rel: 'manifest', href: EPublicAsset('site.webmanifest') }],
    ['meta', { name: 'theme-color', content: '#F3EFE8', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#141313', media: '(prefers-color-scheme: dark)' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Images in motion' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:title', content: 'Images in motion' }],
    ['meta', { property: 'og:description', content: ESiteDescription }],
    ['meta', { property: 'og:image', content: EOgImage }],
    ['meta', { property: 'og:image:type', content: 'image/jpeg' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: EOgImageAlt }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@massimodeluisa' }],
    ['meta', { name: 'twitter:title', content: 'Images in motion' }],
    ['meta', { name: 'twitter:description', content: ESiteDescription }],
    ['meta', { name: 'twitter:image', content: EOgImage }],
    ['meta', { name: 'twitter:image:alt', content: EOgImageAlt }],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'Images in motion',
          url: `${ESiteOrigin}/`,
          description: ESiteDescription,
          publisher: {
            '@type': 'Organization',
            name: 'Smart Squad S.r.l.',
            url: 'https://smartsquad.io',
          },
        },
        {
          '@type': 'SoftwareSourceCode',
          name: 'images-in-motion',
          description: ESiteDescription,
          codeRepository: 'https://github.com/smartsquad/images-in-motion',
          url: `${ESiteOrigin}/`,
          programmingLanguage: 'TypeScript',
          runtimePlatform: 'Web',
          license: 'https://opensource.org/licenses/MIT',
        },
      ],
    })],
  ],
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
      md.use(copyOrDownloadAsMarkdownButtons)
    },
  },
  themeConfig: {
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg',
      alt: 'Images in motion',
    },
    siteTitle: 'Images in motion',
    nav: [
      { text: 'Guide', link: '/guide' },
      {
        text: 'Frameworks',
        items: frameworkNavItems(),
      },
      { text: 'API', link: '/api' },
      { text: 'Examples', link: '/examples' },
      { text: 'Studio', link: '/studio/' },
      {
        text: `v${version}`,
        items: [
          { text: 'Changelog', link: 'https://github.com/smartsquad/images-in-motion/blob/main/CHANGELOG.md' },
          { text: 'Releases', link: 'https://github.com/smartsquad/images-in-motion/releases' },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Start',
        items: [
          { text: 'What it is', link: '/' },
          { text: 'Install and usage', link: '/guide' },
        ],
      },
      {
        text: 'Frameworks',
        items: frameworkSidebarItems(),
      },
      {
        text: 'Reference',
        items: [
          { text: 'API', link: '/api' },
          { text: 'No frames! Pure CSS', link: '/css' },
          { text: 'Image-free JSON', link: '/export' },
          { text: 'Bundle size', link: '/size' },
          { text: 'Examples', link: '/examples' },
          { text: 'Studio', link: '/studio/' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/smartsquad/images-in-motion' },
    ],
    editLink: {
      pattern: 'https://github.com/smartsquad/images-in-motion/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    search: {
      provider: 'local',
    },
    footer: {
      message: 'designed by <a href="https://github.com/samuelburlon">Samuel Burlon</a>, implemented by <a href="https://deluisa.me">Massimo De Luisa</a>',
      copyright: '© 2026 Smart Squad Srl. MIT License. Geometry in src/core, animation in src/js.',
    },
    outline: { level: [2, 3] },
  },
  vite: {
    plugins: [
      crossOriginIsolation(),
      copyIifeToDocsPublic(),
      react({ include: /\/studio\/.*\.[tj]sx?$/ }),
      groupIconVitePlugin({
        customIcon: {
          bun: 'logos:bun',
        },
      }),
      llmsVitePlugin({
        title: 'Images in motion',
        ignoreFiles: [
          'studio/**',
          'playgrounds/**',
        ],
      }),
    ],
    resolve: {
      alias: {
        vue: ESrc('../../node_modules/vue'),
        'images-in-motion/vue': ESrc('../../src/vue/index.ts'),
        'images-in-motion/react': ESrc('../../src/react/index.ts'),
        'images-in-motion/core': ESrc('../../src/core/index.ts'),
      },
      dedupe: ['vue'],
    },
    ssr: {
      noExternal: ['vitepress-plugin-llms'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'gsap', 'gsap/ScrollTrigger', '@stackblitz/sdk'],
    },
    server: {
      headers: ECrossOriginIsolationHeaders,
      fs: {
        allow: [ESrc('../..'), tmpdir(), '/private/var/folders'],
      },
    },
    preview: {
      headers: ECrossOriginIsolationHeaders,
    },
  },
})
