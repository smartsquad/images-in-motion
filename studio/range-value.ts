export function stepDecimalPlaces(step: number): number {
  const text = String(step)
  const scientific = /e-(\d+)$/i.exec(text)
  if (scientific) {
    return Number(scientific[1])
  }
  const dot = text.indexOf('.')
  return dot === -1 ? 0 : text.length - dot - 1
}

export function formatRangeValue(value: number, step = 1): string {
  return String(Number(value.toFixed(stepDecimalPlaces(step))))
}

export function snapRangeValue(value: number, min: number, max: number, step = 1): number {
  const clamped = Math.min(max, Math.max(min, value))
  const snapped = min + Math.round((clamped - min) / step) * step
  return Math.min(max, Math.max(min, Number(snapped.toFixed(stepDecimalPlaces(step)))))
}

export function parseRangeValue(raw: string, min: number, max: number, step = 1): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') {
    return null
  }
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) {
    return null
  }
  return snapRangeValue(parsed, min, max, step)
}
