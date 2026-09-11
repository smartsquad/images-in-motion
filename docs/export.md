---
title: Image-free JSON
description: Studio copies the renderer props object. Image URLs and blob URLs never enter the payload.
---

# Image-free JSON

The [studio](/studio/) **Copy settings to clipboard** control writes the renderer `props` object. Paste it into a file or spread it onto a mount.

Images chosen in the studio stay in this browser. Blob URLs from file picks are never written. Remote Unsplash URLs used as examples are never written either.

The payload is built by `createImagesInMotionSettingsExport` in `src/core/settings.ts`. Tests in `tests/settings.test.ts` lock the shape.

## What is in the payload

Always present:

| Key | Meaning |
| --- | --- |
| `speedRange` | `[min, max]` logical pixels/second |
| `angle` | Degrees clockwise |
| `tileWidth` | Preferred tile width in pixels |
| `tileAspectRatio` | Tile width divided by height |
| `gap` | Gap between lanes and images |
| `imageOrder` | `sequential` or `random` |
| `motionAxis` | `vertical` or `horizontal` |
| `tileFit` | `auto`, `static`, `dynamic`, or `fixed` |
| `gapColor` | Hex fill between tiles |
| `gapOpacity` | Gap alpha, 0-1 |

Present only when that mode is on:

| Key | When |
| --- | --- |
| `overlayOpacity`, `overlayColor` | Overlay enabled in the studio |
| `stopOnHover: true` | Hover mode is Stop on hover |
| `animateOnHover: true` | Hover mode is Animate on hover |

If both hover flags are set in the input, the export writes neither. Motion stays continuous, same as the renderer.

Default studio export (overlay off, hover Always):

```json
{
  "speedRange": [8, 18],
  "angle": 12,
  "tileWidth": 168,
  "tileAspectRatio": 0.6666666666666666,
  "gap": 4,
  "imageOrder": "sequential",
  "motionAxis": "vertical",
  "tileFit": "fixed",
  "gapColor": "#000000",
  "gapOpacity": 1
}
```

## What is never in the payload

| Omitted | Why |
| --- | --- |
| `images`, image URLs, `blob:` URLs | Photos must not leave the browser through this copy |
| `width`, `height`, corner radius, background image, browser fullscreen | [Canvas preview](/studio/) host CSS. Not library props |
| `imageCount` | Studio preview only |
| `paused` | Playback while you look, not a saved layout |
| `version`, `component`, `preview` | Removed. The payload is the props object only |

A JSON.stringify of the export must not match `https?:` or `blob:`.

## How to use it

Pass your own `images` array. Spread the JSON onto the same options the renderer already accepts.

```js
import { mountImagesInMotion } from 'images-in-motion'
import settings from './images-in-motion.json'

mountImagesInMotion(document.querySelector('#stage'), {
  images: ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'],
  ...settings,
})
```

React and Vue: the same keys are props. Expo: pass them to `createImagesInMotionWebViewHtml`. NativeScript: the same keys as custom-element attributes or a module-script mount. Examples fill the available box and size the mosaic to `20rem` by `20rem`. Width and height from the studio preview are not in the payload. See [API](/api#size).

```tsx
import { ImagesInMotion, type IImagesInMotionMountOptions } from 'images-in-motion/react'
import settings from './images-in-motion.json'

const iimOptions: IImagesInMotionMountOptions = {
  images: ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'],
  ...settings,
}

<div style={{ width: '100%', height: '100%', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <ImagesInMotion width="20rem" height="20rem" {...iimOptions} />
</div>
```

```vue
<script setup lang="ts">
import { ImagesInMotion, type TImagesInMotionProps } from 'images-in-motion/vue'
import settings from './images-in-motion.json'

const iimOptions: TImagesInMotionProps = {
  images: ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'],
  ...settings,
}
</script>

<template>
  <div style="width:100%;height:100%;min-height:100dvh;display:flex;align-items:center;justify-content:center">
    <ImagesInMotion v-bind="iimOptions" width="20rem" height="20rem" />
  </div>
</template>
```

You can also call `createImagesInMotionSettingsExport` from `images-in-motion/core` if you build a configurator. Feed it the studio fields (`overlayEnabled`, `width`, `height`, `imageCount`, hover flags). Those extra keys are input only. They do not appear in the return value unless listed above.

## Related

- [Studio](/studio/) to copy settings
- [API](/api#settings-export) for the type
- [Bundle size](/size) for the JS payload, which also excludes images
