import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  EFrameworkExampleImageCount,
  EFrameworkExampleLiveImageCount,
  ERandomExampleImages,
  fallbackFrameworkExampleImages,
  formatExampleImagesArray,
  formatExampleImagesConst,
  frameworkExampleTabs,
  pickFrameworkExampleImages,
} from '../docs/.vitepress/framework-example-source'
import { EWebPlaygroundIds, type TPlaygroundId } from '../docs/.vitepress/playground'
import {
  EBannedExamplePhotoIds,
  EExampleImages,
  exampleImagePhotoId,
} from '../src/example-images'

const EFrameworkIds: readonly TPlaygroundId[] = [
  'react',
  'vue',
  'expo',
  'nativescript',
  'javascript',
  'element',
]

const EFrameworkDocsDir = path.join(process.cwd(), 'docs/frameworks')

describe('framework example source', () => {
  it('uses eight fallback Unsplash urls from the Live helper pool', () => {
    const images = fallbackFrameworkExampleImages()
    expect(images).toEqual(EExampleImages.slice(0, EFrameworkExampleImageCount))
    expect(images).toHaveLength(8)
    for (const url of images) {
      expect(url.startsWith('https://images.unsplash.com/')).toBe(true)
    }
  })

  it('picks live mosaic urls from the same Live shuffle', () => {
    for (let index = 0; index < 40; index += 1) {
      const picked = pickFrameworkExampleImages()
      expect(picked.liveImages.length).toBeGreaterThanOrEqual(EFrameworkExampleLiveImageCount)
      expect(new Set(picked.liveImages).size).toBe(picked.liveImages.length)
      for (const url of picked.liveImages) {
        expect(url.startsWith('https://images.unsplash.com/')).toBe(true)
        const id = exampleImagePhotoId(url)
        expect(id).toBeTruthy()
        expect(EBannedExamplePhotoIds).not.toContain(id)
      }
    }
  })

  it('keeps eight Picsum random urls for copy-paste snippets', () => {
    expect(ERandomExampleImages).toHaveLength(8)
    expect(ERandomExampleImages).toEqual([
      'https://picsum.photos/800/1200?random=1',
      'https://picsum.photos/1200/800?random=2',
      'https://picsum.photos/800/800?random=3',
      'https://picsum.photos/1000/700?random=4',
      'https://picsum.photos/800/1000?random=5',
      'https://picsum.photos/700/1100?random=6',
      'https://picsum.photos/800/1200?random=7',
      'https://picsum.photos/1200/800?random=8',
    ])
  })

  it('lists a const images of Picsum urls in every framework snippet', () => {
    for (const id of EFrameworkIds) {
      const tabs = frameworkExampleTabs(id)
      expect(tabs.length).toBe(2)
      for (const tab of tabs) {
        expect(tab.code).toContain('const images = [')
        expect(tab.code).toContain('https://picsum.photos/')
        expect(tab.code).toContain(ERandomExampleImages[0])
        expect(tab.code).not.toContain('https://images.unsplash.com/photo-')
        expect(tab.code).not.toContain('pickExampleImages')
        expect(tab.code).not.toContain('images-in-motion/examples')
        expect(tab.code).not.toContain('source.unsplash.com')
        expect(tab.code).toContain('20rem')
        expect(tab.code).not.toContain('30rem')
        expect(tab.code).not.toContain('40rem')
        const isExpoNative = id === 'expo' && tab.label === 'Native'
        if (isExpoNative) {
          expect(tab.code).toContain('flex: 1')
          expect(tab.code).not.toMatch(/style=\{\{ width: '20rem'/)
        } else {
          expect(tab.code).toContain('100%')
          expect(tab.code).toMatch(/alignItems\s*[:=]\s*'center'|align-items:center/)
          expect(tab.code).toMatch(/justifyContent\s*[:=]\s*'center'|justify-content:center/)
        }
        expect(tab.code).not.toContain('/a.jpg')
        expect(tab.code).not.toMatch(/images:\s*urls\b/)
        expect(tab.code).not.toMatch(/images=\{urls\}/)
        expect(tab.code).not.toContain(':images="urls"')
        expect(tab.code).not.toMatch(/images=\{\[/)
        expect(tab.code).not.toMatch(/:images="\[/)
        for (const banned of EBannedExamplePhotoIds) {
          expect(tab.code).not.toContain(banned)
        }
      }
    }
  })

  it('formats a copy-paste array of full urls', () => {
    const images = fallbackFrameworkExampleImages()
    const literal = formatExampleImagesArray(images, '  ')
    expect(literal.startsWith('[\n')).toBe(true)
    expect(literal).toContain(`    '${images[0]}'`)
    expect(literal.endsWith('\n  ]')).toBe(true)
  })

  it('formats images as a const the snippets reuse', () => {
    const literal = formatExampleImagesConst(ERandomExampleImages)
    expect(literal.startsWith('const images = [\n')).toBe(true)
    expect(literal).toContain(`  '${ERandomExampleImages[0]}'`)
    expect(literal.endsWith('\n]')).toBe(true)
  })

  it('emits a complete React component with a return', () => {
    const [propsTab, optionsTab] = frameworkExampleTabs('react')
    expect(propsTab?.code).toContain('export default function App()')
    expect(propsTab?.code).toContain('return (')
    expect(propsTab?.code).toContain('images={images}')
    expect(propsTab?.code).toContain(formatExampleImagesConst(ERandomExampleImages))
    expect(optionsTab?.code).toContain('export default function App()')
    expect(optionsTab?.code).toContain('{...iimOptions}')
    expect(optionsTab?.code).toContain('images,')
  })

  it('emits a complete Vue SFC that binds the images const', () => {
    const [propsTab, optionsTab] = frameworkExampleTabs('vue')
    expect(propsTab?.code).toContain('<script setup lang="ts">')
    expect(propsTab?.code).toContain(':images="images"')
    expect(propsTab?.code).toContain('</template>')
    expect(optionsTab?.code).toContain('const iimOptions: TImagesInMotionProps = {\n  images,')
    expect(optionsTab?.code).toContain('v-bind="iimOptions"')
  })

  it('emits a complete Expo App that replaces the starter file', () => {
    const [nativeTab, webTab] = frameworkExampleTabs('expo')
    expect(nativeTab?.label).toBe('Native')
    expect(webTab?.label).toBe('Web')
    for (const tab of [nativeTab, webTab]) {
      expect(tab?.code).toContain('export default function App()')
      expect(tab?.code).not.toContain('MotionScreen')
      expect(tab?.code).not.toContain('import { View, Text }')
      expect(tab?.code).toContain(formatExampleImagesConst(ERandomExampleImages))
      expect(tab?.code).not.toContain('https://images.unsplash.com/photo-')
    }
    expect(nativeTab?.code).toContain("import { View } from 'react-native'")
    expect(nativeTab?.code.match(/import \{ View \} from 'react-native'/g)).toHaveLength(1)
    expect(nativeTab?.code).toContain('createImagesInMotionWebViewHtml')
    expect(nativeTab?.code).toContain('WebView')
    expect(nativeTab?.code).toContain('onLayout')
    expect(nativeTab?.code).toContain('viewportWidth')
    expect(nativeTab?.code).toContain('viewportHeight')
    expect(nativeTab?.code).toContain('automaticallyAdjustContentInsets={false}')
    expect(nativeTab?.code).toContain('contentInsetAdjustmentBehavior="never"')
    expect(nativeTab?.code).toContain('style={{ flex: 1, backgroundColor: \'transparent\' }}')
    expect(nativeTab?.code).not.toMatch(/style=\{\{ width: '20rem'/)
    expect(nativeTab?.code).not.toContain('iframe')
    expect(webTab?.code).toContain('createImagesInMotionWebViewHtml')
    expect(webTab?.code).toContain('iframe')
    expect(webTab?.code).toContain('srcDoc')
    expect(webTab?.code).not.toContain('react-native-webview')
    expect(webTab?.code).not.toContain('images-in-motion/react')
  })

  it('does not leave id-only image lists in framework guides', () => {
    const files = readdirSync(EFrameworkDocsDir).filter((file) => file.endsWith('.md'))
    expect(files.length).toBeGreaterThanOrEqual(6)
    for (const file of files) {
      const source = readFileSync(path.join(EFrameworkDocsDir, file), 'utf8')
      expect(source).not.toContain('/a.jpg')
      expect(source).not.toMatch(/images:\s*urls\b/)
      expect(source).not.toMatch(/images=\{urls\}/)
      expect(source).not.toContain(':images="urls"')
      expect(source).not.toMatch(/ids:\s*\[/)
      expect(source).not.toContain('pickExampleImages')
      expect(source).not.toContain('images-in-motion/examples')
      expect(source).not.toContain('https://images.unsplash.com/photo-')
      for (const banned of EBannedExamplePhotoIds) {
        expect(source).not.toContain(banned)
      }
    }
    const expo = readFileSync(path.join(EFrameworkDocsDir, 'expo.md'), 'utf8')
    expect(expo).toContain('npx expo install react-native-webview')
    expect(expo).toContain('bunx expo install react-native-webview')
    expect(expo).toContain('yarn expo install react-native-webview')
    expect(expo).toContain('pnpm expo install react-native-webview')
    expect(expo).toContain('Replace `App.js` or `App.tsx` with the Native snippet on device.')
    expect(expo).toContain('not a React Native style')
    expect(expo).toContain('expo start --web')
    expect(expo).toContain('does not support this platform')
    for (const id of EFrameworkIds) {
      const source = readFileSync(path.join(EFrameworkDocsDir, `${id}.md`), 'utf8')
      expect(source).toContain(`<FrameworkExample id="${id}" />`)
    }
  })

  it('covers the same web playground ids plus Expo and NativeScript', () => {
    expect(EFrameworkIds.slice(0, 2)).toEqual(['react', 'vue'])
    expect(EWebPlaygroundIds).toEqual(['react', 'vue', 'javascript', 'element'])
  })
})
