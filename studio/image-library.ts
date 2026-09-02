export function clampImageCount(count: number, length: number): number {
  if (!Number.isFinite(count) || length <= 0) {
    return 0
  }
  return Math.max(0, Math.min(length, Math.round(count)))
}

export function removeSourceAt(sources: readonly string[], index: number): string[] {
  return sources.filter((_, current) => current !== index)
}

export function appendSources(sources: readonly string[], added: readonly string[]): string[] {
  return [...sources, ...added]
}
