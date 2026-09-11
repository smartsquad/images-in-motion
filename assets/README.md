# Brand assets

The Phase Cuts mark comes from the original three-column favicon. The columns share the same top and bottom bounds. Their internal cuts sit at different heights so the three lanes read as independent motion, while the silhouette stays compact.

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
- `favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png`: raster icons for Google and iOS. Render from `favicon.svg`.
- `og/`: social preview source. `bun run og:dev` mounts the documentation Unsplash mosaic. Export `?p=stage` to replace `og.png`, then compress to `og.jpg`.
- `og.png`: 1200 × 630 source (proposal C).
- `og.jpg`: 1200 × 630 social file under 500 KB for WhatsApp and OG checkers.
- VitePress logos: `docs/public/logo-light.svg` and `logo-dark.svg` point at `mark-light-rounded.svg` and `mark-dark-rounded.svg`.

## Geometry

The 1024 × 1024 masters use three 192-unit lanes at `x=160`, `416`, and `672`. Every lane starts at `y=128` and ends at `y=896`. The internal cuts are 64 units high. Internal modules use radius 32. Rounded fields use radius 192.
