---
title: Vue | Frameworks
description: Mount ImagesInMotion from images-in-motion/vue. The binding only calls the JS renderer.
---

# Vue

Vue 3 binding. Import from `images-in-motion/vue`. Vue is an optional peer (`>=3.4`).

Size the parent. The default slot sits above the decorative layer.

Props match `mountImagesInMotion` (kebab-case in templates). A deep watch calls `update`. Unmount calls `destroy`.

::: code-group

```vue [Props]
<script setup lang="ts">
import { ImagesInMotion } from 'images-in-motion/vue'
</script>

<template>
  <ImagesInMotion
    :images="urls"
    :speed-range="[8, 18]"
    :angle="12"
  />
</template>
```

```vue [Options]
<script setup lang="ts">
import { ImagesInMotion, type TImagesInMotionProps } from 'images-in-motion/vue'

const iimOptions: TImagesInMotionProps = {
  images: urls,
  speedRange: [8, 18],
  angle: 12,
}
</script>

<template>
  <ImagesInMotion v-bind="iimOptions" />
</template>
```

:::

<FrameworkPlayground id="vue" />

`v-bind="iimOptions"` (no argument) passes every key as a prop. It is the same as binding each field. There is no `iimOptions` prop.

This documentation site mounts that binding against `src/vue`. It does not load React.

On native, [Expo](/frameworks/expo) and [NativeScript](/frameworks/nativescript) host this same CSS renderer in a WebView. There is no native view port.
