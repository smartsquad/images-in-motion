/** Pause and resume ease. Scroll stays on CSS keyframes. Only the rate ramps. */
export const EImagesInMotionPlaybackRampMs = 520

export function playbackRampT(elapsedMs: number, durationMs: number): number {
  if (durationMs <= 0) {
    return 1
  }
  return Math.min(1, Math.max(0, elapsedMs / durationMs))
}

export function playbackRampRate(from: number, to: number, t: number): number {
  const eased = t < 0.5 ? 4 * t * t * t : 1 - (((-2 * t) + 2) ** 3) / 2
  return from + (to - from) * eased
}

export function playbackRampFinished(t: number): boolean {
  return t >= 1
}
