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
const EPublicAsset = (file: string) => `${EBase}${file}`
const ESrc = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))

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
  description: 'Independent columns. Opposite directions. A continuous image pattern for the web.',
  base: EBase,
  outDir: '.vitepress/dist',
  cacheDir: '.vitepress/cache',
  cleanUrls: false,
  lastUpdated: false,
  appearance: true,
  head: [
    ['link', { rel: 'icon', href: EPublicAsset('favicon.svg'), type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: EPublicAsset('favicon-light.svg'), type: 'image/svg+xml', media: '(prefers-color-scheme: light)' }],
    ['link', { rel: 'icon', href: EPublicAsset('favicon-dark.svg'), type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' }],
    ['meta', { property: 'og:title', content: 'Images in motion' }],
    ['meta', { property: 'og:description', content: 'Independent columns. Opposite directions. A continuous image pattern for the web.' }],
    ['meta', { property: 'og:image', content: `${ESiteOrigin}/og.png` }],
    ['meta', { name: 'twitter:image', content: `${ESiteOrigin}/og.png` }],
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
      fs: {
        allow: [ESrc('../..'), tmpdir(), '/private/var/folders'],
      },
    },
  },
})
