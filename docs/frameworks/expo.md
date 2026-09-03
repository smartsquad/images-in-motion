---
title: Expo | Frameworks
description: Host the CSS renderer in an Expo WebView. No react-native-web, no React Native mosaic.
---

# Expo

There is no React Native port. Geometry stays in `src/core`. Animation stays in `src/js`. Expo hosts that DOM renderer in a native [WebView](https://docs.expo.dev/versions/latest/sdk/webview/) on iOS and Android.

`expo start --web` is a browser. `react-native-webview` does not run there. It prints `React Native WebView does not support this platform` and stays blank. Use the Web tab: the same HTML in an `iframe`. Use the Native tab in Expo Go, iOS, or Android.

Do not install `react-native-web` or `react-dom` for the native mosaic. Expo [DOM components](https://docs.expo.dev/guides/dom-components/) (`'use dom'`) require those packages and pull a second web React tree into the app. Skip them.

Do not rebuild the lanes with Reanimated, Skia, or Animated. The renderer already uses CSS `translate3d` `@keyframes`. WKWebView and Android WebView composite those transforms on the GPU. See [No frames! Pure CSS](/css).

Install `images-in-motion` and the WebView:

::: code-group

```bash [npx]
npx expo install react-native-webview
```

```bash [bunx]
bunx expo install react-native-webview
```

```bash [yarn]
yarn expo install react-native-webview
```

```bash [pnpm]
pnpm expo install react-native-webview
```

:::

`createImagesInMotionWebViewHtml` writes a full HTML document: a `#stage`, the IIFE from unpkg, and `ImagesInMotion.mountImagesInMotion` with your `iimOptions`. On iOS, `source={{ html }}` sizes the document to `#stage` unless you pass `viewportWidth` / `viewportHeight` from the native `onLayout` box. The Native snippet does that. The WebView is `flex: 1`. `rem` is CSS inside that document, not a React Native style. `#stage` is `20rem` by `20rem` and centered in that measured box. `originWhitelist={['*']}` is required for an `html` source. Replace `App.js` or `App.tsx` with the Native snippet on device. On web, replace it with the Web snippet, or add `App.web.js` so Expo picks it automatically.

<FrameworkExample id="expo" />

jsDelivr: pass `https://cdn.jsdelivr.net/npm/images-in-motion` as the second argument to `createImagesInMotionWebViewHtml`. Offline: copy `dist/iife/images-in-motion.global.js` into the app and pass that file URL.

Image URLs must be reachable from the WebView (https). `file://` and `blob:` from the native side do not appear in the document unless you inject them.

The Web tab is the same `createImagesInMotionWebViewHtml` document in an `iframe`. A plain website can also use [images-in-motion/react](/frameworks/react).
