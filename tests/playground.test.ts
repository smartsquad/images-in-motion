import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  EDocsHostedIife,
  ENativeScriptNew,
  ENativeScriptPreview,
  ENativeScriptStackBlitz,
  createSnackLaunchUrl,
  playgroundFolder,
  stackBlitzGithubUrl,
} from '../docs/.vitepress/playground'
import { EBannedExamplePhotoIds } from '../src/example-images'

const expoApp = readFileSync(path.join(process.cwd(), 'docs/playgrounds/expo/App.tsx'), 'utf8')
const nativeHtml = readFileSync(
  path.join(process.cwd(), 'docs/playgrounds/nativescript/images-in-motion.html'),
  'utf8',
)
const sharedImages = readFileSync(path.join(process.cwd(), 'docs/playgrounds/shared/images.ts'), 'utf8')

describe('docs playground hosts', () => {
  it('builds a whole-repo StackBlitz import for React', () => {
    const url = stackBlitzGithubUrl('react')
    expect(url.startsWith('https://stackblitz.com/fork/github/smartsquad/images-in-motion/tree/main?')).toBe(true)
    expect(url).toContain('configPath=docs%2Fplaygrounds%2Freact')
    expect(url).toContain('file=docs%2Fplaygrounds%2Freact%2Fsrc%2FApp.tsx')
    expect(playgroundFolder('vue')).toBe('docs/playgrounds/vue')
  })

  it('builds an Expo Snack URL that stays on device platforms', () => {
    const url = createSnackLaunchUrl(expoApp)
    expect(url.startsWith('https://snack.expo.dev?')).toBe(true)
    expect(url).toContain('dependencies=react-native-webview')
    expect(url).toContain('platform=mydevice')
    expect(url).toContain('supportedPlatforms=mydevice%2Cios%2Candroid')
    expect(url).not.toContain('platform=web')
  })

  it('keeps official NativeScript Preview URLs', () => {
    expect(ENativeScriptNew).toBe('https://nativescript.new/typescript')
    expect(ENativeScriptPreview).toBe('https://preview.nativescript.org/')
    expect(ENativeScriptStackBlitz.startsWith('https://stackblitz.com/github/NativeScript/stackblitz-templates/tree/typescript')).toBe(true)
  })
})

describe('docs playground sources', () => {
  it('does not import images-in-motion in Expo Snack', () => {
    expect(expoApp).toContain('react-native-webview')
    expect(expoApp).toContain('ImagesInMotion.mountImagesInMotion')
    expect(expoApp).toContain(EDocsHostedIife)
    expect(expoApp).not.toContain("from 'images-in-motion'")
    expect(expoApp).not.toContain("from 'react-native-web'")
    expect(expoApp).not.toContain('use dom')
    expect(expoApp).not.toContain('Reanimated')
  })

  it('hosts the NativeScript sample as a custom element document', () => {
    expect(nativeHtml).toContain('<images-in-motion')
    expect(nativeHtml).toContain(EDocsHostedIife)
    expect(nativeHtml).not.toContain('play.nativescript.org')
  })

  it('uses verified Unsplash photos only', () => {
    for (const id of EBannedExamplePhotoIds) {
      expect(sharedImages).not.toContain(`images.unsplash.com/${id}`)
      expect(expoApp).not.toContain(`images.unsplash.com/${id}`)
      expect(nativeHtml).not.toContain(`images.unsplash.com/${id}`)
    }
    expect(sharedImages).toContain('images.unsplash.com/photo-1501785888041-af3ef285b470')
  })
})
