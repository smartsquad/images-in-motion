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

`bun dev` is the VitePress site (docs, examples, embedded studio) at `http://127.0.0.1:5173/`. `docs:dev` is the same command. Do not point `dev` at the standalone studio Vite app. Standalone 01 / MOTION STUDY chrome is `bun run studio:dev` at `http://127.0.0.1:4179/`. Production docs: `https://iim.smartsquad.io/` (`base: /`). OG frames: `bun run og:dev` at `http://127.0.0.1:4180/`.

## Learned User Preferences

- Docs visual reference is arrow-js.com. Frameworks hub follows vite-pwa.org. Do not replace the VitePress site with a React or Next marketing app.
- Do not add `react-native-web`, `'use dom'`, Reanimated, Skia, or a React Native / NativeScript view port for the mosaic.
