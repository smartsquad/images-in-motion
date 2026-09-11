---
title: Custom element | Frameworks
description: Use the images-in-motion custom element from a module import or a CDN script.
---

# Custom element

The tag is `images-in-motion`. Importing `images-in-motion` defines it. You can also load the IIFE from unpkg or jsDelivr.

The tag reads HTML attributes only. It cannot take a JavaScript `iimOptions` object. Keep attributes, or mount from a script with the [JavaScript](/frameworks/javascript) API.

<FrameworkExample id="element" />

jsDelivr: `https://cdn.jsdelivr.net/npm/images-in-motion`.

Attributes map to the same options as `mountImagesInMotion` (kebab-case): `images`, `angle`, `speed-range`, `tile-width`, `tile-aspect-ratio`, `gap`, `overlay-opacity`, `overlay-color`, `image-order`, `motion-axis`, `tile-fit`, `gap-color`, `gap-opacity`, `paused`, `stop-on-hover`, `animate-on-hover`.

`images` accepts a JSON array or a comma-separated list. `speed-range` accepts JSON `[min,max]` or `min,max`. Boolean flags (`paused`, `stop-on-hover`, `animate-on-hover`) are true when the attribute is present and not `false`. `stop-on-hover` and `animate-on-hover` cancel each other.

Examples fill the available box. The element is `20rem` by `20rem`.

[NativeScript](/frameworks/nativescript) hosts this tag in a WebView. [Expo](/frameworks/expo) can load the same IIFE that defines it.
