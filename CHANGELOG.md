# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.1] - 2026-09-11

### Changed

- Docs and studio social preview use a 1200 × 630 JPEG under 500 KB, plus Open Graph, Twitter Card, canonical, favicon, and JSON-LD tags that OG checkers expect.
- Bumped the `happy-dom` test environment from 18 to 20.13.2 (CVE-2025-61927, CVE-2026-33943, CVE-2026-34226).
- Minor libraries update

## [1.0.0] - 2026-09-03

### Added

- `images-in-motion/examples` exports `pickExampleImages()` for the same random Unsplash pool as Live.
- One console warning when `mountImagesInMotion` measures a 0×0 host.
- `viewportWidth` / `viewportHeight` on `createImagesInMotionWebViewHtml` so iOS `source={{ html }}` can size the document to the native WebView.

### Changed

- Framework guide copy-paste examples are complete, runnable sources: React `App` with `return`, Vue SFCs, Expo `App`, and HTML/JS modules. Snippets define a `const images` of Picsum random URLs (`?random=`), not pinned `images.unsplash.com/photo-` IDs and not `pickExampleImages()`. Expo examples split Native (`react-native-webview`) and Web (same HTML in an `iframe`). Blocks use Shiki like the rest of VitePress. The on-page mosaic is `20rem` by `20rem`, centered, and uses a shuffled Unsplash set with at least twenty-four URLs. The Expo Snack playground sizes the native WebView with `flex: 1` and loads the IIFE from unpkg.
- Expo install commands include `npx`, `bunx`, `yarn`, and `pnpm`.
- React and Vue apply `width` / `height` as CSS on the host. Omit them and the host fills its parent. Framework examples fill the available box and size the mosaic to `20rem` by `20rem`. `export default function App()`.
- `createImagesInMotionWebViewHtml` accepts an optional rem (or other CSS) size for `#stage`. Expo Native examples measure the host with `onLayout` and pass that size as `viewportWidth` / `viewportHeight`.
- Recorded IIFE size is 17.38 KB raw, 6.47 KB gzip -9.
- Docs `dev` and `preview` send COOP / COEP `credentialless` so in-page StackBlitz WebContainers can start. The embed passes `crossOriginIsolated: true`.
- Snack, StackBlitz, and Load live preview open the snippet tab above the buttons. Expo Native goes to Snack. Other tabs go to StackBlitz.

## [0.2.2] - 2026-09-02

### Changed

- Stopped example-image picks from repeating a URL when a short category pool is topped up
- Pointed the docs site and studio to `https://iim.smartsquad.io/`
- Kept the home hero mosaic below the nav on small screens, instead of covering the wordmark
- Stacked the embedded studio preview and controls on small screens
- Built the library in the Pages workflow so the hosted IIFE is published with the docs

### Added

- Imported the first release from the private repository of `images-in-motion`
- Added temporary "open" functionality in StackBlitz on the React, Vue, JavaScript, and custom element guides, with an optional click-to-load live preview. Expo opens Snack on a device. NativeScript links to NativeScript Preview.

[Unreleased]: https://github.com/smartsquad/images-in-motion/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/smartsquad/images-in-motion/releases/tag/v1.0.0
[0.2.2]: https://github.com/smartsquad/images-in-motion/releases/tag/v0.2.2
