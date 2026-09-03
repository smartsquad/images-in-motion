---
title: Getting Started | Frameworks
description: Framework-agnostic renderer with React, Vue, Expo, NativeScript, JavaScript, and custom element mounts.
---

# Getting Started

The animation is one CSS `@keyframes` translate per lane. Geometry lives in `src/core`. The DOM renderer lives in `src/js`. React and Vue only call `mountImagesInMotion`. They do not reimplement layout or playback. Expo and NativeScript host that same CSS renderer in a WebView. The same `translate3d` `@keyframes` run there. See [No frames! Pure CSS](/css).

Use a binding when the app is React or Vue 3. Use Expo with a WebView. Use NativeScript with a WebView. Use the JS entry when you already have a host element. Use the custom element when you want markup.

Each guide shows per-prop mounts and the same fields on an `iimOptions` constant. React spreads the object. Vue uses `v-bind`. JavaScript already takes that object. The custom element stays on attributes. Snippets define a `const images` of random Picsum URLs.

Examples fill the available box. The mosaic is `20rem` by `20rem`. See [Install and usage](/guide).

## Frameworks

<FrameworksCards />

Peers: React and Vue are optional. `images-in-motion` and `<images-in-motion>` have none. Expo and NativeScript host the IIFE in a WebView. They do not use `react-native-web`.
