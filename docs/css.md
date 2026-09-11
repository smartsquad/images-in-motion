---
title: No frames! Pure CSS
description: Motion is one CSS @keyframes translate per lane. No requestAnimationFrame loop. React, Vue, Expo, and NativeScript host that same renderer.
---

# No frames! Pure CSS

Each lane moves with one CSS `@keyframes` translate. Geometry is computed once per size and options (`src/core`). The DOM renderer (`src/js`) injects a stylesheet and gives each lane a CSS animation. The browser composites those transforms. JavaScript does not run a `requestAnimationFrame` loop or redraw a canvas, and React and Vue do not render on every tick.

## What moves

Each lane is a `.iim-track`. Vertical tracks use `iim-scroll`. Horizontal tracks use `iim-scroll-x`. Both are `translate3d` from `0` to `var(--iim-cycle)`, linear, infinite.

```css
@keyframes iim-scroll {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, var(--iim-cycle), 0); }
}
@keyframes iim-scroll-x {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(var(--iim-cycle), 0, 0); }
}
```

The stylesheet is injected once as `#images-in-motion-style` from `src/js/style.ts`.

Layout then sets per-track CSS, not new keyframes:

| Property | Source |
| --- | --- |
| `--iim-cycle` | Negative cycle length in pixels |
| `animation-duration` | `cycle / speed` in milliseconds |
| `animation-delay` | Phase offset so neighbours do not line up |
| `animation-direction` | `reverse` on odd lanes, `normal` on even |

Odd lanes travel the other way. Speeds stay constant inside a lane and differ between lanes. The sheet rotation (`angle`) is a CSS `transform` on `.iim-sheet`, not a per-frame spin.

Each track contains two copies of the image cycle. The last gap is part of the period, so the loop does not jump when it wraps.

## Pause eases, then holds

Playback never tears down the tracks. Pause, resume, and hover stop/start ramp `playbackRate` on the CSS animations (about half a second), then `animation-play-state` holds the pose. `prefers-reduced-motion` and a hidden tab still snap.

`shouldRunAnimation` in `src/core/playback.ts` turns it off when:

- `paused` is true
- `prefers-reduced-motion: reduce`
- the document is hidden
- hover mode is `stop` and the pointer is over the host
- hover mode is `animate` and the pointer is not over the host

See [Install and usage](/guide#pause-and-motion-preference).

## What React and Vue do

Bindings create a host, call `mountImagesInMotion` on an inner stage, and call `update` / `destroy`. They do not own keyframes, layout math, or playback.

The decorative layer has `pointer-events: none`. Children (React children, Vue slot) sit above it and stay interactive.

## What Expo and NativeScript do

There is no React Native or NativeScript mosaic. [Expo](/frameworks/expo) and [NativeScript](/frameworks/nativescript) host this same CSS renderer in a native WebView.

The same `translate3d` `@keyframes` (`iim-scroll` / `iim-scroll-x`) run inside that WebView. WKWebView and Android WebView composite those transforms. Do not add `react-native-web`, `'use dom'`, Reanimated, or Skia for the lanes.

Mount surfaces: [Frameworks](/frameworks/).

## Compared with a JS frame loop

| Alternative | This library |
| --- | --- |
| `requestAnimationFrame` + style writes | CSS `@keyframes` |
| Canvas or WebGL | DOM tiles and CSS transforms |
| Per-frame React state | One mount, CSS runs |
| A React Native or NativeScript view | The same CSS renderer in a WebView |
| A video or GIF | Still images, looping translate |

JS still runs for mount, resize, image aspect measurement, SVG normalization, and playback flags. It does not run the scroll.

## Related

- [Frameworks](/frameworks/) to pick a mount
- [Expo](/frameworks/expo) and [NativeScript](/frameworks/nativescript) for the native WebView hosts
- [API](/api) for layout options
- [Bundle size](/size) for the JS payload
- [Examples](/examples) for live configs
