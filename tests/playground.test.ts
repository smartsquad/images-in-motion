import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { frameworkExampleTabs } from '../docs/.vitepress/framework-example-source'
import {
  createSnackLaunchUrl,
  isExpoNativeTab,
  playgroundFolder,
  stackBlitzGithubUrl,
  type TPlaygroundId,
} from '../docs/.vitepress/playground'
import {
  createStackBlitzProject,
  snippetOpenFile,
} from '../docs/.vitepress/theme/playground-projects'
import { EBannedExamplePhotoIds } from '../src/example-images'

const EFrameworkIds: readonly TPlaygroundId[] = [
  'react',
  'vue',
  'expo',
  'nativescript',
  'javascript',
  'element',
]

const sharedImages = readFileSync(path.join(process.cwd(), 'docs/playgrounds/shared/images.ts'), 'utf8')

describe('docs playground hosts', () => {
  it('builds a whole-repo StackBlitz import for React', () => {
    const url = stackBlitzGithubUrl('react')
    expect(url.startsWith('https://stackblitz.com/fork/github/smartsquad/images-in-motion/tree/main?')).toBe(true)
    expect(url).toContain('configPath=docs%2Fplaygrounds%2Freact')
    expect(url).toContain('file=docs%2Fplaygrounds%2Freact%2Fsrc%2FApp.tsx')
    expect(playgroundFolder('vue')).toBe('docs/playgrounds/vue')
  })
})

describe('docs StackBlitz embed isolation', () => {
  it('serves COOP/COEP and embeds with crossOriginIsolated', () => {
    const config = readFileSync(path.join(process.cwd(), 'docs/.vitepress/config.ts'), 'utf8')
    const playground = readFileSync(
      path.join(process.cwd(), 'docs/.vitepress/theme/components/FrameworkPlayground.vue'),
      'utf8',
    )
    expect(config).toContain('images-in-motion-coop-coep')
    expect(config).toContain('Cross-Origin-Embedder-Policy')
    expect(config).toContain('credentialless')
    expect(config).toContain('Cross-Origin-Opener-Policy')
    expect(playground).toContain('crossOriginIsolated: true')
    expect(playground).toContain('window.crossOriginIsolated')
  })
})

describe('snippet-backed live editors', () => {
  it('puts the visible snippet into Snack or StackBlitz without rewriting it', () => {
    for (const id of EFrameworkIds) {
      for (const tab of frameworkExampleTabs(id)) {
        if (isExpoNativeTab(id, tab)) {
          const url = createSnackLaunchUrl(tab.code)
          const files = JSON.parse(new URL(url).searchParams.get('files') ?? '') as {
            'App.tsx'?: { contents?: string }
          }
          expect(url).toContain('dependencies=react-native-webview')
          expect(url).toContain('images-in-motion')
          expect(url).toContain('platform=mydevice')
          expect(url).not.toContain('platform=web')
          expect(files['App.tsx']?.contents).toBe(tab.code)
          continue
        }
        const project = createStackBlitzProject(id, tab)
        const openFile = snippetOpenFile(id, tab)
        const source = project.files[openFile]
        expect(source).toBeDefined()
        if (openFile === 'index.html' && !/<!doctype html/i.test(tab.code)) {
          expect(source).toContain(tab.code)
        } else {
          expect(source).toBe(tab.code)
        }
      }
    }
  })

  it('opens the snippet file in the StackBlitz editor', () => {
    const [tab] = frameworkExampleTabs('react')
    expect(tab).toBeDefined()
    expect(snippetOpenFile('react', tab!)).toBe('src/App.tsx')
    expect(snippetOpenFile('vue', frameworkExampleTabs('vue')[0]!)).toBe('src/App.vue')
    expect(snippetOpenFile('javascript', frameworkExampleTabs('javascript')[0]!)).toBe('src/main.ts')
  })

  it('keeps GitHub fallback app files equal to the first snippet tab', () => {
    const firstTab = (id: TPlaygroundId) => frameworkExampleTabs(id)[0]!.code
    expect(readFileSync(path.join(process.cwd(), 'docs/playgrounds/react/src/App.tsx'), 'utf8')).toBe(firstTab('react'))
    expect(readFileSync(path.join(process.cwd(), 'docs/playgrounds/vue/src/App.vue'), 'utf8')).toBe(firstTab('vue'))
    expect(readFileSync(path.join(process.cwd(), 'docs/playgrounds/javascript/src/main.ts'), 'utf8')).toBe(firstTab('javascript'))
    expect(readFileSync(path.join(process.cwd(), 'docs/playgrounds/expo/App.tsx'), 'utf8')).toBe(firstTab('expo'))
    expect(readFileSync(path.join(process.cwd(), 'docs/playgrounds/nativescript/images-in-motion.html'), 'utf8')).toBe(firstTab('nativescript'))
    expect(readFileSync(path.join(process.cwd(), 'docs/playgrounds/element/index.html'), 'utf8')).toContain(firstTab('element'))
  })
})

describe('docs playground sources', () => {
  it('uses verified Unsplash photos only in the shared live pool', () => {
    for (const id of EBannedExamplePhotoIds) {
      expect(sharedImages).not.toContain(`images.unsplash.com/${id}`)
    }
    expect(sharedImages).toContain('images.unsplash.com/photo-1501785888041-af3ef285b470')
  })
})
