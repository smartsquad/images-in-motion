import { mountImagesInMotion, type IImagesInMotionHandle, type IImagesInMotionMountOptions } from './mount'
import type { TImagesInMotionImageOrder, TImagesInMotionMotionAxis, TImagesInMotionTileFit } from '../core'

const ETag = 'images-in-motion'
const EObserved = [
  'images',
  'angle',
  'speed-range',
  'tile-width',
  'tile-aspect-ratio',
  'gap',
  'overlay-opacity',
  'overlay-color',
  'image-order',
  'motion-axis',
  'tile-fit',
  'gap-color',
  'gap-opacity',
  'paused',
  'stop-on-hover',
  'animate-on-hover',
] as const

function parseFlag(element: HTMLElement, name: string): boolean {
  return element.hasAttribute(name) && element.getAttribute(name) !== 'false'
}

function parseNumber(value: string | null): number | undefined {
  if (value === null || value === '') {
    return undefined
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseImages(value: string | null): string[] {
  if (!value) {
    return []
  }
  const trimmed = value.trim()
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string')
      }
    } catch {
      return []
    }
  }
  return trimmed.split(',').map((item) => item.trim()).filter(Boolean)
}

function parseSpeedRange(value: string | null): readonly [number, number] | undefined {
  if (!value) {
    return undefined
  }
  try {
    const parsed = JSON.parse(value) as unknown
    if (Array.isArray(parsed) && parsed.length === 2 && typeof parsed[0] === 'number' && typeof parsed[1] === 'number') {
      return [parsed[0], parsed[1]]
    }
  } catch {
    const parts = value.split(',').map((item) => Number(item.trim()))
    if (parts.length === 2 && parts.every((item) => Number.isFinite(item))) {
      return [parts[0]!, parts[1]!]
    }
  }
  return undefined
}

function parseImageOrder(value: string | null): TImagesInMotionImageOrder | undefined {
  if (value === 'random' || value === 'sequential') {
    return value
  }
  return undefined
}

function parseMotionAxis(value: string | null): TImagesInMotionMotionAxis | undefined {
  if (value === 'horizontal' || value === 'vertical') {
    return value
  }
  return undefined
}

function parseTileFit(value: string | null): TImagesInMotionTileFit | undefined {
  if (value === 'auto' || value === 'static' || value === 'dynamic' || value === 'fixed') {
    return value
  }
  return undefined
}

export class ImagesInMotionElement extends HTMLElement {
  static readonly observedAttributes = [...EObserved]

  #handle: IImagesInMotionHandle | undefined

  connectedCallback(): void {
    this.#handle = mountImagesInMotion(this, this.#read())
  }

  disconnectedCallback(): void {
    this.#handle?.destroy()
    this.#handle = undefined
  }

  attributeChangedCallback(): void {
    this.#handle?.update(this.#read())
  }

  #read(): IImagesInMotionMountOptions {
    const overlay = this.getAttribute('overlay-opacity')
    const overlayColor = this.getAttribute('overlay-color')
    return {
      images: parseImages(this.getAttribute('images')),
      angle: parseNumber(this.getAttribute('angle')),
      speedRange: parseSpeedRange(this.getAttribute('speed-range')),
      tileWidth: parseNumber(this.getAttribute('tile-width')),
      tileAspectRatio: parseNumber(this.getAttribute('tile-aspect-ratio')),
      gap: parseNumber(this.getAttribute('gap')),
      overlayOpacity: overlay === null ? undefined : parseNumber(overlay),
      overlayColor: overlayColor === null || overlayColor === '' ? undefined : overlayColor,
      imageOrder: parseImageOrder(this.getAttribute('image-order')),
      motionAxis: parseMotionAxis(this.getAttribute('motion-axis')),
      tileFit: parseTileFit(this.getAttribute('tile-fit')),
      gapColor: this.getAttribute('gap-color') || undefined,
      gapOpacity: parseNumber(this.getAttribute('gap-opacity')),
      paused: parseFlag(this, 'paused'),
      stopOnHover: parseFlag(this, 'stop-on-hover'),
      animateOnHover: parseFlag(this, 'animate-on-hover'),
    }
  }
}

export function defineImagesInMotionElement(): void {
  if (typeof customElements === 'undefined') {
    return
  }
  if (!customElements.get(ETag)) {
    customElements.define(ETag, ImagesInMotionElement)
  }
}
