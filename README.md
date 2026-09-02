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
  <a href="https://smartsquad.github.io/images-in-motion/"><img src="https://img.shields.io/badge/Docs-GitHub_Pages-111827?style=flat-square" alt="Documentation" /></a>
  <a href="https://smartsquad.github.io/images-in-motion/studio/"><img src="https://img.shields.io/badge/Studio-GitHub_Pages-111827?style=flat-square" alt="Live studio" /></a>
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

1. **Pattern.** Each inclined column scrolls continuously in the opposite direction to its neighbours. Speeds differ between columns but stay constant within a column. A deterministic phase offset avoids synchronized rows.
2. **Component.** The renderer is plain DOM and CSS animations. React and Vue are thin bindings around that same mount. Expo and NativeScript host that same CSS renderer in a WebView. There is no React Native or NativeScript view port, and no per-frame React render.
3. **Studio.** The [public configurator](https://smartsquad.github.io/images-in-motion/studio/) tunes canvas, speed, inclination, tiles and overlay, then copies settings to the clipboard. Images never leave the browser.

## Install

```bash
bun add images-in-motion
# or
npm i images-in-motion
```

React and Vue are optional peer dependencies. The JS renderer and `<images-in-motion>` custom element have none. Expo and NativeScript host that renderer in a WebView.

## Usage

The parent must supply a measurable size: fixed dimensions, flex, or a width and aspect ratio. Full options: [API](https://smartsquad.github.io/images-in-motion/api.html).

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

const handle = mountImagesInMotion(document.querySelector('#stage'), iimOptions)
handle.update({ paused: true })
handle.destroy()
```

Custom element (also via unpkg / jsDelivr):

```html
<script type="module" src="https://unpkg.com/images-in-motion"></script>
<images-in-motion
  style="width:480px;height:640px"
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

<div style={{ width: 480, aspectRatio: '3 / 4' }}>
  <ImagesInMotion {...iimOptions} />
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
  <ImagesInMotion v-bind="iimOptions" />
</template>
```

### Expo

Host the CSS renderer in a `react-native-webview`. There is no React Native port.

```tsx
import { WebView } from 'react-native-webview'
import { createImagesInMotionWebViewHtml } from 'images-in-motion'

const iimOptions = {
  images: urls,
  speedRange: [8, 18],
  angle: 12,
}

<WebView
  originWhitelist={['*']}
  source={{ html: createImagesInMotionWebViewHtml(iimOptions) }}
/>
```

### NativeScript

Host the custom element in a WebView. There is no NativeScript view port.

```xml
<WebView src="~/assets/html/images-in-motion.html" />
```

Guides: [React](https://smartsquad.github.io/images-in-motion/frameworks/react.html), [Vue](https://smartsquad.github.io/images-in-motion/frameworks/vue.html), [Expo](https://smartsquad.github.io/images-in-motion/frameworks/expo.html), [NativeScript](https://smartsquad.github.io/images-in-motion/frameworks/nativescript.html), [JavaScript](https://smartsquad.github.io/images-in-motion/frameworks/javascript.html), [custom element](https://smartsquad.github.io/images-in-motion/frameworks/element.html).

## Studio

Open the [live configurator](https://smartsquad.github.io/images-in-motion/studio/) or the standalone 01 / MOTION STUDY chrome:

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

Site: [smartsquad.github.io/images-in-motion](https://smartsquad.github.io/images-in-motion/). Studio: [`/studio/`](https://smartsquad.github.io/images-in-motion/studio/). Local site:

```bash
bun dev
```

`http://127.0.0.1:5173/` is VitePress (home, guide, examples, embedded studio). `bun run docs:dev` is the same command. GitHub Pages uses `/images-in-motion/` because the repo is a project site.

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
