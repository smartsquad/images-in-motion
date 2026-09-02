export type TImagesInMotionImageOrder = 'sequential' | 'random'
export type TImagesInMotionMotionAxis = 'vertical' | 'horizontal'
export type TImagesInMotionTileFit = 'auto' | 'static' | 'dynamic' | 'fixed'
export type TImagesInMotionObjectFit = 'cover' | 'fill'

/** Presentation options shared by every renderer. */
export interface IImagesInMotionOptions {
  /** Logical pixels per second, clamped to 0.1–1000; sorted endpoints default to [8, 18]. */
  speedRange?: readonly [number, number]
  /** Clockwise rotation in degrees. Defaults to 12. */
  angle?: number
  /** Tile width, clamped to 16–4096; defaults to a responsive value between 100 and 220. */
  tileWidth?: number
  /** Tile width divided by height, clamped to 0.1–10. Defaults to 2 / 3. */
  tileAspectRatio?: number
  /** Space between tiles and lanes, clamped to 0–1024. Defaults to 4. */
  gap?: number
  /** Overlay opacity; undefined omits the overlay entirely. */
  overlayOpacity?: number
  /** Overlay fill. Hex `#rgb` or `#rrggbb`; defaults to `#000000`. */
  overlayColor?: string
  /** Sequential cycles the image list; random uses a stable shuffle. Defaults to sequential. */
  imageOrder?: TImagesInMotionImageOrder
  /** Vertical scrolls columns; horizontal scrolls rows. Defaults to vertical. */
  motionAxis?: TImagesInMotionMotionAxis
  /**
   * How tiles are sized. `fixed` uses tile width and ratio with cover.
   * `auto` uses each image's aspect. `static` uses one shared aspect.
   * `dynamic` stretches every image to the tallest fitted height.
   */
  tileFit?: TImagesInMotionTileFit
  /** Width / height for each source image. Used by auto, static, and dynamic. */
  imageAspects?: readonly number[]
  /** Gap fill. Hex `#rgb` or `#rrggbb`; defaults to `#000000`. */
  gapColor?: string
  /** Gap alpha, 0–1. Defaults to 1. */
  gapOpacity?: number
}

/** A single repeat period; render two copies, including each copy's final gap. */
export interface IImagesInMotionLane {
  imageIndices: number[]
  cycleHeight: number
  durationMs: number
  delayMs: number
  reverse: boolean
  left: number
  top: number
  sizes: { width: number, height: number }[]
}

/** Geometry in the coordinate system before the sheet is rotated about its center. */
export interface IImagesInMotionLayout {
  width: number
  height: number
  left: number
  top: number
  angle: number
  tileWidth: number
  tileHeight: number
  gap: number
  overlayOpacity: number | undefined
  overlayColor: string | undefined
  motionAxis: TImagesInMotionMotionAxis
  tileFit: TImagesInMotionTileFit
  objectFit: TImagesInMotionObjectFit
  gapColor: string
  gapOpacity: number
  lanes: IImagesInMotionLane[]
}

const EDefaultSpeedRange = [8, 18] as const
const EDefaultAngle = 12
const EDefaultAspectRatio = 2 / 3
const EDefaultGap = 4
const EDefaultOverlayColor = '#000000'
const ERandomImageOrderSeed = 0x49694d31
const EEdgeSafety = 2
const EGoldenRatioFraction = (Math.sqrt(5) - 1) / 2

function finiteOr(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) ? value : fallback
}

function positiveOr(value: number | undefined, fallback: number): number {
  const finite = finiteOr(value, fallback)
  return finite > 0 ? finite : fallback
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function laneFraction(index: number, offset: number): number {
  return ((index + offset) * EGoldenRatioFraction) % 1
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = state + 0x6d2b79f5 | 0
    let t = Math.imul(state ^ state >>> 15, 1 | state)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function shuffledIndices(count: number): number[] {
  const indices = Array.from({ length: count }, (_, index) => index)
  const random = mulberry32(ERandomImageOrderSeed + count)
  for (let index = count - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * (index + 1))
    const current = indices[index]!
    indices[index] = indices[swapWith]!
    indices[swapWith] = current
  }
  return indices
}

function sanitizeOverlayColor(value: string | undefined): string {
  return sanitizeHexColor(value, EDefaultOverlayColor)
}

function resolveImageOrder(value: TImagesInMotionImageOrder | undefined): TImagesInMotionImageOrder {
  return value === 'random' ? 'random' : 'sequential'
}

function resolveMotionAxis(value: TImagesInMotionMotionAxis | undefined): TImagesInMotionMotionAxis {
  return value === 'horizontal' ? 'horizontal' : 'vertical'
}

function resolveTileFit(value: TImagesInMotionTileFit | undefined): TImagesInMotionTileFit {
  if (value === 'auto' || value === 'static' || value === 'dynamic') {
    return value
  }
  return 'fixed'
}

function resolveAspect(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) && value > 0
    ? clamp(value, 0.1, 10)
    : fallback
}

