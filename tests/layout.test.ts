import { describe, expect, it } from 'vitest'
import { createImagesInMotionLayout } from '../src/core'

const EViewportSizes = [
  [320, 700],
  [1440, 280],
  [80, 900],
  [900, 80],
  [1, 1],
] as const
const EAngles = [-90, -45, -12, 0, 12, 45, 90, 180]

describe('createImagesInMotionLayout', () => {
  it('covers inverse-rotated viewport corners, including extreme aspect ratios', () => {
    for (const [width, height] of EViewportSizes) {
      for (const angle of EAngles) {
        const layout = createImagesInMotionLayout(width, height, 13, { angle })
        const radians = -angle * Math.PI / 180

        expect(layout.left + layout.width / 2).toBeCloseTo(width / 2)
        expect(layout.top + layout.height / 2).toBeCloseTo(height / 2)

        for (const x of [-width / 2, width / 2]) {
          for (const y of [-height / 2, height / 2]) {
            const localX = x * Math.cos(radians) - y * Math.sin(radians)
            const localY = x * Math.sin(radians) + y * Math.cos(radians)
            expect(layout.width / 2 - Math.abs(localX)).toBeGreaterThanOrEqual(1.999999)
            expect(layout.height / 2 - Math.abs(localY)).toBeGreaterThanOrEqual(1.999999)
          }
        }

        expect(layout.lanes[0]!.left).toBeLessThanOrEqual(0)
        expect(layout.lanes.at(-1)!.left + layout.tileWidth).toBeGreaterThanOrEqual(
          layout.width - 0.000001,
        )
      }
    }
  })

  it('keeps two track copies over the full sheet at every animation phase', () => {
    for (const [width, height] of EViewportSizes) {
      for (const count of [1, 2, 13, 97]) {
        const layout = createImagesInMotionLayout(width, height, count)

        for (const lane of layout.lanes) {
          expect(lane.cycleHeight).toBeGreaterThanOrEqual(layout.height)
          expect(lane.cycleHeight).toBe(
            lane.imageIndices.length * (layout.tileHeight + layout.gap),
          )

          for (const phase of [0, 0.001, 0.25, 0.5, 0.999, 1]) {
            const offset = -lane.cycleHeight * phase
            expect(offset).toBeLessThanOrEqual(0)
            expect(offset + 2 * lane.cycleHeight).toBeGreaterThanOrEqual(layout.height)
          }

          const finalTileBottom = lane.cycleHeight - layout.gap
          const secondCopyTop = lane.cycleHeight
          expect(secondCopyTop - finalTileBottom).toBeCloseTo(layout.gap)
          expect(lane.imageIndices[0]).toBeDefined()
        }
      }
    }
  })

  it('keeps each image in the pattern without making tiles depend on the image count', () => {
    for (const count of [1, 2, 13, 97]) {
      const layout = createImagesInMotionLayout(900, 520, count)
      const imageIndices = layout.lanes.flatMap((lane) => lane.imageIndices)
      expect(new Set(imageIndices)).toEqual(new Set(Array.from({ length: count }, (_, i) => i)))
      expect(layout.tileWidth).toBe(220)
      expect(layout.tileHeight).toBe(330)
      expect(imageIndices.every((index) => Number.isInteger(index) && index >= 0 && index < count))
        .toBe(true)
    }
  })

  it('shows the same images and gaps on both sides of a repeat boundary', () => {
    const layout = createImagesInMotionLayout(900, 520, 13, { tileWidth: 127, gap: 7 })
    const stride = layout.tileHeight + layout.gap

    for (const lane of layout.lanes) {
      const tiles = [...lane.imageIndices, ...lane.imageIndices]
      const sample = (position: number) => {
        const row = Math.floor(position / stride)
        const offset = position - row * stride
        return offset >= layout.tileHeight ? 'gap' : tiles[row]
      }

      for (let row = 0; row < lane.imageIndices.length; row++) {
        for (const withinTile of [0.01, layout.tileHeight / 2, layout.tileHeight + 0.01]) {
          const position = row * stride + withinTile
          expect(sample(position)).toBe(sample(position + lane.cycleHeight))
        }
      }
    }
  })

  it('uses shifted input sequences when there are fewer images than lanes', () => {
    const layout = createImagesInMotionLayout(900, 520, 2)
    expect(layout.lanes.length).toBeGreaterThan(2)
    expect(layout.lanes.slice(0, 3).map((lane) => lane.imageIndices[0])).toEqual([0, 1, 0])
    expect(layout.lanes[0]!.imageIndices.slice(0, 2)).toEqual([0, 1])
    expect(layout.lanes[1]!.imageIndices.slice(0, 2)).toEqual([1, 0])
  })

  it('returns no lanes for empty input or an unmeasured viewport', () => {
    for (const count of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(createImagesInMotionLayout(300, 600, count).lanes).toEqual([])
    }
    for (const size of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(createImagesInMotionLayout(size, 600, 4).lanes).toEqual([])
      expect(createImagesInMotionLayout(300, size, 4).lanes).toEqual([])
    }
  })

  it('avoids single-image stripes when enough distinct inputs exist', () => {
    for (const count of [2, 4, 6, 13, 97]) {
      const layout = createImagesInMotionLayout(480, 640, count, { tileWidth: 168 })
      expect(layout.lanes.every((lane) => new Set(lane.imageIndices).size >= 2)).toBe(true)
    }
  })

  it('provides stable distinct slow velocities and alternating directions', () => {
    const first = createImagesInMotionLayout(1280, 720, 12)
    const repeated = createImagesInMotionLayout(1280, 720, 12)
    const resized = createImagesInMotionLayout(1280, 1000, 12)
    expect(repeated).toEqual(first)

    first.lanes.forEach((lane, index) => {
      const speed = lane.cycleHeight / lane.durationMs * 1000
      const resizedLane = resized.lanes[index]!
      expect(speed).toBeGreaterThanOrEqual(8)
      expect(speed).toBeLessThanOrEqual(18)
      expect(resizedLane.cycleHeight / resizedLane.durationMs * 1000).toBeCloseTo(speed)
      expect(lane.reverse).toBe(index % 2 === 1)
      expect(lane.delayMs).toBeLessThanOrEqual(0)
      expect(lane.delayMs).toBeGreaterThan(-lane.durationMs)
      if (index > 0) {
        const preceding = first.lanes[index - 1]!
        expect(speed).not.toBeCloseTo(preceding.cycleHeight / preceding.durationMs * 1000)
      }
    })
  })

  it('sorts speed endpoints and allows a fixed speed', () => {
    const forward = createImagesInMotionLayout(400, 700, 6, { speedRange: [5, 12] })
    const reversed = createImagesInMotionLayout(400, 700, 6, { speedRange: [12, 5] })
    expect(reversed).toEqual(forward)

    const fixed = createImagesInMotionLayout(400, 700, 6, { speedRange: [9, 9] })
    for (const lane of fixed.lanes) {
      expect(lane.cycleHeight / lane.durationMs * 1000).toBeCloseTo(9)
    }
  })

  it('sanitizes invalid options to finite geometry and usable durations', () => {
    const fallback = createImagesInMotionLayout(400, 700, 6)
    const invalid = createImagesInMotionLayout(400, 700, 6, {
      tileWidth: Number.NaN,
      tileAspectRatio: 0,
      gap: Number.POSITIVE_INFINITY,
      angle: Number.NEGATIVE_INFINITY,
      speedRange: [0, -2],
    })
    expect(invalid).toEqual(fallback)
    expect(createImagesInMotionLayout(400, 700, 6, { gap: -10 }).gap).toBe(0)
    expect(createImagesInMotionLayout(400, 700, 6, { angle: 372 }).angle).toBe(12)
    expect(createImagesInMotionLayout(400, 700, 6, { angle: -372 }).angle).toBe(-12)
  })

  it('distinguishes an omitted overlay from zero and clamps its opacity', () => {
    expect(createImagesInMotionLayout(400, 700, 6).overlayOpacity).toBeUndefined()
    expect(createImagesInMotionLayout(400, 700, 6, { overlayOpacity: 0 }).overlayOpacity).toBe(0)
    expect(createImagesInMotionLayout(400, 700, 6, { overlayOpacity: 0.45 }).overlayOpacity).toBe(0.45)
    expect(createImagesInMotionLayout(400, 700, 6, { overlayOpacity: -1 }).overlayOpacity).toBe(0)
    expect(createImagesInMotionLayout(400, 700, 6, { overlayOpacity: 2 }).overlayOpacity).toBe(1)
    expect(createImagesInMotionLayout(400, 700, 6, { overlayOpacity: Number.NaN }).overlayOpacity)
      .toBe(0)
  })

  it('sanitizes overlay color and omits it when the overlay is off', () => {
    expect(createImagesInMotionLayout(400, 700, 6).overlayColor).toBeUndefined()
    expect(createImagesInMotionLayout(400, 700, 6, { overlayOpacity: 0.4 }).overlayColor)
      .toBe('#000000')
    expect(createImagesInMotionLayout(400, 700, 6, {
      overlayOpacity: 0.4,
      overlayColor: '#abc',
    }).overlayColor).toBe('#aabbcc')
    expect(createImagesInMotionLayout(400, 700, 6, {
      overlayOpacity: 0.4,
      overlayColor: '#1A2B3C',
    }).overlayColor).toBe('#1a2b3c')
    expect(createImagesInMotionLayout(400, 700, 6, {
      overlayOpacity: 0.4,
      overlayColor: 'red',
    }).overlayColor).toBe('#000000')
  })

  it('keeps sequential tile assignment by default', () => {
    const layout = createImagesInMotionLayout(900, 520, 2)
    expect(layout.lanes.slice(0, 3).map((lane) => lane.imageIndices[0])).toEqual([0, 1, 0])
    expect(layout.lanes[0]!.imageIndices.slice(0, 2)).toEqual([0, 1])
  })

  it('applies a stable shuffled assignment when image order is random', () => {
    const sequential = createImagesInMotionLayout(900, 520, 6)
    const random = createImagesInMotionLayout(900, 520, 6, { imageOrder: 'random' })
    const again = createImagesInMotionLayout(900, 520, 6, { imageOrder: 'random' })
    const taller = createImagesInMotionLayout(900, 800, 6, { imageOrder: 'random' })

    expect(random.lanes.map((lane) => lane.imageIndices)).not.toEqual(
      sequential.lanes.map((lane) => lane.imageIndices),
    )
    expect(again.lanes.map((lane) => lane.imageIndices)).toEqual(
      random.lanes.map((lane) => lane.imageIndices),
    )
    expect(taller.lanes.map((lane) => lane.imageIndices[0])).toEqual(
      random.lanes.map((lane) => lane.imageIndices[0]),
    )
    expect(new Set(random.lanes.flatMap((lane) => lane.imageIndices))).toEqual(
      new Set(Array.from({ length: 6 }, (_, index) => index)),
    )
  })

  it('defaults to vertical columns and lays out horizontal rows', () => {
    const vertical = createImagesInMotionLayout(900, 520, 6, { tileWidth: 127, gap: 7 })
    const horizontal = createImagesInMotionLayout(900, 520, 6, {
      tileWidth: 127,
      gap: 7,
      motionAxis: 'horizontal',
    })

    expect(vertical.motionAxis).toBe('vertical')
    expect(horizontal.motionAxis).toBe('horizontal')
    expect(vertical.angle).toBe(horizontal.angle)
    expect(vertical.lanes[0]!.top).toBe(0)
    expect(horizontal.lanes[0]!.left).toBe(0)
    expect(horizontal.lanes[0]!.top).toBeLessThanOrEqual(0)
    expect(horizontal.lanes.at(-1)!.top + horizontal.tileHeight)
      .toBeGreaterThanOrEqual(horizontal.height - 0.000001)

    for (const lane of horizontal.lanes) {
      expect(lane.cycleHeight).toBeGreaterThanOrEqual(horizontal.width)
      expect(lane.cycleHeight).toBe(lane.imageIndices.length * (horizontal.tileWidth + horizontal.gap))
      expect(lane.left).toBe(0)
    }
  })

  it('keeps two horizontal copies over the full sheet at every animation phase', () => {
    const layout = createImagesInMotionLayout(900, 520, 13, {
      tileWidth: 127,
      gap: 7,
      motionAxis: 'horizontal',
    })
    const stride = layout.tileWidth + layout.gap

    for (const lane of layout.lanes) {
      expect(lane.cycleHeight).toBeGreaterThanOrEqual(layout.width)
      for (const phase of [0, 0.001, 0.25, 0.5, 0.999, 1]) {
        const offset = -lane.cycleHeight * phase
        expect(offset).toBeLessThanOrEqual(0)
        expect(offset + 2 * lane.cycleHeight).toBeGreaterThanOrEqual(layout.width)
      }

      const tiles = [...lane.imageIndices, ...lane.imageIndices]
      const sample = (position: number) => {
        const column = Math.floor(position / stride)
        const offset = position - column * stride
        return offset >= layout.tileWidth ? 'gap' : tiles[column]
      }
      for (let column = 0; column < lane.imageIndices.length; column += 1) {
        for (const withinTile of [0.01, layout.tileWidth / 2, layout.tileWidth + 0.01]) {
          const position = column * stride + withinTile
          expect(sample(position)).toBe(sample(position + lane.cycleHeight))
        }
      }
    }
  })

  it('sizes tiles by fit mode using image aspects', () => {
    const aspects = [0.5, 1, 2]
    const auto = createImagesInMotionLayout(400, 700, 3, {
      tileWidth: 100,
      tileFit: 'auto',
      imageAspects: aspects,
    })
    const staticFit = createImagesInMotionLayout(400, 700, 3, {
      tileWidth: 100,
      tileFit: 'static',
      imageAspects: aspects,
    })
    const dynamic = createImagesInMotionLayout(400, 700, 3, {
      tileWidth: 100,
      tileFit: 'dynamic',
      imageAspects: aspects,
    })
    const fixed = createImagesInMotionLayout(400, 700, 3, {
      tileWidth: 100,
      tileAspectRatio: 0.5,
      tileFit: 'fixed',
    })

    expect(auto.tileFit).toBe('auto')
    expect(auto.objectFit).toBe('cover')
    expect(auto.lanes[0]!.sizes[0]).toEqual({ width: 100, height: 200 })
    expect(new Set(auto.lanes[0]!.sizes.map((size) => size.height)).size).toBeGreaterThan(1)
    expect(staticFit.lanes[0]!.sizes.every((size) => size.width === 100 && size.height === 200)).toBe(true)
    expect(dynamic.objectFit).toBe('fill')
    expect(dynamic.lanes[0]!.sizes.every((size) => size.width === 100 && size.height === 200)).toBe(true)
    expect(fixed.objectFit).toBe('cover')
    expect(fixed.lanes[0]!.sizes.every((size) => size.width === 100 && size.height === 200)).toBe(true)
  })

  it('stores gap color and clamps gap opacity', () => {
    expect(createImagesInMotionLayout(400, 700, 6).gapColor).toBe('#000000')
    expect(createImagesInMotionLayout(400, 700, 6).gapOpacity).toBe(1)
    expect(createImagesInMotionLayout(400, 700, 6, { gapColor: '#abc', gapOpacity: 0 }).gapColor)
      .toBe('#aabbcc')
    expect(createImagesInMotionLayout(400, 700, 6, { gapOpacity: 0 }).gapOpacity).toBe(0)
    expect(createImagesInMotionLayout(400, 700, 6, { gapOpacity: 2 }).gapOpacity).toBe(1)
    expect(createImagesInMotionLayout(400, 700, 6, { gapColor: 'red' }).gapColor).toBe('#000000')
  })

  it('bounds extreme finite options before they can overflow allocation or timing', () => {
    const layout = createImagesInMotionLayout(400, 700, 6, {
      tileWidth: Number.MIN_VALUE,
      tileAspectRatio: Number.MAX_VALUE,
      gap: Number.MAX_VALUE,
      speedRange: [Number.MIN_VALUE, Number.MAX_VALUE],
    })
    expect(layout.lanes.length).toBeGreaterThan(0)
    for (const lane of layout.lanes) {
      expect(Number.isFinite(lane.cycleHeight)).toBe(true)
      expect(Number.isFinite(lane.durationMs)).toBe(true)
      expect(lane.durationMs).toBeGreaterThan(0)
      expect(Number.isFinite(lane.delayMs)).toBe(true)
      expect(lane.cycleHeight).toBeGreaterThanOrEqual(layout.height)
    }
  })
})
