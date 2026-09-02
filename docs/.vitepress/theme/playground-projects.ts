import type { Project } from '@stackblitz/sdk'
import { EPlaygroundTitles, type TWebPlaygroundId } from '../playground'

const ELibRaw = import.meta.glob('../../../src/{core,js,react,vue}/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const EPlaygroundRaw = import.meta.glob('../../playgrounds/{react,vue,javascript,element}/**/*', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const ESharedImages = import.meta.glob('../../playgrounds/shared/images.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function vendorPath(globId: string): string | undefined {
  const marker = '/src/'
  const index = globId.lastIndexOf(marker)
  if (index === -1) {
    return undefined
  }
  const rest = globId.slice(index + marker.length)
  if (rest.startsWith('example-images')) {
    return undefined
  }
  return `vendor/${rest}`
}

function includeVendor(path: string, id: TWebPlaygroundId): boolean {
  if (id === 'react') {
    return path.startsWith('vendor/core/') || path.startsWith('vendor/js/') || path.startsWith('vendor/react/')
  }
  if (id === 'vue') {
    return path.startsWith('vendor/core/') || path.startsWith('vendor/js/') || path.startsWith('vendor/vue/')
  }
  return path.startsWith('vendor/core/') || path.startsWith('vendor/js/')
}

function playgroundRel(id: TWebPlaygroundId, globId: string): string | undefined {
  const marker = `/playgrounds/${id}/`
  const index = globId.lastIndexOf(marker)
  if (index === -1) {
    return undefined
  }
  return globId.slice(index + marker.length)
}

function viteConfigFor(id: TWebPlaygroundId): string {
  const pluginImport = id === 'react'
    ? "import react from '@vitejs/plugin-react'\n"
    : id === 'vue'
      ? "import vue from '@vitejs/plugin-vue'\n"
      : ''
  const plugins = id === 'react' ? 'plugins: [react()],' : id === 'vue' ? 'plugins: [vue()],' : ''
  const extraAlias = id === 'react'
    ? "      'images-in-motion/react': resolve(__dirname, 'vendor/react/index.ts'),\n"
    : id === 'vue'
      ? "      'images-in-motion/vue': resolve(__dirname, 'vendor/vue/index.ts'),\n"
      : ''
  return `import { resolve } from 'node:path'
import { defineConfig } from 'vite'
${pluginImport}
export default defineConfig({
  ${plugins}
  resolve: {
    alias: {
${extraAlias}      'images-in-motion/core': resolve(__dirname, 'vendor/core/index.ts'),
      'images-in-motion': resolve(__dirname, 'vendor/js/index.ts'),
    },
  },
})
`
}

function packageJsonFor(id: TWebPlaygroundId): string {
  const base = {
    name: `images-in-motion-${id}`,
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
    },
    stackblitz: {
      installDependencies: true,
      startCommand: 'npm run dev',
    },
  }

  if (id === 'react') {
    return JSON.stringify({
      ...base,
      dependencies: {
        react: '^19.1.1',
        'react-dom': '^19.1.1',
      },
      devDependencies: {
        '@types/react': '^19.1.1',
        '@types/react-dom': '^19.1.1',
        '@vitejs/plugin-react': '^5.0.2',
        typescript: '^5.9.2',
        vite: '^7.1.5',
      },
    }, null, 2)
  }

  if (id === 'vue') {
    return JSON.stringify({
      ...base,
      dependencies: {
        vue: '^3.5.21',
      },
      devDependencies: {
        '@vitejs/plugin-vue': '^6.0.1',
        typescript: '^5.9.2',
        vite: '^7.1.5',
      },
    }, null, 2)
  }

  return JSON.stringify({
    ...base,
    devDependencies: {
      typescript: '^5.9.2',
      vite: '^7.1.5',
    },
  }, null, 2)
}

export function createStackBlitzProject(id: TWebPlaygroundId): Project {
  const files: Record<string, string> = {}

  for (const [globId, source] of Object.entries(ELibRaw)) {
    const path = vendorPath(globId)
    if (path && includeVendor(path, id)) {
      files[path] = source
    }
  }

  for (const [globId, source] of Object.entries(EPlaygroundRaw)) {
    const rel = playgroundRel(id, globId)
    if (!rel || rel === 'vite.config.ts' || rel === 'package.json') {
      continue
    }
    files[rel] = source.includes('../../shared/images')
      ? source.replaceAll('../../shared/images', './images')
      : source
  }

  const shared = Object.values(ESharedImages)[0]
  if (shared) {
    files['src/images.ts'] = shared
  }

  files['vite.config.ts'] = viteConfigFor(id)
  files['package.json'] = packageJsonFor(id)

  return {
    title: EPlaygroundTitles[id],
    description: 'No frames! Pure CSS. Geometry in src/core, animation in src/js.',
    template: 'node',
    files,
  }
}
