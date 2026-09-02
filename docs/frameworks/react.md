---
title: React | Frameworks
description: Mount ImagesInMotion from images-in-motion/react. The binding only calls the JS renderer.
---

# React

Import from `images-in-motion/react`. Size the parent. React is an optional peer (`>=18`).

Props match `mountImagesInMotion`. Changing them calls `handle.update`. Unmount calls `destroy`.

The component forwards host `className`, `style`, and other `div` attributes. Children render above the decorative sheet and stay interactive.

::: code-group

```tsx [Props]
import { ImagesInMotion } from 'images-in-motion/react'

<div style={{ width: 480, aspectRatio: '3 / 4' }}>
  <ImagesInMotion
    images={urls}
    speedRange={[8, 18]}
    angle={12}
    overlayOpacity={0.35}
  />
</div>
```

```tsx [Options]
import { ImagesInMotion, type IImagesInMotionMountOptions } from 'images-in-motion/react'

const iimOptions: IImagesInMotionMountOptions = {
  images: urls,
  speedRange: [8, 18],
  angle: 12,
  overlayOpacity: 0.35,
}

<div style={{ width: 480, aspectRatio: '3 / 4' }}>
  <ImagesInMotion {...iimOptions} />
</div>
```

:::

<FrameworkPlayground id="react" />

`{...iimOptions}` is JSX spread. It passes the same keys as individual props. There is no `iimOptions` prop.

Do not wrap this binding inside Vue. Vue apps should use [images-in-motion/vue](/frameworks/vue).

On native, [Expo](/frameworks/expo) hosts this same CSS renderer in a WebView. [NativeScript](/frameworks/nativescript) does the same with the custom element. There is no React Native view port.