function sanitizeHexColor(value: string | undefined, fallback: string): string {
  if (value === undefined) {
    return fallback
  }
  const hex = value.trim()
  const short = /^#([0-9a-fA-F]{3})$/.exec(hex)
  if (short) {
    const [, digits] = short
    return `#${digits![0]}${digits![0]}${digits![1]}${digits![1]}${digits![2]}${digits![2]}`.toLowerCase()
  }
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return hex.toLowerCase()
  }
  return fallback
}

function laneImages(
  laneIndex: number,
  laneCount: number,
  count: number,
  minimumAlong: number,
  imageAt: (index: number) => number,
): number[] {
  const partitionImages = count >= laneCount * 2
  const partitionLength = partitionImages
    ? Math.ceil((count - laneIndex) / laneCount)
    : count
  const partition = Array.from({ length: partitionLength }, (_, imageIndex) => (
    imageAt(partitionImages
      ? laneIndex + imageIndex * laneCount
      : (laneIndex + imageIndex) % count)
  ))
  const repeatCount = Math.ceil(minimumAlong / partitionLength)
  return Array.from(
    { length: partitionLength * repeatCount },
    (_, imageIndex) => partition[imageIndex % partitionLength]!,
  )
}

export function createImagesInMotionLayout(
  width: number,
  height: number,
  imageCount: number,
  options: IImagesInMotionOptions = {},
): IImagesInMotionLayout {
  const viewportWidth = Math.max(0, finiteOr(width, 0))
  const viewportHeight = Math.max(0, finiteOr(height, 0))
  const count = Math.max(0, Math.floor(finiteOr(imageCount, 0)))
  const automaticTileWidth = Math.min(220, Math.max(100, viewportWidth / 3.5))
  const tileWidth = clamp(positiveOr(options.tileWidth, automaticTileWidth), 16, 4096)
  const aspectRatio = clamp(positiveOr(options.tileAspectRatio, EDefaultAspectRatio), 0.1, 10)
  const tileHeight = tileWidth / aspectRatio
  const gap = clamp(finiteOr(options.gap, EDefaultGap), 0, 1024)
  const angle = ((finiteOr(options.angle, EDefaultAngle) % 360) + 540) % 360 - 180
  const radians = angle * Math.PI / 180
  const cosine = Math.abs(Math.cos(radians))
  const sine = Math.abs(Math.sin(radians))
  /** Inverse-rotating the viewport gives the exact sheet bounds for every aspect ratio. */
  const sheetWidth = viewportWidth * cosine + viewportHeight * sine + EEdgeSafety * 2
  const sheetHeight = viewportWidth * sine + viewportHeight * cosine + EEdgeSafety * 2
  const firstSpeed = clamp(positiveOr(options.speedRange?.[0], EDefaultSpeedRange[0]), 0.1, 1000)
  const secondSpeed = clamp(positiveOr(options.speedRange?.[1], EDefaultSpeedRange[1]), 0.1, 1000)
  const minimumSpeed = Math.min(firstSpeed, secondSpeed)
  const maximumSpeed = Math.max(firstSpeed, secondSpeed)
  const overlayOpacity = options.overlayOpacity === undefined
    ? undefined
    : Math.min(1, Math.max(0, finiteOr(options.overlayOpacity, 0)))
  const overlayColor = overlayOpacity === undefined
    ? undefined
    : sanitizeOverlayColor(options.overlayColor)
  const motionAxis = resolveMotionAxis(options.motionAxis)
  const tileFit = resolveTileFit(options.tileFit)
  const objectFit: TImagesInMotionObjectFit = tileFit === 'dynamic' ? 'fill' : 'cover'
  const gapColor = sanitizeHexColor(options.gapColor, EDefaultOverlayColor)
  const gapOpacity = options.gapOpacity === undefined
    ? 1
    : Math.min(1, Math.max(0, finiteOr(options.gapOpacity, 1)))
  const layout: IImagesInMotionLayout = {
    width: sheetWidth,
    height: sheetHeight,
    left: (viewportWidth - sheetWidth) / 2,
    top: (viewportHeight - sheetHeight) / 2,
    angle,
    tileWidth,
    tileHeight,
    gap,
    overlayOpacity,
    overlayColor,
    motionAxis,
    tileFit,
    objectFit,
    gapColor,
    gapOpacity,
    lanes: [],
  }

  if (!count || !viewportWidth || !viewportHeight) {
    return layout
  }

  const horizontal = motionAxis === 'horizontal'
  const fallbackAspect = aspectRatio
  const aspects = Array.from({ length: count }, (_, index) => (
    resolveAspect(options.imageAspects?.[index], fallbackAspect)
  ))
  const sharedAspect = resolveAspect(options.imageAspects?.[0], fallbackAspect)
  const staticHeight = tileWidth / sharedAspect
  const dynamicHeight = Math.max(...aspects.map((aspect) => tileWidth / aspect))
  const dynamicWidth = Math.max(...aspects.map((aspect) => tileHeight * aspect))
  const uniformWidth = tileFit === 'dynamic' && horizontal
    ? dynamicWidth
    : tileWidth
  const uniformHeight = tileFit === 'static'
    ? staticHeight
    : tileFit === 'dynamic' && !horizontal
      ? dynamicHeight
      : tileHeight

  const sizeFor = (imageIndex: number): { width: number, height: number } => {
    if (tileFit === 'auto') {
      const aspect = aspects[imageIndex] ?? fallbackAspect
      return horizontal
        ? { width: tileHeight * aspect, height: tileHeight }
        : { width: tileWidth, height: tileWidth / aspect }
    }
    return { width: uniformWidth, height: uniformHeight }
  }

  const alongOf = (size: { width: number, height: number }) => (
    horizontal ? size.width : size.height
  )
  const crossSize = horizontal
    ? (tileFit === 'auto' ? tileHeight : uniformHeight)
    : tileWidth
  const laneStride = crossSize + gap
  const crossExtent = horizontal ? sheetHeight : sheetWidth
  const alongExtent = horizontal ? sheetWidth : sheetHeight
  const laneCount = Math.ceil((crossExtent + gap) / laneStride)
  const totalLaneExtent = laneCount * laneStride - gap
  const startOffset = (crossExtent - totalLaneExtent) / 2
  const order = resolveImageOrder(options.imageOrder) === 'random'
    ? shuffledIndices(count)
    : undefined
  const imageAt = (index: number) => order?.[index] ?? index

  layout.lanes = Array.from({ length: laneCount }, (_, laneIndex) => {
    const partition = laneImages(laneIndex, laneCount, count, 1, imageAt)
    const passLength = partition.reduce((sum, imageIndex) => (
      sum + alongOf(sizeFor(imageIndex)) + gap
    ), 0)
    const repeatCount = Math.max(1, Math.ceil(alongExtent / Math.max(passLength, 1)))
    const imageIndices = Array.from(
      { length: partition.length * repeatCount },
      (_, imageIndex) => partition[imageIndex % partition.length]!,
    )
    const sizes = imageIndices.map((imageIndex) => sizeFor(imageIndex))
    /** The terminal gap is part of the period, so the two copies meet without a jump. */
    const cycleHeight = sizes.reduce((sum, size) => sum + alongOf(size) + gap, 0)
    const speed = minimumSpeed + (maximumSpeed - minimumSpeed) * laneFraction(laneIndex, 1)
    const durationMs = cycleHeight / speed * 1000
    const offset = startOffset + laneIndex * laneStride

    return {
      imageIndices,
      cycleHeight,
      durationMs,
      delayMs: -durationMs * laneFraction(laneIndex, 2),
      reverse: laneIndex % 2 === 1,
      left: horizontal ? 0 : offset,
      top: horizontal ? offset : 0,
      sizes,
    }
  })

  return layout
}
