---
title: NativeScript | Frameworks
description: Host the images-in-motion custom element in a NativeScript WebView. There is no native view port.
---

# NativeScript

There is no NativeScript view. The renderer needs a DOM. Put the mosaic in a [WebView](https://docs.nativescript.org/ui/web-view). Examples fill the WebView. The element is `20rem` by `20rem`.

The same `translate3d` `@keyframes` run inside that WebView. See [No frames! Pure CSS](/css).

`HtmlView` is markup only. It does not run scripts. Use `WebView`.

Save HTML under `app/assets/html/` (the `~/assets/` path). Same attributes as the [custom element](/frameworks/element). The tag cannot take a JavaScript object. For an `iimOptions` constant, mount from a module script.

<FrameworkExample id="nativescript" />

jsDelivr: `https://cdn.jsdelivr.net/npm/images-in-motion`. For a file URL with no network, copy `dist/iife/images-in-motion.global.js` next to the HTML and use a relative script. The IIFE defines the custom element. It does not give you an ESM `mountImagesInMotion` import. Use attributes in that offline case.

```xml
<WebView src="~/assets/html/images-in-motion.html" />
```

Core, Vue, React, and Svelte NativeScript flavors all take that `src`. Size the WebView so the rem mosaic is visible.
