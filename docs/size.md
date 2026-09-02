---
title: Bundle size
description: Measured minified and compressed sizes of the images-in-motion JS renderer. No invented numbers.
---

# Bundle size

The published minified IIFE is **16.08 KB** (16,468 bytes). Compressed with gzip -9 it is **5.97 KB** (6,117 bytes). Brotli quality 11 is **5.38 KB** (5,508 bytes).

That file is `dist/iife/images-in-motion.global.js`. It is the CDN bundle (`unpkg` / `jsDelivr`): the JS renderer plus `<images-in-motion>`. It does not include React, Vue, or images.

## Shipped files

KB in this table is bytes / 1024, two decimals, same as tsup. gzip is zlib level 9. brotli is quality 11.

| File | Role | Raw | gzip -9 | brotli |
| --- | --- | --- | --- | --- |
| `dist/iife/images-in-motion.global.js` | CDN IIFE, minified as shipped | 16.08 KB (16,468 B) | 5.97 KB (6,117 B) | 5.38 KB (5,508 B) |
| `dist/js/index.js` | ESM `images-in-motion`, not minified | 29.82 KB (30,533 B) | 7.77 KB (7,953 B) | 6.87 KB (7,038 B) |
| `dist/core/index.js` | ESM `images-in-motion/core`, not minified | 10.66 KB (10,915 B) | 2.95 KB (3,025 B) | 2.63 KB (2,694 B) |
| `dist/react/index.js` | ESM `images-in-motion/react`, not minified | 28.07 KB (28,748 B) | 7.43 KB (7,611 B) | 6.55 KB (6,704 B) |
| `dist/vue/index.js` | ESM `images-in-motion/vue`, not minified | 28.62 KB (29,304 B) | 7.54 KB (7,722 B) | 6.66 KB (6,815 B) |

Sourcemaps (`.map`) and TypeScript `.d.ts` files are not in the table. They ship next to the JS. They are not part of the runtime payload.

## App bundlers

The ESM entries are not minified. A bundler minifies them. `bun run size` also minifies `dist/js/index.js` with `Bun.build({ minify: true })` so you can compare to the IIFE:

| | Raw | gzip -9 | brotli |
| --- | --- | --- | --- |
| JS ESM after Bun.build minify | 15.79 KB (16,171 B) | 5.82 KB (5,960 B) | 5.18 KB (5,303 B) |

That is a check, not a second published file. The number on the home page is the IIFE gzip size, because that file is already minified in the package.

`images-in-motion/react` and `images-in-motion/vue` each bundle the renderer. Import one binding. Do not also import `images-in-motion` unless you want two copies.

## What is not in 5.97 KB

- React and Vue. Optional peers. The IIFE and the JS entry have none.
- Expo and NativeScript. They host this IIFE in a WebView. No extra native mosaic bundle.
- Image files. The renderer takes URL strings. The [studio](/studio/) export never writes those URLs.
- The studio app, VitePress, GSAP, and this documentation site.
- Source maps and declaration files.

## Reproduce

```bash
bun run size
```

That runs `bun run build`, then `scripts/bundle-size.ts` over `dist/`. If the bytes change, update this page. Do not round the home card to a number you did not measure.
