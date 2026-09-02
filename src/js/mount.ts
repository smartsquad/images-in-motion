import {
  createImagesInMotionLayout,
  isDocumentVisible,
  prefersReducedMotion,
  resolveHoverPlayback,
  shouldRunAnimation,
  subscribeReducedMotion,
  subscribeVisibility,
  type IImagesInMotionLayout,
  type IImagesInMotionOptions,
} from '../core'
import {
  EImagesInMotionPlaybackRampMs,
  playbackRampFinished,
  playbackRampRate,
  playbackRampT,
} from './playback-ramp'
import { ensureImagesInMotionStyle } from './style'
import { measureImageAspects } from './measure'
import { prepareImageSource, shouldPrepareImageSource } from './svg'

export interface IImagesInMotionMountOptions extends IImagesInMotionOptions {
  images: readonly string[]
  paused?: boolean
  /** Pause while the pointer is over the host. Ignored if `animateOnHover` is also set. */
  stopOnHover?: boolean
  /** Run only while the pointer is over the host. Ignored if `stopOnHover` is also set. */
  animateOnHover?: boolean
}

export interface IImagesInMotionHandle {
  update(options: Partial<IImagesInMotionMountOptions>): void
  destroy(): void
  getLayout(): IImagesInMotionLayout
}

interface IResolvedMountOptions extends IImagesInMotionOptions {
  images: readonly string[]
  paused: boolean
  stopOnHover: boolean
  animateOnHover: boolean
}

function owned(patch: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(patch, key)
}

function resolveOptions(
  current: IResolvedMountOptions,
  patch: Partial<IImagesInMotionMountOptions>,
): IResolvedMountOptions {
  return {
    images: patch.images ?? current.images,
    paused: patch.paused ?? current.paused,
    stopOnHover: owned(patch, 'stopOnHover') ? Boolean(patch.stopOnHover) : current.stopOnHover,
    animateOnHover: owned(patch, 'animateOnHover') ? Boolean(patch.animateOnHover) : current.animateOnHover,
    speedRange: patch.speedRange ?? current.speedRange,
    angle: patch.angle ?? current.angle,
    tileWidth: patch.tileWidth ?? current.tileWidth,
    tileAspectRatio: patch.tileAspectRatio ?? current.tileAspectRatio,
    gap: patch.gap ?? current.gap,
    overlayOpacity: owned(patch, 'overlayOpacity')
      ? patch.overlayOpacity
      : current.overlayOpacity,
    overlayColor: owned(patch, 'overlayColor')
      ? patch.overlayColor
      : current.overlayColor,
    imageOrder: owned(patch, 'imageOrder')
      ? patch.imageOrder
      : current.imageOrder,
    motionAxis: owned(patch, 'motionAxis')
      ? patch.motionAxis
      : current.motionAxis,
    tileFit: owned(patch, 'tileFit')
      ? patch.tileFit
      : current.tileFit,
    imageAspects: owned(patch, 'imageAspects')
      ? patch.imageAspects
      : current.imageAspects,
    gapColor: owned(patch, 'gapColor')
      ? patch.gapColor
      : current.gapColor,
    gapOpacity: owned(patch, 'gapOpacity')
      ? patch.gapOpacity
      : current.gapOpacity,
  }
}

function hoverTarget(host: HTMLElement): HTMLElement {
  const passThrough = host.style.pointerEvents === 'none'
    || (typeof getComputedStyle === 'function' && getComputedStyle(host).pointerEvents === 'none')
  if (!passThrough) {
    return host
  }
  const parent = host.parentElement
  if (!parent || parent === document.body || parent === document.documentElement) {
    return host
  }
  return parent
}

function sourcesEqual(left: readonly string[], right: readonly string[]): boolean {
  return left === right
    || (left.length === right.length && left.every((src, index) => src === right[index]))
}

