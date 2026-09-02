import { describe, expect, it } from 'vitest'
import { previewCornerRadiusCss } from '../studio/preview-frame'

describe('previewCornerRadiusCss', () => {
  it('is zero when the slider is zero', () => {
    expect(previewCornerRadiusCss(0, 480, 640)).toBe('0')
  })

  it('keeps a single percentage on a square, so the 100% control is a circle', () => {
    expect(previewCornerRadiusCss(20, 600, 600)).toBe('20%')
    expect(previewCornerRadiusCss(100, 600, 600)).toBe('100%')
  })

  it('uses matching pixel radii on a portrait box', () => {
    expect(previewCornerRadiusCss(20, 480, 640)).toBe('20% / 15%')
    const rx = 480 * 0.2
    const ry = 640 * 0.15
    expect(rx).toBeCloseTo(ry)
  })

  it('uses matching pixel radii on a landscape box', () => {
    const [rx, ry] = previewCornerRadiusCss(20, 760, 460).split('/').map((part) => Number.parseFloat(part))
    expect(rx).toBeDefined()
    expect(ry).toBeDefined()
    expect(760 * rx! / 100).toBeCloseTo(460 * ry! / 100)
  })
})
