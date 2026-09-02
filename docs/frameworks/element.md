---
title: Custom element | Frameworks
description: Use the images-in-motion custom element from a module import or a CDN script.
---

# Custom element

Tag: `images-in-motion`. Importing `images-in-motion` defines it. You can also load the IIFE from unpkg or jsDelivr.

The tag reads HTML attributes only. It cannot take a JavaScript `iimOptions` object. Keep attributes, or mount from a script with the [JavaScript](/frameworks/javascript) API.

::: code-group

```html [Attributes]
<script type="module" src="https://unpkg.com/images-in-motion"></script>
<images-in-motion
  style="width:480px;height:640px"
  images='["/a.jpg","/b.jpg","/c.jpg","/d.jpg"]'
  angle="12"
  speed-range="[8,18]"
></images-in-motion>
```

```html [Options]
<div id="stage" style="width:480px;height:640px"></div>
<script type="module">
  import { mountImagesInMotion } from 'https://unpkg.com/images-in-motion'

  const iimOptions = {
    images: ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'],
    angle: 12,
    speedRange: [8, 18],
  }

  mountImagesInMotion(document.querySelector('#stage'), iimOptions)
</script>
```

:::

<FrameworkPlayground id="element" />

jsDelivr: `https://cdn.jsdelivr.net/npm/images-in-motion`.

Attributes map to the same options as `mountImagesInMotion` (kebab-case): `images`, `angle`, `speed-range`, `tile-width`, `tile-aspect-ratio`, `gap`, `overlay-opacity`, `overlay-color`, `image-order`, `motion-axis`, `tile-fit`, `gap-color`, `gap-opacity`, `paused`, `stop-on-hover`, `animate-on-hover`.

`images` accepts a JSON array or a comma-separated list. `speed-range` accepts JSON `[min,max]` or `min,max`. Boolean flags (`paused`, `stop-on-hover`, `animate-on-hover`) are true when the attribute is present and not `false`. `stop-on-hover` and `animate-on-hover` cancel each other.

Size the element with CSS. The host must have a measurable width and height.

[NativeScript](/frameworks/nativescript) hosts this tag in a WebView. [Expo](/frameworks/expo) can load the same IIFE that defines it.
