---
title: React | Frameworks
description: Mount ImagesInMotion from images-in-motion/react. The binding only calls the JS renderer.
---

# React

Import from `images-in-motion/react`. React is an optional peer (`>=18`).

Props match `mountImagesInMotion`. Changing them calls `handle.update`. Unmount calls `destroy`.

The component forwards host `className`, `style`, and other `div` attributes. Children render above the decorative sheet and stay interactive.

<FrameworkExample id="react" />

`{...iimOptions}` is JSX spread. It passes the same keys as individual props. There is no `iimOptions` prop.

Do not wrap this binding inside Vue. Vue apps should use [images-in-motion/vue](/frameworks/vue).

On native, [Expo](/frameworks/expo) hosts this same CSS renderer in a WebView. [NativeScript](/frameworks/nativescript) does the same with the custom element. There is no React Native view port.
