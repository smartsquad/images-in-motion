<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/mark-dark-rounded.svg">
    <img src="assets/mark-light-rounded.svg" alt="Images in motion" width="160">
  </picture>
</p>

<h1 align="center">Images in motion</h1>

<p align="center">
  <strong>Independent columns. Opposite directions.</strong><br />
  A continuous image pattern for the web, in any proportion
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/images-in-motion"><img src="https://img.shields.io/npm/v/images-in-motion?style=flat-square" alt="npm" /></a>
  <a href="https://iim.smartsquad.io/"><img src="https://img.shields.io/badge/Docs-iim.smartsquad.io-111827?style=flat-square" alt="Documentation" /></a>
  <a href="https://iim.smartsquad.io/studio/"><img src="https://img.shields.io/badge/Studio-iim.smartsquad.io-111827?style=flat-square" alt="Live studio" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3" /></a>
  <a href="https://docs.expo.dev/versions/latest/sdk/webview/"><img src="https://img.shields.io/badge/Expo-WebView-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo WebView" /></a>
  <a href="https://docs.nativescript.org/ui/web-view"><img src="https://img.shields.io/badge/NativeScript-WebView-65ADF1?style=flat-square&logo=nativescript&logoColor=white" alt="NativeScript WebView" /></a>
</p>

<p align="center">
  <a href="#install">Install</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#studio">Studio</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#docs">Docs</a> ·
  <a href="#repository-structure">Structure</a>
</p>

<p align="center">
  <img src="assets/og.png" alt="Images in motion: independent columns, opposite directions" width="800" />
</p>

---

## What it does

Each inclined column scrolls continuously, opposite its neighbours. Speeds differ between columns and stay constant within a column. A deterministic phase offset keeps rows from lining up.

The renderer is plain DOM and CSS animations. React and Vue are thin bindings around that same mount. Expo and NativeScript host it in a WebView. There is no React Native or NativeScript view port, and no per-frame React render.

