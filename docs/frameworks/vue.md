---
title: Vue | Frameworks
description: Mount ImagesInMotion from images-in-motion/vue. The binding only calls the JS renderer.
---

# Vue

Import `ImagesInMotion` from `images-in-motion/vue`. Vue is an optional peer (`>=3.4`).

The default slot sits above the decorative layer.

Props match `mountImagesInMotion` (kebab-case in templates). A deep watch calls `update`. Unmount calls `destroy`.

<FrameworkExample id="vue" />

`v-bind="iimOptions"` (no argument) passes every key as a prop. It is the same as binding each field. There is no `iimOptions` prop.

This documentation site mounts that binding against `src/vue`. It does not load React.

On native, [Expo](/frameworks/expo) and [NativeScript](/frameworks/nativescript) host this same CSS renderer in a WebView. There is no native view port.
