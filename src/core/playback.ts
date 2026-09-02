const EReducedMotionQuery = '(prefers-reduced-motion: reduce)'

export type TImagesInMotionHoverPlayback = 'always' | 'stop' | 'animate'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true
  }
  return window.matchMedia(EReducedMotionQuery).matches
}

export function subscribeReducedMotion(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }
  const query = window.matchMedia(EReducedMotionQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export function isDocumentVisible(): boolean {
  if (typeof document === 'undefined') {
    return false
  }
  return document.visibilityState !== 'hidden'
}

export function subscribeVisibility(onChange: () => void): () => void {
  if (typeof document === 'undefined') {
    return () => {}
  }
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

/** Both flags set cancel each other and keep continuous motion. */
export function resolveHoverPlayback(
  stopOnHover = false,
  animateOnHover = false,
): TImagesInMotionHoverPlayback {
  if (stopOnHover === animateOnHover) {
    return 'always'
  }
  return animateOnHover ? 'animate' : 'stop'
}

export function shouldRunAnimation(
  paused: boolean,
  hoverPlayback: TImagesInMotionHoverPlayback = 'always',
  hovering = false,
): boolean {
  if (paused || prefersReducedMotion() || !isDocumentVisible()) {
    return false
  }
  if (hoverPlayback === 'stop') {
    return !hovering
  }
  if (hoverPlayback === 'animate') {
    return hovering
  }
  return true
}
