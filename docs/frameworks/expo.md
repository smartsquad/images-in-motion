---
title: Expo | Frameworks
description: Host the CSS renderer in an Expo WebView. No react-native-web, no React Native mosaic.
---

# Expo

There is no React Native port. Geometry stays in `src/core`. Animation stays in `src/js`. Expo hosts that DOM renderer in a native [WebView](https://docs.expo.dev/versions/latest/sdk/webview/).

Do not install `react-native-web` or `react-dom` for this mosaic. Expo [DOM components](https://docs.expo.dev/guides/dom-components/) (`'use dom'`) require those packages and pull a second web React tree into the app. Skip them.

Do not rebuild the lanes with Reanimated, Skia, or Animated. The renderer already uses CSS `translate3d` `@keyframes`. WKWebView and Android WebView composite those transforms on the GPU. See [No frames! Pure CSS](/css).

Install `images-in-motion` and the WebView:

```bash
npx expo install react-native-webview
```

`createImagesInMotionWebViewHtml` writes a full HTML document: a sized `#stage`, the IIFE from unpkg, and `ImagesInMotion.mountImagesInMotion` with your `iimOptions`. Size the native parent. The WebView fills that box. `originWhitelist={['*']}` is required for an `html` source.

::: code-group

```tsx [iimOptions]
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import { createImagesInMotionWebViewHtml } from 'images-in-motion'

const iimOptions = {
  images: urls,
  speedRange: [8, 18],
  angle: 12,
}

export default function MotionScreen() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html: createImagesInMotionWebViewHtml(iimOptions) }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        scrollEnabled={false}
      />
    </View>
  )
}
```

```tsx [Props]
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

const html = `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body,images-in-motion{margin:0;width:100%;height:100%}</style>
</head>
<body>
<images-in-motion
  images='["/a.jpg","/b.jpg","/c.jpg","/d.jpg"]'
  angle="12"
  speed-range="[8,18]"
></images-in-motion>
<script src="https://unpkg.com/images-in-motion"></script>
</body>
</html>`

export default function MotionScreen() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        scrollEnabled={false}
      />
    </View>
  )
}
```

:::

<FrameworkPlayground id="expo" />

jsDelivr: pass `https://cdn.jsdelivr.net/npm/images-in-motion` as the second argument to `createImagesInMotionWebViewHtml`. Offline: copy `dist/iife/images-in-motion.global.js` into the app and pass that file URL.

Image URLs must be reachable from the WebView (https). `file://` and `blob:` from the native side do not appear in the document unless you inject them.

Expo web can import [images-in-motion/react](/frameworks/react) in a DOM page. That path is a website, not this native WebView.
