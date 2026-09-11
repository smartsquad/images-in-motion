# Agents: images in motion

Entrypoint for agentic tooling working on this repository.

## Read these first (mandatory)

| Doc | Why |
|-----|-----|
| **[CONVENTIONS.md](./CONVENTIONS.md)** | Architecture, studio UI lock, git, versioning, validation |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Change workflow |
| **[CHANGELOG.md](./CHANGELOG.md)** | Release history |

Follow **CONVENTIONS.md** for every change. This file is a short checklist only.

## Language policy

- Markdown, comments, commits: English only.

## Non-negotiables

1. Geometry lives in `src/core`. Animation lives in `src/js`. React and Vue only mount that renderer.
2. The studio keeps the 01 / MOTION STUDY layout.
3. JSON export never includes images or blob URLs.
4. No em dash, no filler, no co-author trailers.
5. Bun only. No Python.

## Commands

```bash
bun install
bun run test
bun run typecheck
bun run lint
bun run build
bun run test:dist
bun run build:studio
bun run docs:build
bun dev
bun run docs:dev
bun run studio:dev
bun run og:dev
```

`bun dev` is the VitePress site (docs, examples, embedded studio) at `http://127.0.0.1:5173/`. `docs:dev` is the same command. Do not point `dev` at the standalone studio Vite app. Standalone 01 / MOTION STUDY chrome is `bun run studio:dev` at `http://127.0.0.1:4179/`. Production docs: `https://iim.smartsquad.io/` (`base: /`). OG frames: `bun run og:dev` at `http://127.0.0.1:4180/`. `bun run lint` is check-only; `lint:fix` is opt-in. GitHub releases tag `v` plus the package.json version (e.g. `v1.0.0`), never `v.0.2.2`.

## Learned User Preferences

- Docs visual reference is arrow-js.com. Frameworks hub follows vite-pwa.org. Do not replace the VitePress site with a React or Next marketing app. In-page StackBlitz needs COOP/COEP `credentialless` on the VitePress server and `crossOriginIsolated: true` on the embed. GitHub Pages cannot send those headers. Snack, StackBlitz, and Load live preview must run the snippet tab immediately above the buttons, not a second playground app.
- Do not add `react-native-web`, `'use dom'`, Reanimated, Skia, or a React Native / NativeScript view port for the mosaic. Expo web cannot use `react-native-webview` (stub: "does not support this platform"). On `expo start --web`, put `createImagesInMotionWebViewHtml` in an `iframe`. WebView is iOS/Android only. Native WebView style is `flex: 1`. Never put `rem` on React Native `style`. `20rem` lives in the HTML `#stage`. iOS `source={{ html }}` sizes the document to `#stage`. Pass `viewportWidth` / `viewportHeight` from `onLayout`.
- Do not add LIVE badges on frameworks hub cards.
- Never write "not published yet", "not on npm yet", or similar unpublished-status copy.
- No invented pixel size. React/Vue fill a sized parent with CSS `100%` (never HTML attributes). Examples fill the available box and size the mosaic to `20rem` by `20rem`. Warn on 0×0. Do not add a hidden fallback box.
- Framework copy-paste snippets define `const images = [...]` with Picsum random URLs (`https://picsum.photos/...?random=N`). Never `pickExampleImages`, never `images-in-motion/examples` in snippets, never static `images.unsplash.com/photo-` IDs. Live mosaics use the verified Unsplash pool from `src/example-images.ts`.
- Framework snippets must be complete runnable sources (React `App` with `return`, Vue SFC, Expo `App`, etc.), not fragments. Props and Options tabs both. Framework docs order: React, Vue, Expo, NativeScript, JavaScript, Custom element.
- Site meta, Open Graph, Twitter, and image alt copy must say what the library does. Use: "Open-source JS library for displaying independent columns, opposite directions: a continuous animated image pattern for the web." Do not invent new description or alt text.

## Learned Workspace Facts

- No-install JS uses the IIFE from unpkg (`https://unpkg.com/images-in-motion`); jsDelivr is the alternate. Do not load runtime from `https://iim.smartsquad.io/images-in-motion.global.js`.
