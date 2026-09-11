import type { IImagesInMotionMountOptions } from './mount'

export const EImagesInMotionIifeSrc = 'https://unpkg.com/images-in-motion'

export type TImagesInMotionWebViewHostSize = {
  width?: string
  height?: string
  /** Native WebView box in CSS px. iOS `source={{ html }}` otherwise shrinks the document to `#stage`. */
  viewportWidth?: number
  viewportHeight?: number
}

function escapeScriptSrc(src: string): string {
  return src.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function embedJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function cssLength(value: string | undefined, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback
  }
  const trimmed = value.trim()
  if (/^-?[\d.]+(%|px|rem|em|vw|vh|svh|dvh)$/.test(trimmed) || trimmed === 'auto') {
    return trimmed
  }
  return fallback
}

function cssViewportPx(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined
  }
  return Math.round(value)
}

/** Full HTML document for a native WebView: IIFE script plus `iimOptions` mount. */
export function createImagesInMotionWebViewHtml(
  options: IImagesInMotionMountOptions,
  scriptSrc = EImagesInMotionIifeSrc,
  hostSize?: TImagesInMotionWebViewHostSize,
): string {
  const width = cssLength(hostSize?.width, '100%')
  const height = cssLength(hostSize?.height, '100%')
  const viewportWidth = cssViewportPx(hostSize?.viewportWidth)
  const viewportHeight = cssViewportPx(hostSize?.viewportHeight)
  const hasViewport = viewportWidth !== undefined && viewportHeight !== undefined
  const viewportMeta = hasViewport
    ? `width=${viewportWidth},initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no`
    : 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no'
  const shell = hasViewport
    ? `html,body,#frame{margin:0;width:${viewportWidth}px;height:${viewportHeight}px;background:transparent;overflow:hidden}#frame{display:flex;align-items:center;justify-content:center}`
    : 'html,body{margin:0;width:100%;height:100%;background:transparent;overflow:hidden}#frame{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}'
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="${viewportMeta}">
<style>${shell}#stage{width:${width};height:${height}}</style>
</head>
<body>
<div id="frame"><div id="stage"></div></div>
<script src="${escapeScriptSrc(scriptSrc)}"></script>
<script>ImagesInMotion.mountImagesInMotion(document.getElementById("stage"),${embedJson(options)})</script>
</body>
</html>`
}
