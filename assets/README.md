# Brand assets

The Phase Cuts mark derives from the original three-column favicon. The columns share the same top and bottom bounds. Their internal cuts sit at different heights to express independent motion without losing the compact three-lane silhouette.

SVG files are the source of truth. Docs and studio serve them from `docs/public/` and `studio/public/` through relative symlinks into this folder. They do not vendor copies.

## Files

| Theme | Square corners | Rounded corners | Colors |
| --- | --- | --- | --- |
| Dark | `mark-dark-square.svg` | `mark-dark-rounded.svg` | Gold `#A59050` and paper `#F3EFE8` on ink `#141313` |
| Light | `mark-light-square.svg` | `mark-light-rounded.svg` | Gold `#8F7A3E` and ink `#141313` on paper `#F3EFE8` |

- `mark.svg`: default dark rounded mark.
- `logo.svg`: default dark rounded mark-only logo alias.
- `favicon-dark.svg` and `favicon-light.svg`: compact 64 × 64 theme sources.
- `favicon.svg`: dark fallback favicon.
- `og/`: social preview source. `bun run og:dev` mounts the documentation Unsplash mosaic. Export `?p=stage` to replace `og.png`.
- `og.png`: official 1200 × 630 social preview (proposal C).
- VitePress logos: `docs/public/logo-light.svg` and `logo-dark.svg` point at `mark-light-rounded.svg` and `mark-dark-rounded.svg`.

## Geometry

The 1024 × 1024 masters use three 192-unit lanes at `x=160`, `416`, and `672`. Every lane starts at `y=128` and ends at `y=896`. The internal cuts are 64 units high. Internal modules use radius 32. Rounded fields use radius 192.
