---
layout: home

hero:
  name: Images in motion
  text: Independent columns. Opposite directions.
  tagline: A continuous image pattern for the web, in any proportion.
  actions:
    - theme: brand
      text: Install
      link: /guide
    - theme: alt
      text: Frameworks
      link: /frameworks/
    - theme: alt
      text: Studio
      link: /studio/

features:
  - title: No frames! Pure CSS
    details: One @keyframes translate per lane. React and Vue mount it. Expo and NativeScript host it in a WebView.
    link: /css
  - title: Image-free JSON
    details: Studio copies the props object. Image URLs never leave the browser.
    link: /export
  - title: 6.48 KB gzip
    details: Minified IIFE, gzip -9. React and Vue are optional. Expo and NativeScript load this file in a WebView.
    link: /size
---

## Live

The Vue binding mounts the same JS renderer used in production. Reduced motion pauses it.

<HomeLive />

## Install

::: code-group

```bash [npm]
npm i images-in-motion
```

```bash [yarn]
yarn add images-in-motion
```

```bash [pnpm]
pnpm add images-in-motion
```

```bash [bun]
bun add images-in-motion
```

:::

React and Vue are optional peers. The JS renderer and `<images-in-motion>` have none. Expo and NativeScript host that same renderer in a WebView.

Examples fill the available box and size the mosaic to `20rem` by `20rem`.

```js
import { mountImagesInMotion } from 'images-in-motion'

document.body.style.cssText = 'margin:0;width:100%;height:100%;min-height:100dvh;display:flex;align-items:center;justify-content:center'
const stage = document.querySelector('#stage')
stage.style.width = '20rem'
stage.style.height = '20rem'

mountImagesInMotion(stage, {
  images: ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'],
  speedRange: [8, 18],
  angle: 12,
})
```

[Usage](/guide) · [Frameworks](/frameworks/) · [No frames! Pure CSS](/css) · [Image-free JSON](/export) · [Bundle size](/size) · [Examples](/examples)

## Why this shape

1. **Pattern.** Inclined lanes scroll continuously. Speeds differ between lanes, stay constant within a lane, and a phase offset keeps rows from lining up.
2. **Component.** Geometry lives in `src/core`. Animation lives in `src/js`. React and Vue only mount that renderer. Expo and NativeScript host it in a WebView.
3. **[Studio](/studio/).** Tunes canvas, speed, inclination, fit, and overlay, then copies image-free JSON props.

Tune it in the [studio](/studio/), or copy a study from [examples](/examples).
