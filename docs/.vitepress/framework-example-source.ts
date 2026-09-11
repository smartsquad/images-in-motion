import {
  EExampleImages,
  pickExampleImages,
  type TExampleImageCategory,
} from '../../src/example-images'
import type { TPlaygroundId } from './playground'

/** Picsum URLs for copy-paste snippets. Live mosaics shuffle at least 24 Unsplash URLs. */
export const EFrameworkExampleImageCount = 8

export const EFrameworkExampleLiveImageCount = 24

export const ERandomExampleImages = [
  'https://picsum.photos/800/1200?random=1',
  'https://picsum.photos/1200/800?random=2',
  'https://picsum.photos/800/800?random=3',
  'https://picsum.photos/1000/700?random=4',
  'https://picsum.photos/800/1000?random=5',
  'https://picsum.photos/700/1100?random=6',
  'https://picsum.photos/800/1200?random=7',
  'https://picsum.photos/1200/800?random=8',
] as const

/** Mosaic size in copy-paste examples. The outer shell fills the available box. */
export const EFrameworkExampleMosaicRem = '20rem'

const EReactShellCss =
  "width: '100%', height: '100%', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center'"

const EReactShellStyle = `style={{ ${EReactShellCss} }}`

const EVueShellStyle =
  'style="width:100%;height:100%;min-height:100dvh;display:flex;align-items:center;justify-content:center"'

const EHtmlShellStyle =
  'margin:0;width:100%;height:100%;min-height:100dvh;display:flex;align-items:center;justify-content:center'

export const EFrameworkExampleNote =
  'Snippets use random Picsum URLs. The mosaic on this page uses a shuffled Unsplash set.'

export type TFrameworkExampleTab = {
  label: string
  lang: string
  code: string
}

export function fallbackFrameworkExampleImages(): string[] {
  return EExampleImages.slice(0, EFrameworkExampleImageCount)
}

export function pickFrameworkExampleImages(): {
  category: TExampleImageCategory
  liveImages: string[]
} {
  const picked = pickExampleImages(EFrameworkExampleLiveImageCount)
  return {
    category: picked.category,
    liveImages: picked.images,
  }
}

export function formatExampleImagesArray(images: readonly string[], indent: string): string {
  const item = `${indent}  `
  return `[\n${images.map((url) => `${item}'${url}'`).join(',\n')},\n${indent}]`
}

export function formatExampleImagesConst(images: readonly string[], indent = ''): string {
  return `${indent}const images = ${formatExampleImagesArray(images, indent)}`
}

