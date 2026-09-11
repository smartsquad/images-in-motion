# Contributing

Rules live in [CONVENTIONS.md](./CONVENTIONS.md). Agent entrypoint: [AGENTS.md](./AGENTS.md).

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

The documentation site and the studio deploy from `main` via `.github/workflows/pages.yml`. Enable Pages on the repository: **Settings → Pages → Source → GitHub Actions**. Custom domain: `iim.smartsquad.io` (CNAME to `smartsquad.github.io`, DNS only).

- Site: `https://iim.smartsquad.io/`
- Studio: `https://iim.smartsquad.io/studio/`

VitePress `base` is `/` locally and in production.

## GitHub Release

1. Move `[Unreleased]` entries under `## [X.Y.Z] - YYYY-MM-DD` in `CHANGELOG.md`.
2. Set `package.json` version to `X.Y.Z`.
3. Commit on `main` and push.
4. Tag that commit and push the tag: `git tag vX.Y.Z && git push origin vX.Y.Z`.

`.github/workflows/release.yml` runs on `vX.Y.Z` tags whose commit is on `main`. It checks that the tag matches `package.json`, takes notes from the changelog section, and creates the GitHub Release.

## npm publish

Pushing the version tag is enough. `.github/workflows/release.yml` creates the GitHub Release. `.github/workflows/npm-publish.yml` also runs on that tag (and on a published release). It re-runs validate, then publishes `images-in-motion` to npmjs. GitHub does not start a second workflow from a release created with `GITHUB_TOKEN`, so npm publish listens to the tag, not only to the release event.

Preferred: [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC). No token in the repository. On npmjs.com, add a trusted publisher for package `images-in-motion`: GitHub organization `smartsquad`, repository `images-in-motion`, workflow filename `npm-publish.yml`.

Alternative: a [granular access token](https://docs.npmjs.com/creating-and-viewing-access-tokens) with **Bypass two-factor authentication** checked and **Packages and scopes → Read and write**. Put it in the repository secret `NPM_TOKEN`. Classic "Automation" tokens no longer exist. npm is dropping 2FA-bypass tokens for direct publish in January 2027; prefer trusted publishing.

`prepublishOnly` already runs test, typecheck, build, and `test:dist`.

## Docs playgrounds

Snack, StackBlitz, and Load live preview open the snippet tab visible above the buttons (`frameworkExampleTabs` in `docs/.vitepress/framework-example-source.ts`). Do not ship a second app source. The local library is vendored into the StackBlitz project only so `import 'images-in-motion'` resolves.

| Guide tab | Host |
|-----------|------|
| Expo Native | Expo Snack (`createSnackLaunchUrl` with that tab's code) |
| Every other tab | StackBlitz SDK (`createStackBlitzProject` with that tab's code) |

`docs/playgrounds/` is the GitHub-import fallback for the first tab of each web guide. Keep those app files equal to that first snippet. The on-page mosaic uses the verified Unsplash pool in `docs/playgrounds/shared/images.ts`. Snippets use Picsum.

Do not put `rem` on the native WebView `style`. Size `#stage` in CSS and pass the native `onLayout` box as `viewportWidth` / `viewportHeight`. After `bun run build`, `docs:dev` and `docs:build` copy `dist/iife/images-in-motion.global.js` to `docs/public/` for the docs site. That file is gitignored. Do not point Snack at Snack web preview as the mosaic runtime.

`docs/.vitepress/playground.ts` holds the host URLs. Tests require each Snack/StackBlitz app file to equal the snippet tab.

In-page StackBlitz embeds need a cross-origin isolated parent. VitePress `dev` and `preview` send `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless`. The embed sets `crossOriginIsolated: true`. GitHub Pages cannot send those headers, so production shows only Open in StackBlitz.

## License

Contributions are licensed under the repository [MIT license](./LICENSE). Copyright holder: Smart Squad Srl.
