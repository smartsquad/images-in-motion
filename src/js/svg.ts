const EDefaultSvgWidth = 800
const EDefaultSvgHeight = 1200
const ESvgMime = 'image/svg+xml'

function parseSvgLength(value: string | null): number | undefined {
  if (!value) {
    return undefined
  }
  const match = /^([0-9.]+)\s*(px)?$/i.exec(value.trim())
  if (!match) {
    return undefined
  }
  const parsed = Number(match[1])
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function parseViewBoxSize(value: string | null): { width: number, height: number } | undefined {
  if (!value) {
    return undefined
  }
  const parts = value.trim().split(/[\s,]+/).map(Number)
  if (parts.length !== 4) {
    return undefined
  }
  const width = parts[2]
  const height = parts[3]
  if (width === undefined || height === undefined || !(width > 0) || !(height > 0)) {
    return undefined
  }
  return { width, height }
}

export function isSvgMarkup(text: string): boolean {
  const trimmed = text.trim().replace(/^\uFEFF/, '')
  return /<svg[\s>]/i.test(trimmed)
}

export function isSvgFile(file: File): boolean {
  const type = file.type.toLowerCase()
  const namedSvg = file.name.toLowerCase().endsWith('.svg')
  if (type === ESvgMime || type === 'image/svg' || type === 'application/svg+xml') {
    return true
  }
  if (namedSvg && (type === '' || type === 'text/xml' || type === 'application/xml' || type === 'text/plain')) {
    return true
  }
  return namedSvg && !type.startsWith('image/')
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/') || isSvgFile(file)
}

/** Adds an intrinsic size so `<img>` and `object-fit: cover` can draw the SVG. */
export function normalizeSvgMarkup(
  markup: string,
  width = EDefaultSvgWidth,
  height = EDefaultSvgHeight,
): string {
  if (typeof DOMParser === 'undefined') {
    return markup
  }
  const parsed = new DOMParser().parseFromString(markup, ESvgMime)
  const svg = parsed.documentElement
  if (!svg || svg.tagName.toLowerCase() !== 'svg') {
    return markup
  }
  if (!svg.getAttribute('xmlns')) {
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  }
  const viewBox = parseViewBoxSize(svg.getAttribute('viewBox'))
  const attrWidth = parseSvgLength(svg.getAttribute('width'))
  const attrHeight = parseSvgLength(svg.getAttribute('height'))
  const intrinsicWidth = attrWidth ?? viewBox?.width ?? width
  const intrinsicHeight = attrHeight ?? viewBox?.height ?? height
  if (!svg.getAttribute('viewBox')) {
    svg.setAttribute('viewBox', `0 0 ${intrinsicWidth} ${intrinsicHeight}`)
  }
  svg.setAttribute('width', String(intrinsicWidth))
  svg.setAttribute('height', String(intrinsicHeight))
  return typeof XMLSerializer === 'undefined'
    ? svg.outerHTML
    : new XMLSerializer().serializeToString(svg)
}

export async function createImageObjectUrl(file: File): Promise<string> {
  if (!isSvgFile(file)) {
    return URL.createObjectURL(file)
  }
  const markup = normalizeSvgMarkup(await file.text())
  return URL.createObjectURL(new Blob([markup], { type: ESvgMime }))
}

function looksLikeSvgUrl(src: string): boolean {
  const lower = src.toLowerCase()
  if (lower.startsWith('data:image/svg+xml')) {
    return true
  }
  try {
    return new URL(src, 'http://images-in-motion.local').pathname.toLowerCase().endsWith('.svg')
  } catch {
    return false
  }
}

function isSvgBlob(blob: Blob): boolean {
  const type = blob.type.toLowerCase()
  return type === ESvgMime
    || type === 'image/svg'
    || type === 'application/svg+xml'
    || type === 'text/xml'
    || type === 'application/xml'
    || type === ''
}

export function shouldPrepareImageSource(src: string): boolean {
  return src.startsWith('blob:') || looksLikeSvgUrl(src)
}

export async function prepareImageSource(src: string): Promise<string> {
  if (typeof fetch === 'undefined') {
    return src
  }
  try {
    const response = await fetch(src)
    const blob = await response.blob()
    if (!looksLikeSvgUrl(src) && !isSvgBlob(blob)) {
      return src
    }
    const text = await blob.text()
    if (!isSvgMarkup(text)) {
      return src
    }
    const normalized = normalizeSvgMarkup(text)
    return URL.createObjectURL(new Blob([normalized], { type: ESvgMime }))
  } catch {
    return src
  }
}