export function frameworkExampleTabs(
  id: TPlaygroundId,
  images: readonly string[] = ERandomExampleImages,
): TFrameworkExampleTab[] {
  const imagesConst = formatExampleImagesConst(images)
  const imagesConstIndented = (indent: string) => formatExampleImagesConst(images, indent)

  switch (id) {
    case 'react':
      return [
        {
          label: 'Props',
          lang: 'tsx',
          code: `import { ImagesInMotion } from 'images-in-motion/react'

${imagesConst}

export default function App() {
  return (
    <div ${EReactShellStyle}>
      <ImagesInMotion
        width="${EFrameworkExampleMosaicRem}"
        height="${EFrameworkExampleMosaicRem}"
        images={images}
        speedRange={[8, 18]}
        angle={12}
        overlayOpacity={0.35}
      />
    </div>
  )
}
`,
        },
        {
          label: 'Options',
          lang: 'tsx',
          code: `import { ImagesInMotion, type IImagesInMotionMountOptions } from 'images-in-motion/react'

${imagesConst}

const iimOptions: IImagesInMotionMountOptions = {
  images,
  speedRange: [8, 18],
  angle: 12,
  overlayOpacity: 0.35,
}

export default function App() {
  return (
    <div ${EReactShellStyle}>
      <ImagesInMotion width="${EFrameworkExampleMosaicRem}" height="${EFrameworkExampleMosaicRem}" {...iimOptions} />
    </div>
  )
}
`,
        },
      ]
    case 'vue':
      return [
        {
          label: 'Props',
          lang: 'vue',
          code: `<script setup lang="ts">
import { ImagesInMotion } from 'images-in-motion/vue'

${imagesConst}
</script>

<template>
  <div ${EVueShellStyle}>
    <ImagesInMotion
      width="${EFrameworkExampleMosaicRem}"
      height="${EFrameworkExampleMosaicRem}"
      :images="images"
      :speed-range="[8, 18]"
      :angle="12"
    />
  </div>
</template>
`,
        },
        {
          label: 'Options',
          lang: 'vue',
          code: `<script setup lang="ts">
import { ImagesInMotion, type TImagesInMotionProps } from 'images-in-motion/vue'

${imagesConst}

const iimOptions: TImagesInMotionProps = {
  images,
  speedRange: [8, 18],
  angle: 12,
}
</script>

<template>
  <div ${EVueShellStyle}>
    <ImagesInMotion v-bind="iimOptions" width="${EFrameworkExampleMosaicRem}" height="${EFrameworkExampleMosaicRem}" />
  </div>
</template>
`,
        },
      ]
    case 'expo':
      return [
        {
          label: 'Native',
          lang: 'tsx',
          code: `import { useState } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import { createImagesInMotionWebViewHtml } from 'images-in-motion'

${imagesConst}

const iimOptions = { images, speedRange: [8, 18], angle: 12 }

export default function App() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const html = viewport.width > 0 && viewport.height > 0
    ? createImagesInMotionWebViewHtml(iimOptions, undefined, {
        width: '${EFrameworkExampleMosaicRem}',
        height: '${EFrameworkExampleMosaicRem}',
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
      })
    : ''

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout
        setViewport((current) => (
          current.width === width && current.height === height ? current : { width, height }
        ))
      }}
    >
      {html ? (
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={{ flex: 1, backgroundColor: 'transparent' }}
          scrollEnabled={false}
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
        />
      ) : null}
    </View>
  )
}
`,
        },
        {
          label: 'Web',
          lang: 'tsx',
          code: `import { createElement } from 'react'
import { createImagesInMotionWebViewHtml } from 'images-in-motion'

${imagesConst}

const html = createImagesInMotionWebViewHtml(
  { images, speedRange: [8, 18], angle: 12 },
  undefined,
  { width: '${EFrameworkExampleMosaicRem}', height: '${EFrameworkExampleMosaicRem}' },
)

export default function App() {
  return createElement(
    'div',
    { style: { ${EReactShellCss} } },
    createElement('iframe', {
      srcDoc: html,
      title: 'images in motion',
      style: { width: '${EFrameworkExampleMosaicRem}', height: '${EFrameworkExampleMosaicRem}', border: 0, display: 'block' },
    }),
  )
}
`,
        },
      ]
    case 'nativescript':
      return [
        {
          label: 'Attributes',
          lang: 'html',
          code: `<!doctype html>
<html>
  <body style="${EHtmlShellStyle}">
    <images-in-motion
      id="mosaic"
      style="width:${EFrameworkExampleMosaicRem};height:${EFrameworkExampleMosaicRem}"
      angle="12"
      speed-range="[8,18]"
    ></images-in-motion>
    <script type="module">
      import 'https://unpkg.com/images-in-motion'

${imagesConstIndented('      ')}

      document.querySelector('#mosaic').setAttribute('images', JSON.stringify(images))
    </script>
  </body>
</html>
`,
        },
        {
          label: 'Options',
          lang: 'html',
          code: `<!doctype html>
<html>
  <body style="${EHtmlShellStyle}">
    <div id="stage" style="width:${EFrameworkExampleMosaicRem};height:${EFrameworkExampleMosaicRem}"></div>
    <script type="module">
      import { mountImagesInMotion } from 'https://unpkg.com/images-in-motion'

${imagesConstIndented('      ')}

      const iimOptions = {
        images,
        angle: 12,
        speedRange: [8, 18],
      }

      mountImagesInMotion(document.querySelector('#stage'), iimOptions)
    </script>
  </body>
</html>
`,
        },
      ]
    case 'javascript':
      return [
        {
          label: 'Inline',
          lang: 'js',
          code: `import { mountImagesInMotion } from 'images-in-motion'

${imagesConst}

const shell = document.querySelector('#app')
shell.style.width = '100%'
shell.style.height = '100%'
shell.style.minHeight = '100dvh'
shell.style.display = 'flex'
shell.style.alignItems = 'center'
shell.style.justifyContent = 'center'

const stage = document.querySelector('#stage')
stage.style.width = '${EFrameworkExampleMosaicRem}'
stage.style.height = '${EFrameworkExampleMosaicRem}'

mountImagesInMotion(stage, {
  images,
  speedRange: [8, 18],
  angle: 12,
  tileWidth: 168,
  gap: 4,
})
`,
        },
        {
          label: 'Options',
          lang: 'js',
          code: `import { mountImagesInMotion } from 'images-in-motion'

${imagesConst}

const iimOptions = {
  images,
  speedRange: [8, 18],
  angle: 12,
  tileWidth: 168,
  gap: 4,
}

const shell = document.querySelector('#app')
shell.style.width = '100%'
shell.style.height = '100%'
shell.style.minHeight = '100dvh'
shell.style.display = 'flex'
shell.style.alignItems = 'center'
shell.style.justifyContent = 'center'

const stage = document.querySelector('#stage')
stage.style.width = '${EFrameworkExampleMosaicRem}'
stage.style.height = '${EFrameworkExampleMosaicRem}'

mountImagesInMotion(stage, iimOptions)
`,
        },
      ]
    case 'element':
      return [
        {
          label: 'Attributes',
          lang: 'html',
          code: `<div style="${EHtmlShellStyle}">
  <images-in-motion
    id="mosaic"
    style="width:${EFrameworkExampleMosaicRem};height:${EFrameworkExampleMosaicRem}"
    angle="12"
    speed-range="[8,18]"
  ></images-in-motion>
</div>
<script type="module">
  import 'https://unpkg.com/images-in-motion'

${imagesConstIndented('  ')}

  document.querySelector('#mosaic').setAttribute('images', JSON.stringify(images))
</script>
`,
        },
        {
          label: 'Options',
          lang: 'html',
          code: `<div style="${EHtmlShellStyle}">
  <div id="stage" style="width:${EFrameworkExampleMosaicRem};height:${EFrameworkExampleMosaicRem}"></div>
</div>
<script type="module">
  import { mountImagesInMotion } from 'https://unpkg.com/images-in-motion'

${imagesConstIndented('  ')}

  const iimOptions = {
    images,
    angle: 12,
    speedRange: [8, 18],
  }

  mountImagesInMotion(document.querySelector('#stage'), iimOptions)
</script>
`,
        },
      ]
  }
}