function layoutInputsEqual(a: IResolvedMountOptions, b: IResolvedMountOptions): boolean {
  return sourcesEqual(a.images, b.images)
    && a.speedRange?.[0] === b.speedRange?.[0]
    && a.speedRange?.[1] === b.speedRange?.[1]
    && a.angle === b.angle
    && a.tileWidth === b.tileWidth
    && a.tileAspectRatio === b.tileAspectRatio
    && a.gap === b.gap
    && a.overlayOpacity === b.overlayOpacity
    && a.overlayColor === b.overlayColor
    && a.imageOrder === b.imageOrder
    && a.motionAxis === b.motionAxis
    && a.tileFit === b.tileFit
    && a.gapColor === b.gapColor
    && a.gapOpacity === b.gapOpacity
    && aspectsEqual(a.imageAspects, b.imageAspects)
}

function aspectsEqual(
  left: readonly number[] | undefined,
  right: readonly number[] | undefined,
): boolean {
  if (left === right) {
    return true
  }
  if (!left || !right || left.length !== right.length) {
    return false
  }
  return left.every((value, index) => value === right[index])
}

function cssRgba(hex: string, opacity: number): string {
  const red = Number.parseInt(hex.slice(1, 3), 16)
  const green = Number.parseInt(hex.slice(3, 5), 16)
  const blue = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

function needsImageAspects(fit: IImagesInMotionOptions['tileFit']): boolean {
  return fit === 'auto' || fit === 'static' || fit === 'dynamic'
}

function createTrack(
  lane: IImagesInMotionLayout['lanes'][number],
  layout: IImagesInMotionLayout,
  images: readonly string[],
  bindSource: (img: HTMLImageElement, src: string) => void,
): HTMLDivElement {
  const track = document.createElement('div')
  const horizontal = layout.motionAxis === 'horizontal'
  track.className = horizontal ? 'iim-track is-horizontal' : 'iim-track'
  track.style.left = `${lane.left}px`
  track.style.top = `${lane.top}px`
  const first = lane.sizes[0]
  if (horizontal) {
    track.style.width = `${lane.cycleHeight * 2}px`
    track.style.height = `${first?.height ?? layout.tileHeight}px`
  } else {
    track.style.width = `${first?.width ?? layout.tileWidth}px`
    track.style.height = `${lane.cycleHeight * 2}px`
  }
  track.style.setProperty('--iim-cycle', `${-lane.cycleHeight}px`)
  track.style.animationDuration = `${lane.durationMs}ms`
  track.style.animationDelay = `${lane.delayMs}ms`
  track.style.animationDirection = lane.reverse ? 'reverse' : 'normal'

  for (let copy = 0; copy < 2; copy += 1) {
    for (const [slot, index] of lane.imageIndices.entries()) {
      const image = images[index]
      if (!image) {
        continue
      }
      const box = lane.sizes[slot]
      const img = document.createElement('img')
      img.className = 'iim-tile'
      img.alt = ''
      img.draggable = false
      img.setAttribute('aria-hidden', 'true')
      img.style.width = `${box?.width ?? layout.tileWidth}px`
      img.style.height = `${box?.height ?? layout.tileHeight}px`
      img.style.objectFit = layout.objectFit
      if (horizontal) {
        img.style.marginRight = `${layout.gap}px`
      } else {
        img.style.marginBottom = `${layout.gap}px`
      }
      bindSource(img, image)
      track.append(img)
    }
  }

  return track
}

function collectTrackAnimations(sheet: HTMLElement): Animation[] {
  const animations: Animation[] = []
  for (const track of sheet.children) {
    if (!(track instanceof HTMLElement) || typeof track.getAnimations !== 'function') {
      continue
    }
    animations.push(...track.getAnimations())
  }
  return animations
}

function readPlaybackRate(animation: Animation): number {
  if (animation.playState === 'paused') {
    return 0
  }
  return animation.playbackRate
}

/** Mounts the decorative pattern into `host`. The host must have a measurable size. */
export function mountImagesInMotion(
  host: HTMLElement,
  options: IImagesInMotionMountOptions,
): IImagesInMotionHandle {
  ensureImagesInMotionStyle()

  const computed = getComputedStyle(host)
  if (computed.position === 'static') {
    host.style.position = 'relative'
  }
  host.style.overflow = 'hidden'
  host.style.backgroundColor = 'transparent'

  const decoration = document.createElement('div')
  decoration.className = 'iim-decoration'
  decoration.setAttribute('aria-hidden', 'true')
  const sheet = document.createElement('div')
  sheet.className = 'iim-sheet'
  const overlay = document.createElement('div')
  overlay.className = 'iim-overlay'
  overlay.hidden = true
  decoration.append(sheet, overlay)
  host.prepend(decoration)

  let current: IResolvedMountOptions = {
    images: options.images,
    paused: options.paused ?? false,
    stopOnHover: options.stopOnHover ?? false,
    animateOnHover: options.animateOnHover ?? false,
    speedRange: options.speedRange,
    angle: options.angle,
    tileWidth: options.tileWidth,
    tileAspectRatio: options.tileAspectRatio,
    gap: options.gap,
    overlayOpacity: options.overlayOpacity,
    overlayColor: options.overlayColor,
    imageOrder: options.imageOrder,
    motionAxis: options.motionAxis,
    tileFit: options.tileFit,
    imageAspects: options.imageAspects,
    gapColor: options.gapColor,
    gapOpacity: options.gapOpacity,
  }
  let layout = createImagesInMotionLayout(0, 0, 0)
  let size = { width: 0, height: 0 }
  const prepared = new Map<string, string>()
  const created = new Set<string>()
  const inflight = new Map<string, Promise<string>>()

  function bindSource(img: HTMLImageElement, src: string): void {
    img.dataset.iimSrc = src
    const cached = prepared.get(src)
    if (cached) {
      img.src = cached
      return
    }
    img.src = src
    if (!shouldPrepareImageSource(src)) {
      prepared.set(src, src)
      return
    }
    let pending = inflight.get(src)
    if (!pending) {
      pending = prepareImageSource(src).then((resolved) => {
        prepared.set(src, resolved)
        if (resolved !== src) {
          created.add(resolved)
        }
        inflight.delete(src)
        return resolved
      })
      inflight.set(src, pending)
    }
    void pending.then((resolved) => {
      if (img.isConnected && img.dataset.iimSrc === src) {
        img.src = resolved
      }
    })
  }

  let hovering = false
  let rampFrame = 0

  function cancelPlaybackRamp(): void {
    if (rampFrame !== 0) {
      cancelAnimationFrame(rampFrame)
      rampFrame = 0
    }
  }

  function setTrackPlayState(running: boolean): void {
    for (const track of sheet.children) {
      if (track instanceof HTMLElement) {
        track.style.animationPlayState = running ? 'running' : 'paused'
      }
    }
  }

  function applyPlayback(running: boolean): void {
    cancelPlaybackRamp()
    setTrackPlayState(running)
    for (const animation of collectTrackAnimations(sheet)) {
      animation.playbackRate = running ? 1 : 0
      if (running) {
        if (animation.playState === 'paused') {
          animation.play()
        }
      } else if (animation.playState !== 'paused') {
        animation.pause()
      }
    }
  }

  function rampPlayback(running: boolean): void {
    const animations = collectTrackAnimations(sheet)
    if (animations.length === 0) {
      applyPlayback(running)
      return
    }
    const from = readPlaybackRate(animations[0]!)
    const to = running ? 1 : 0
    if (Math.abs(from - to) < 0.001) {
      applyPlayback(running)
      return
    }
    cancelPlaybackRamp()
    setTrackPlayState(true)
    for (const animation of animations) {
      animation.playbackRate = from
      if (animation.playState === 'paused') {
        animation.play()
      }
    }
    const started = performance.now()
    const tick = (now: number) => {
      const t = playbackRampT(now - started, EImagesInMotionPlaybackRampMs)
      const rate = playbackRampRate(from, to, t)
      const live = collectTrackAnimations(sheet)
      for (const animation of live) {
        animation.playbackRate = rate
      }
      if (!playbackRampFinished(t)) {
        rampFrame = requestAnimationFrame(tick)
        return
      }
      rampFrame = 0
      applyPlayback(running)
    }
    rampFrame = requestAnimationFrame(tick)
  }

  function syncPlayback(mode: 'ramp' | 'snap' = 'ramp'): void {
    const hoverPlayback = resolveHoverPlayback(current.stopOnHover, current.animateOnHover)
    const running = shouldRunAnimation(current.paused, hoverPlayback, hovering)
    const snap = mode === 'snap' || prefersReducedMotion() || !isDocumentVisible()
    if (snap) {
      applyPlayback(running)
      return
    }
    rampPlayback(running)
  }

  function onPointerEnter(): void {
    hovering = true
    syncPlayback()
  }

  function onPointerLeave(): void {
    hovering = false
    syncPlayback()
  }

  function render(): void {
    layout = createImagesInMotionLayout(size.width, size.height, current.images.length, current)
    sheet.style.left = `${layout.left}px`
    sheet.style.top = `${layout.top}px`
    sheet.style.width = `${layout.width}px`
    sheet.style.height = `${layout.height}px`
    sheet.style.transform = `rotate(${layout.angle}deg)`
    sheet.style.backgroundColor = cssRgba(layout.gapColor, layout.gapOpacity)
    sheet.replaceChildren(...layout.lanes.map((lane) => createTrack(lane, layout, current.images, bindSource)))
    void refreshAspects()
    if (layout.overlayOpacity === undefined) {
      overlay.hidden = true
      overlay.style.opacity = ''
      overlay.style.backgroundColor = ''
    } else {
      overlay.hidden = false
      overlay.style.opacity = String(layout.overlayOpacity)
      overlay.style.backgroundColor = layout.overlayColor ?? '#000000'
    }
    syncPlayback('snap')
  }

  function measureAndRender(width: number, height: number): void {
    if (width === size.width && height === size.height && sheet.childElementCount > 0) {
      return
    }
    if (width === size.width && height === size.height && current.images.length === 0) {
      return
    }
    size = { width, height }
    render()
  }

  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (!entry) {
      return
    }
    const width = entry.contentRect.width
    const height = entry.contentRect.height
    if ((!width || !height) && (size.width || size.height)) {
      return
    }
    measureAndRender(width, height)
  })
  resizeObserver.observe(host)

  const rect = host.getBoundingClientRect()
  measureAndRender(rect.width, rect.height)

  async function refreshAspects(): Promise<void> {
    if (!needsImageAspects(current.tileFit) || current.images.length === 0) {
      return
    }
    const measured = await measureImageAspects(current.images)
    const next = measured.map((value) => value ?? 0)
    if (next.every((value) => value <= 0) || aspectsEqual(current.imageAspects, next)) {
      return
    }
    current = { ...current, imageAspects: next }
    render()
  }

  const pointerRoot = hoverTarget(host)
  pointerRoot.addEventListener('pointerenter', onPointerEnter)
  pointerRoot.addEventListener('pointerleave', onPointerLeave)

  const stopMotion = subscribeReducedMotion(() => syncPlayback('snap'))
  const stopVisibility = subscribeVisibility(() => syncPlayback('snap'))

  return {
    update(patch) {
      const next = resolveOptions(current, patch)
      const layoutChanged = !layoutInputsEqual(current, next)
      current = next
      if (layoutChanged) {
        render()
        return
      }
      syncPlayback()
    },
    destroy() {
      cancelPlaybackRamp()
      resizeObserver.disconnect()
      pointerRoot.removeEventListener('pointerenter', onPointerEnter)
      pointerRoot.removeEventListener('pointerleave', onPointerLeave)
      stopMotion()
      stopVisibility()
      decoration.remove()
      for (const url of created) {
        URL.revokeObjectURL(url)
      }
      created.clear()
      prepared.clear()
      inflight.clear()
    },
    getLayout() {
      return layout
    },
  }
}
