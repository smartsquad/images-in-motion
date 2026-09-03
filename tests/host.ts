import { vi } from 'vitest'

export const ETestImages = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg'] as const

/** Same mount fields used as individual props or as a spread `iimOptions` constant. */
export const ETestIimOptions = {
  images: [...ETestImages],
  speedRange: [8, 18] as [number, number],
  angle: 12,
  tileWidth: 168,
}

function collectAncestors(start: HTMLElement): HTMLElement[] {
  const chain: HTMLElement[] = [start]
  for (let node = start.parentElement; node; node = node.parentElement) {
    chain.push(node)
  }
  return chain
}

function asDomRect(width: number, height: number): DOMRect {
  return {
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
  } as DOMRect
}

export function mockHostSize(width = 480, height = 640) {
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(asDomRect(width, height))
}

/**
 * Parent `width` plus `aspect-ratio` has a used box. Hosts with `100%` / `100%`,
 * or `position: absolute; inset: 0`, inherit that box. Anything else is 0×0.
 */
export function mockParentAspectFill(width = 480, ratio = '3 / 4') {
  const [aspectWidth, aspectHeight] = ratio.split('/').map((part) => Number(part.trim()))
  const height = width * (aspectHeight! / aspectWidth!)
  const current = HTMLElement.prototype.getBoundingClientRect
  if (vi.isMockFunction(current)) {
    current.mockRestore()
  }
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const chain = collectAncestors(this)
    const sized = chain.find((el) => el.style.width === `${width}px` && el.style.aspectRatio)
    if (!sized) {
      return asDomRect(0, 0)
    }
    if (sized === this) {
      return asDomRect(width, height)
    }
    const between = chain.slice(0, chain.indexOf(sized))
    if (between.some((el) => el.style.width === '100%' && el.style.height === '100%')) {
      return asDomRect(width, height)
    }
    return asDomRect(0, 0)
  })
}

export function cleanupMotionDom(): void {
  document.body.replaceChildren()
  document.getElementById('images-in-motion-style')?.remove()
}
