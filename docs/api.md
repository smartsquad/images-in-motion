# API

Every mount takes these options. They are defined in `src/core/layout.ts`. JSON export is `createImagesInMotionSettingsExport` in `src/core/settings.ts`.

## Size

Give the host a size. Examples fill the available box and size the mosaic to `20rem` by `20rem`. A number is pixels.

| Surface | How |
| --- | --- |
| Host | Size the element or its parent. |
| React / Vue `width`, `height` | CSS `width` / `height` on the host. |
| Studio canvas preview | Width, height, browser fullscreen, corner radius, and background of the studio host (1-10000, radius 0-100%). Full screen fills the preview panel. Values clamp on blur. Preview CSS only. Not written to JSON. |
| `imageCount` | Studio preview field. Not a renderer prop. |

## Options

| Prop | Default | Meaning |
| --- | --- | --- |
| `images` | Required | URL strings. Prefer thumbnail-sized files. |
| `speedRange` | `[8, 18]` | Min and max logical pixels/second, clamped to 0.1-1000. Sorted. |
| `angle` | `12` | Degrees clockwise. Negative tilts the other way. |
| `tileWidth` | Responsive, 100-220 | Preferred tile width in pixels, clamped to 16-4096. |
| `tileAspectRatio` | `2 / 3` | Tile width divided by height, clamped to 0.1-10. Used by `fixed` cover and as a fallback aspect. |
| `gap` | `4` | Gap between lanes and images, clamped to 0-1024. |
| `overlayOpacity` | omitted | Color wash, 0-1. Omitted mounts no overlay. |
| `overlayColor` | `#000000` | Overlay fill when opacity is set. Hex `#rgb` or `#rrggbb`. |
| `imageOrder` | `sequential` | `sequential` cycles the list. `random` uses a stable shuffle. |
| `motionAxis` | `vertical` | `vertical` scrolls columns. `horizontal` scrolls rows. Inclination still rotates the sheet. |
| `tileFit` | `fixed` | See [image fit](#image-fit). |
| `imageAspects` | inferred | Width / height per source image. Used by `auto`, `static`, and `dynamic`. |
| `gapColor` | `#000000` | Gap fill. Hex `#rgb` or `#rrggbb`. |
| `gapOpacity` | `1` | Gap alpha, 0-1. Zero shows whatever is behind the sheet. |
| `paused` | `false` | Ease to a freeze at the current animation position. Mount option, not geometry. |
| `stopOnHover` | `false` | Ease to a stop while the pointer is over the host. Ignored if `animateOnHover` is also true. |
| `animateOnHover` | `false` | Ease in only while the pointer is over the host. Ignored if `stopOnHover` is also true. |

## Image fit

| `tileFit` | Behavior |
| --- | --- |
| `fixed` | Tile width and `tileAspectRatio`, `object-fit: cover`. |
| `auto` | Each image keeps its own aspect. |
| `static` | One shared size from the sources. |
| `dynamic` | Every image stretches to the tallest fitted height. |

## Mount handle

```ts
interface IImagesInMotionHandle {
  update(options: Partial<IImagesInMotionMountOptions>): void
  destroy(): void
  getLayout(): IImagesInMotionLayout
}
```

Import `mountImagesInMotion` from `images-in-motion`. React and Vue call it for you. Expo and NativeScript host that same mount in a WebView.

React: `<ImagesInMotion width="20rem" height="20rem" {...iimOptions} />`. Vue: `<ImagesInMotion v-bind="iimOptions" width="20rem" height="20rem" />`. JavaScript: size the host, then `mountImagesInMotion(host, iimOptions)`. Expo: `createImagesInMotionWebViewHtml(iimOptions, undefined, { width: '20rem', height: '20rem', viewportWidth, viewportHeight })` in a WebView. Pass the native `onLayout` size as `viewportWidth` / `viewportHeight` on iOS. NativeScript: the custom element (or a module script) in a WebView, with rem on the element. The custom element reads attributes only.

## Custom element attributes

Tag: `images-in-motion`. Observed attributes: `images`, `angle`, `speed-range`, `tile-width`, `tile-aspect-ratio`, `gap`, `overlay-opacity`, `overlay-color`, `image-order`, `motion-axis`, `tile-fit`, `gap-color`, `gap-opacity`, `paused`, `stop-on-hover`, `animate-on-hover`.

## Settings export

Studio copies the `props` object only. Images are not included. Full field list, omissions, and how to spread the payload onto a mount: [Image-free JSON](/export).

```json
{
  "speedRange": [8, 18],
  "angle": 12,
  "tileWidth": 168,
  "tileAspectRatio": 0.6666666666666666,
  "gap": 4,
  "imageOrder": "sequential",
  "motionAxis": "vertical",
  "tileFit": "fixed",
  "gapColor": "#000000",
  "gapOpacity": 1
}
```

`overlayOpacity` and `overlayColor` appear only when the overlay is enabled. `stopOnHover` and `animateOnHover` appear only when that hover mode is selected. Both selected exports neither.
