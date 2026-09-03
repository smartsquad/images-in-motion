---
title: Bundle size
description: Measured minified and compressed sizes of the images-in-motion JS renderer. No invented numbers.
---

# Bundle size

The published minified IIFE is **17.38 KB** (17,798 bytes). Compressed with gzip -9 it is **6.48 KB** (6,632 bytes). Brotli quality 11 is **5.83 KB** (5,974 bytes).

That file is `dist/iife/images-in-motion.global.js`. It is the CDN bundle (`unpkg` / `jsDelivr`): the JS renderer plus `<images-in-motion>`. It does not include React, Vue, or images.

## Shipped files

KB in this table is bytes / 1024, two decimals, same as tsup. gzip is zlib level 9. brotli is quality 11.

| File | Role | Raw | gzip -9 | brotli |
| --- | --- | --- | --- | --- |
| `dist/iife/images-in-motion.global.js` | CDN IIFE, minified as shipped | 17.38 KB (17,798 B) | 6.48 KB (6,632 B) | 5.83 KB (5,974 B) |
| `dist/js/index.js` | ESM `images-in-motion`, not minified | 34.45 KB (35,276 B) | 9.03 KB (9,244 B) | 7.96 KB (8,148 B) |
| `dist/core/index.js` | ESM `images-in-motion/core`, not minified | 10.66 KB (10,915 B) | 2.95 KB (3,025 B) | 2.63 KB (2,694 B) |
| `dist/react/index.js` | ESM `images-in-motion/react`, not minified | 31.90 KB (32,669 B) | 8.35 KB (8,555 B) | 7.36 KB (7,533 B) |
| `dist/vue/index.js` | ESM `images-in-motion/vue`, not minified | 32.54 KB (33,324 B) | 8.48 KB (8,683 B) | 7.48 KB (7,656 B) |

Sourcemaps (`.map`) and TypeScript `.d.ts` files are not in the table. They ship next to the JS. They are not part of the runtime payload.

## App bundlers

The ESM entries are not minified. A bundler minifies them. `bun run size` also minifies `dist/js/index.js` with `Bun.build({ minify: true })` so you can compare to the IIFE:

| | Raw | gzip -9 | brotli |
| --- | --- | --- | --- |
| JS ESM after Bun.build minify | 18.08 KB (18,514 B) | 6.75 KB (6,916 B) | 5.97 KB (6,118 B) |

That is a check, not a second published file. The number on the home page is the IIFE gzip size, because that file is already minified in the package.

`images-in-motion/react` and `images-in-motion/vue` each bundle the renderer. Import one binding. Do not also import `images-in-motion` unless you want two copies.

## What is not in 6.48 KB

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
