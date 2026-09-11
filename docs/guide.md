# Install and usage

Install `images-in-motion`, size a host, then mount. Package name: `images-in-motion`. Component name: `ImagesInMotion`.

::: code-group

```bash [npm]
npm i images-in-motion
```

```bash [yarn]
yarn add images-in-motion
```

```bash [pnpm]
pnpm add images-in-motion
```

```bash [bun]
bun add images-in-motion
```

:::

Give the host a size. Examples fill the available box and size the mosaic to `20rem` by `20rem`.

The renderer is framework-agnostic. Bindings only mount it. Pick a surface:

- [React](/frameworks/react)
- [Vue](/frameworks/vue)
- [Expo](/frameworks/expo)
- [NativeScript](/frameworks/nativescript)
- [JavaScript](/frameworks/javascript)
- [Custom element](/frameworks/element)

Expo and NativeScript host that same CSS renderer in a WebView. There is no native mosaic.

See the [frameworks hub](/frameworks/) for a short map. Motion is CSS, not a JS frame loop: [No frames! Pure CSS](/css).

## Pause and motion preference

`paused` eases to a freeze at the current CSS position. `prefers-reduced-motion` and a hidden tab snap pause. `stopOnHover` eases to a stop while the pointer is over the host. `animateOnHover` eases in only while the pointer is over the host. If both are set, motion stays continuous. Children (React children, Vue slot) sit above the decorative layer and stay interactive. Hover listens on the outer wrapper so those children still receive clicks.

No images: empty black background. One image: repeats safely.

## Studio JSON

The [studio](/studio/) copies settings to the clipboard. The payload never includes image URLs or blob URLs. Canvas preview size, shape, and corners are host CSS in the studio. They are not library props. See [Image-free JSON](/export).

## Bundle size

The CDN IIFE is 17.38 KB minified, 6.47 KB gzip -9. Exact bytes, other entries, and how to re-measure: [Bundle size](/size).
