import type { IImagesInMotionMountOptions } from './mount'

export const EImagesInMotionIifeSrc = 'https://unpkg.com/images-in-motion'

function escapeScriptSrc(src: string): string {
  return src.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function embedJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

/** HTML document for a native WebView. Loads the IIFE and mounts `iimOptions`. */
export function createImagesInMotionWebViewHtml(
  options: IImagesInMotionMountOptions,
  scriptSrc = EImagesInMotionIifeSrc,
): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>html,body,#stage{margin:0;width:100%;height:100%;background:transparent;overflow:hidden}</style>
</head>
<body>
<div id="stage"></div>
<script src="${escapeScriptSrc(scriptSrc)}"></script>
<script>ImagesInMotion.mountImagesInMotion(document.getElementById("stage"),${embedJson(options)})</script>
</body>
</html>`
}
