/** Numbers become px. Strings pass through (`30rem`, `100%`, `480px`). */
export function cssBoxSize(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}px`
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') {
      return undefined
    }
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return `${trimmed}px`
    }
    return trimmed
  }
  return undefined
}

export function readHostBox(host: HTMLElement): { width: number, height: number } {
  const box = host.getBoundingClientRect()
  return { width: box.width, height: box.height }
}
