# CONVENTIONS: images in motion

Mandatory rules for humans and agents working on this repository. When any other document disagrees, this file wins.

Related: [AGENTS.md](./AGENTS.md), [CONTRIBUTING.md](./CONTRIBUTING.md), [CHANGELOG.md](./CHANGELOG.md), [LICENSE](./LICENSE).

---

## 1. Language

- Everything in this repository is English: Markdown, comments, commit messages, PR titles.
- Product name: **Images in motion**. Package name: `images-in-motion`. Component name: `ImagesInMotion`.
- Copyright holder: Smart Squad S.r.l. MIT.

---

## 2. Architecture

The vanilla JS renderer is the component. React and Vue are bindings. They must not reimplement geometry or CSS animation.

| Layer | Path | Owns |
|------|------|------|
| Geometry | `src/core` | Layout math, settings export, reduced-motion helpers |
| Renderer | `src/js` | DOM, CSS keyframes, custom element, `mountImagesInMotion` |
| React | `src/react` | Host element + `mountImagesInMotion` |
| Vue | `src/vue` | Host element + `mountImagesInMotion` |
| Studio | `studio` | The public configurator (01 / MOTION STUDY) |
| Docs | `docs` | VitePress site (GitHub Pages). `/studio` is a VitePress page that embeds the React studio. |

Do not wrap React inside Vue with a runtime bridge. Vue consumers must not load React.

The Inksquad People native component stays in that monorepo. This library is web-only (DOM + CSS).

---

## 3. Studio UI

The studio must keep the motion-study layout: cream paper, gold eyebrow, dark stage, right-hand controls, pause that eases to a freeze. Do not restyle it into a marketing page. Wordmark may say `images in motion` / `STUDIO`; the headline stays `Images in motion.`

Copy settings to clipboard writes the image-free `props` object from `createImagesInMotionSettingsExport`. Canvas preview size, shape, corner radius, background, and browser fullscreen are host CSS in the studio. They are not renderer props and must not appear in JSON.

---

## 4. Prose

- No em dash (U+2014). Use commas, colons, or periods.
- No filler: "seamless", "robust", "leverage", "not only... but also".
- Terse. Tables for scannable data, numbered steps for procedures.
- Code blocks are runnable as written.

---

## 5. File naming

- Source: `kebab-case.ts` except React `images-in-motion.tsx`.
- Root policy docs: `UPPERCASE.md`.
- Types: `T` prefix. Interfaces: `I` prefix. Constants: `E` prefix.

---

## 6. Git and changelog

- Commits: `type: summary`, lowercase, imperative, subject only. No body, no trailers, never `Co-Authored-By` or any LLM attribution. Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `ci`, `test`.
- One logical change per commit.
- `CHANGELOG.md` follows Keep a Changelog 1.1.0 with `### Added`, `### Changed`, `### Removed`. Work accumulates under `## [Unreleased]`.
- No force-push to `main`. No secrets in the repository.
- Package manager and runtime: Bun. Do not add Python scripts.

---

## 7. Versioning

- SemVer in `package.json`. Bump on every user-visible change: patch for docs and data, minor for API additions, major for breaking props.

---

## 8. Validation checklist

```bash
bun run test
bun run typecheck
bun run lint
bun run build
bun run test:dist
bun run build:studio
bun run docs:build
```

---

## 9. Safety

- Images chosen in the studio never leave the browser. The JSON export must not include image URLs.
- The pattern is decorative: no pointer events, no accessibility tree for tiles.
- Reduced motion and a hidden tab pause the CSS animation immediately. `paused`, `stopOnHover`, and `animateOnHover` ease into stop and start. `stopOnHover` and `animateOnHover` are mutually exclusive mount options. Both off, or both on, keeps continuous motion.