The [public configurator](https://iim.smartsquad.io/studio/) tunes canvas, speed, inclination, tiles, and overlay, then copies settings to the clipboard. Images never leave the browser.

## Install

```bash
bun add images-in-motion
# or
npm i images-in-motion
```

React and Vue are optional peer dependencies. The JS renderer and `<images-in-motion>` custom element have none. Expo and NativeScript host that renderer in a WebView.

## Usage

Give the host a size. Snippets fill the available box and size the mosaic to `20rem` by `20rem`. Full options: [API](https://iim.smartsquad.io/api.html).

### JavaScript

```js
import { mountImagesInMotion } from 'images-in-motion'

const iimOptions = {
  images: ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'],
  speedRange: [8, 18],
  angle: 12,
  tileWidth: 168,
  gap: 4,
}

document.body.style.cssText = 'margin:0;width:100%;height:100%;min-height:100dvh;display:flex;align-items:center;justify-content:center'
const stage = document.querySelector('#stage')
stage.style.width = '20rem'
stage.style.height = '20rem'
const handle = mountImagesInMotion(stage, iimOptions)
handle.update({ paused: true })
handle.destroy()
```

Custom element (also via unpkg / jsDelivr):

```html
<script type="module" src="https://unpkg.com/images-in-motion"></script>
<images-in-motion
  style="width:20rem;height:20rem"
  images='["/a.jpg","/b.jpg","/c.jpg","/d.jpg"]'
  angle="12"
  speed-range="[8,18]"
></images-in-motion>
```

### React

```tsx
import { ImagesInMotion } from 'images-in-motion/react'

const iimOptions = {
  images: urls,
  speedRange: [8, 18],
  angle: 12,
  overlayOpacity: 0.35,
}

<div style={{ width: '100%', height: '100%', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <ImagesInMotion width="20rem" height="20rem" {...iimOptions} />
</div>
```

### Vue 3

```vue
<script setup lang="ts">
import { ImagesInMotion } from 'images-in-motion/vue'

const iimOptions = {
  images: urls,
  speedRange: [8, 18],
  angle: 12,
}
</script>

<template>
  <div style="width:100%;height:100%;min-height:100dvh;display:flex;align-items:center;justify-content:center">
    <ImagesInMotion v-bind="iimOptions" width="20rem" height="20rem" />
  </div>
</template>
```

### Expo

Host the CSS renderer in a `react-native-webview`. There is no React Native port.

```tsx
import { useState } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import { createImagesInMotionWebViewHtml } from 'images-in-motion'

const iimOptions = {
  images: urls,
  speedRange: [8, 18],
  angle: 12,
}

export default function App() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const html = viewport.width > 0 && viewport.height > 0
    ? createImagesInMotionWebViewHtml(iimOptions, undefined, {
        width: '20rem',
        height: '20rem',
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
```

### NativeScript

Host the custom element in a WebView. There is no NativeScript view port.

```xml
<WebView src="~/assets/html/images-in-motion.html" />
```

Guides: [React](https://iim.smartsquad.io/frameworks/react.html), [Vue](https://iim.smartsquad.io/frameworks/vue.html), [Expo](https://iim.smartsquad.io/frameworks/expo.html), [NativeScript](https://iim.smartsquad.io/frameworks/nativescript.html), [JavaScript](https://iim.smartsquad.io/frameworks/javascript.html), [custom element](https://iim.smartsquad.io/frameworks/element.html).

## Studio

Open the [live configurator](https://iim.smartsquad.io/studio/) or the standalone 01 / MOTION STUDY chrome:

```bash
bun install
bun run studio:dev
```

`http://127.0.0.1:4179/` is that standalone study. **Copy settings to clipboard** writes the image-free props object. Canvas preview size is host CSS and is omitted. Images never leave the browser.

## How it works

- Inverse-rotated viewport corners size the sheet, so any canvas ratio stays covered.
- Each lane is two identical cycles. The last gap is part of the period, so the repeat seam does not jump.
- Movement is one CSS `@keyframes` translate per lane. Pause eases `playbackRate`, then holds with `animation-play-state`. React does not render every frame. Expo and NativeScript run those same keyframes in a WebView.
- Lane speeds and delays use a golden-ratio fraction. Neighbours always travel opposite ways.

## Docs

Site: [iim.smartsquad.io](https://iim.smartsquad.io/). Studio: [`/studio/`](https://iim.smartsquad.io/studio/). Local site:

```bash
bun dev
```

`http://127.0.0.1:5173/` is VitePress (home, guide, examples, embedded studio). `bun run docs:dev` is the same command. Production docs are `https://iim.smartsquad.io/` (`base: /`).

## Repository structure

```text
images-in-motion/
├── src/core/               layout, settings export, reduced motion
├── src/js/                 mount(), <images-in-motion>, injected CSS
├── src/react/              ImagesInMotion binding
├── src/vue/                ImagesInMotion binding
├── assets/                 brand marks and social preview
├── docs/                   VitePress site (GitHub Pages; /studio embeds the study)
├── studio/                 StudioApp source; standalone chrome via studio:dev
├── tests/                  geometry, settings, mount
├── AGENTS.md · CONVENTIONS.md · CONTRIBUTING.md · CHANGELOG.md
└── LICENSE
```

## Author

Designed by [Samuel Burlon](https://github.com/samuelburlon).

Implemented by [Massimo De Luisa](https://deluisa.me).
<p>
  <a href="https://x.com/massimodeluisa"><img src="https://img.shields.io/badge/@massimodeluisa-000000?style=flat-square&logo=x" alt="X" /></a>
  <a href="https://github.com/massimodeluisa"><img src="https://img.shields.io/badge/GitHub-massimodeluisa-181717?style=flat-square&logo=github" alt="GitHub" /></a>
</p>

Published by [Smart Squad Srl](https://smartsquad.io).

## License

MIT, copyright Smart Squad Srl. See [LICENSE](LICENSE).
