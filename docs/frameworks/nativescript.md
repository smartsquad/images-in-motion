---
title: NativeScript | Frameworks
description: Host the images-in-motion custom element in a NativeScript WebView. There is no native view port.
---

# NativeScript

There is no NativeScript view. The renderer needs a DOM. Put the mosaic in a [WebView](https://docs.nativescript.org/ui/web-view) and size that WebView.

The same `translate3d` `@keyframes` run inside that WebView. See [No frames! Pure CSS](/css).

`HtmlView` is markup only. It does not run scripts. Use `WebView`.

Save HTML under `app/assets/html/` (the `~/assets/` path). Same attributes as the [custom element](/frameworks/element). The tag cannot take a JavaScript object. For an `iimOptions` constant, mount from a module script.

::: code-group

```html [Attributes]
<!doctype html>
<html>
  <body style="margin:0">
    <images-in-motion
      style="width:100vw;height:100vh"
      images='["/a.jpg","/b.jpg","/c.jpg","/d.jpg"]'
      angle="12"
      speed-range="[8,18]"
    ></images-in-motion>
    <script type="module" src="https://unpkg.com/images-in-motion"></script>
  </body>
</html>
```

```html [Options]
<!doctype html>
<html>
  <body style="margin:0">
    <div id="stage" style="width:100vw;height:100vh"></div>
    <script type="module">
      import { mountImagesInMotion } from 'https://unpkg.com/images-in-motion'

      const iimOptions = {
        images: ['/a.jpg', '/b.jpg', '/c.jpg', '/d.jpg'],
        angle: 12,
        speedRange: [8, 18],
      }

      mountImagesInMotion(document.querySelector('#stage'), iimOptions)
    </script>
  </body>
</html>
```

:::

<FrameworkPlayground id="nativescript" />

jsDelivr: `https://cdn.jsdelivr.net/npm/images-in-motion`. For a file URL with no network, copy `dist/iife/images-in-motion.global.js` next to the HTML and use a relative script. The IIFE defines the custom element. It does not give you an ESM `mountImagesInMotion` import. Use attributes in that offline case.

```xml
<WebView src="~/assets/html/images-in-motion.html" />
```

Core, Vue, React, and Svelte NativeScript flavors all take that `src`. Give the WebView a width and height (flex, `col`, or explicit pixels).
