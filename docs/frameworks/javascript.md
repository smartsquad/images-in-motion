---
title: JavaScript | Frameworks
description: Mount the renderer with mountImagesInMotion from the images-in-motion JS entry.
---

# JavaScript

`images-in-motion` is the JS entry. Import `mountImagesInMotion` and pass a host that already has a size. The second argument is the options object. There is no `<ImagesInMotion>` component.

::: code-group

```js [Inline]
import { mountImagesInMotion } from 'images-in-motion'

const handle = mountImagesInMotion(document.querySelector('#stage'), {
  images: ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'],
  speedRange: [8, 18],
  angle: 12,
  tileWidth: 168,
  gap: 4,
})

handle.update({ paused: true })
handle.update({ stopOnHover: true })
handle.destroy()
```

```js [Options]
import { mountImagesInMotion } from 'images-in-motion'

const iimOptions = {
  images: ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'],
  speedRange: [8, 18],
  angle: 12,
  tileWidth: 168,
  gap: 4,
}

const handle = mountImagesInMotion(document.querySelector('#stage'), iimOptions)
handle.update({ ...iimOptions, paused: true })
handle.destroy()
```

:::

<FrameworkPlayground id="javascript" />

The same import also registers `<images-in-motion>`. See the [custom element](/frameworks/element) if you want attributes instead of a call.

`update` accepts a partial options object. `destroy` removes the sheet and listeners. `getLayout()` returns the last computed geometry.

Options are listed on the [API](/api) page.

[Expo](/frameworks/expo) loads this same mount through `createImagesInMotionWebViewHtml`. [NativeScript](/frameworks/nativescript) hosts the custom element or this mount in a WebView.
