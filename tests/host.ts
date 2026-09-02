import { vi } from 'vitest'

export const ETestImages = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg'] as const

/** Same mount fields used as individual props or as a spread `iimOptions` constant. */
export const ETestIimOptions = {
  images: [...ETestImages],
  speedRange: [8, 18] as [number, number],
  angle: 12,
  tileWidth: 168,
}

export function mockHostSize(width = 480, height = 640) {
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width,
    height,
    top: 0,
    left: 0,
    bottom: height,
    right: width,
    x: 0,
    y: 0,
    toJSON() {
      return {}
    },
  } as DOMRect)
}

export function cleanupMotionDom(): void {
  document.body.replaceChildren()
  document.getElementById('images-in-motion-style')?.remove()
}
