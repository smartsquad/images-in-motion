# Contributing

Thanks for improving Images in motion.

> Rules live in [CONVENTIONS.md](./CONVENTIONS.md). Agent entrypoint: [AGENTS.md](./AGENTS.md).

## Before you start

1. Read CONVENTIONS.md.
2. Branch from an up-to-date `main`: `fix/...`, `feat/...`, `docs/...`.
3. Confirm the toolchain: Bun, Node 22 (CI).

## What to contribute

| Welcome | Needs an issue first |
|---------|----------------------|
| Geometry or playback bug with a test | Changing the public prop names |
| Docs and examples | Restyling the studio |
| Binding fixes that keep React and Vue on `mountImagesInMotion` | Adding a runtime React-in-Vue bridge |

## Verify

```bash
bun run test
bun run typecheck
bun run lint
bun run build
bun run test:dist
bun run build:studio
bun run docs:build
```

`bun run lint` is a check (`eslint .`, no `--fix`). `bun run lint:fix` is opt-in only. Do not enable format-on-save or lint-staged auto-fix.

Local docs (`bun dev` or `bun run docs:dev`) are served at `http://127.0.0.1:5173/`. The standalone studio is `bun run studio:dev` at `http://127.0.0.1:4179/`.

## Pull request

- One topic per PR.
- English description: what changed.
- CI must be green.

## GitHub Pages

The documentation site and the studio deploy from `main` via `.github/workflows/pages.yml`. Enable Pages on the repository: **Settings → Pages → Source → GitHub Actions**.

- Site: `https://smartsquad.github.io/images-in-motion/`
- Studio: `https://smartsquad.github.io/images-in-motion/studio/`

Local VitePress uses `/`. GitHub Pages keeps the `/images-in-motion/` prefix because the repo is a project site.

## npm publish

A GitHub Release whose tag is `v` plus the `package.json` version (for example `v0.2.2`) runs `.github/workflows/npm-publish.yml`. That workflow re-runs validate, then publishes `images-in-motion` to npmjs.

Preferred: [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC). No token in the repository. On npmjs.com, add a trusted publisher for package `images-in-motion`: GitHub organization `smartsquad`, repository `images-in-motion`, workflow filename `npm-publish.yml`.

Alternative: set the repository secret `NPM_TOKEN` to an npm automation token. The publish job reads it when present. Prefer trusted publishing.

`prepublishOnly` already runs test, typecheck, build, and `test:dist`.

## Docs playgrounds

Framework guides launch live editors from `docs/playgrounds/`. Update the matching folder when the mount example on that guide changes.

| Guide | Host | Folder |
|-------|------|--------|
| React | StackBlitz | `docs/playgrounds/react` |
| Vue | StackBlitz | `docs/playgrounds/vue` |
| JavaScript | StackBlitz | `docs/playgrounds/javascript` |
| Custom element | StackBlitz | `docs/playgrounds/element` |
| Expo | Snack | `docs/playgrounds/expo/App.tsx` |
| NativeScript | NativeScript Preview | `docs/playgrounds/nativescript/images-in-motion.html` |

Web playgrounds alias `images-in-motion` to `src/` (`vite.config.ts`).

Shared demo images live in `docs/playgrounds/shared/images.ts` (verified Unsplash IDs only).

Expo Snack does not import `images-in-motion`. It inlines WebView HTML and loads the docs-hosted IIFE (`https://smartsquad.github.io/images-in-motion/images-in-motion.global.js`). After `bun run build`, `docs:dev` and `docs:build` copy `dist/iife/images-in-motion.global.js` to `docs/public/`. That file is gitignored. Do not point Snack at Snack web preview as the mosaic runtime. Snack web uses react-native-web for the app shell.

NativeScript has no in-browser mosaic. Keep the CTA on `https://nativescript.new/typescript` and `https://preview.nativescript.org/`. Do not invent a Playground URL. The classic Playground is retired.

`docs/.vitepress/playground.ts` holds the host URLs. Tests cover those links and the Expo/NativeScript file constraints.

## License

Contributions are licensed under the repository [MIT license](./LICENSE). Copyright holder: Smart Squad Srl.
