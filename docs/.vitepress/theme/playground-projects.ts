/// <reference types="vite/client" />
import type { Project } from '@stackblitz/sdk'
import type { TFrameworkExampleTab } from '../framework-example-source'
import { EPlaygroundTitles, type TPlaygroundId } from '../playground'

const ELibRaw = import.meta.glob('../../../src/{core,js,react,vue}/**/*.{ts,tsx}', {
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

function includeVendor(path: string, id: TPlaygroundId): boolean {
  if (id === 'react') {
    return path.startsWith('vendor/core/') || path.startsWith('vendor/js/') || path.startsWith('vendor/react/')
  }
  if (id === 'vue') {
    return path.startsWith('vendor/core/') || path.startsWith('vendor/js/') || path.startsWith('vendor/vue/')
  }
  if (id === 'javascript' || id === 'expo') {
    return path.startsWith('vendor/core/') || path.startsWith('vendor/js/')
  }
  return false
}

function viteConfigFor(id: TPlaygroundId): string {
  const pluginImport = id === 'react' || id === 'expo'
    ? "import react from '@vitejs/plugin-react'\n"
    : id === 'vue'
      ? "import vue from '@vitejs/plugin-vue'\n"
      : ''
  const plugins = id === 'react' || id === 'expo'
    ? 'plugins: [react()],'
    : id === 'vue'
      ? 'plugins: [vue()],'
      : ''
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

function packageJsonFor(id: TPlaygroundId): string {
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

  if (id === 'react' || id === 'expo') {
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

function htmlPage(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body>
    ${body}
  </body>
</html>
`
}

export function snippetOpenFile(id: TPlaygroundId, _tab: TFrameworkExampleTab): string {
  if (id === 'vue') {
    return 'src/App.vue'
  }
  if (id === 'javascript') {
    return 'src/main.ts'
  }
  if (id === 'react' || id === 'expo') {
    return 'src/App.tsx'
  }
  return 'index.html'
}

function copyVendorFiles(id: TPlaygroundId, files: Record<string, string>): void {
  for (const [globId, source] of Object.entries(ELibRaw)) {
    const path = vendorPath(globId)
    if (path && includeVendor(path, id)) {
      files[path] = source
    }
  }
}

/** StackBlitz project whose app file is the guide snippet, byte for byte. */
export function createStackBlitzProject(id: TPlaygroundId, tab: TFrameworkExampleTab): Project {
  const files: Record<string, string> = {}
  const title = EPlaygroundTitles[id]

  if (id === 'react' || id === 'expo') {
    copyVendorFiles(id, files)
    files['src/App.tsx'] = tab.code
    files['src/main.tsx'] = `import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)
`
    files['index.html'] = htmlPage(title, `<div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>`)
    files['vite.config.ts'] = viteConfigFor(id)
    files['package.json'] = packageJsonFor(id)
  } else if (id === 'vue') {
    copyVendorFiles(id, files)
    files['src/App.vue'] = tab.code
    files['src/main.ts'] = `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
`
    files['index.html'] = htmlPage(title, `<div id="app"></div>
    <script type="module" src="/src/main.ts"></script>`)
    files['vite.config.ts'] = viteConfigFor(id)
    files['package.json'] = packageJsonFor(id)
  } else if (id === 'javascript') {
    copyVendorFiles(id, files)
    files['src/main.ts'] = tab.code
    files['index.html'] = htmlPage(title, `<div id="app"><div id="stage"></div></div>
    <script type="module" src="/src/main.ts"></script>`)
    files['vite.config.ts'] = viteConfigFor(id)
    files['package.json'] = packageJsonFor(id)
  } else {
    files['index.html'] = /<!doctype html/i.test(tab.code) ? tab.code : htmlPage(title, tab.code)
    files['package.json'] = packageJsonFor(id)
    files['vite.config.ts'] = `import { defineConfig } from 'vite'\nexport default defineConfig({})\n`
  }

  return {
    title,
    description: 'No frames! Pure CSS. Geometry in src/core, animation in src/js.',
    template: 'node',
    files,
  }
}

export function snippetSourceInProject(project: Project, id: TPlaygroundId, tab: TFrameworkExampleTab): string {
  return project.files[snippetOpenFile(id, tab)] ?? ''
}
