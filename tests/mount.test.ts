import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountImagesInMotion } from '../src/js/mount'

function sizedHost(width = 480, height = 640): HTMLDivElement {
  const host = document.createElement('div')
  host.style.width = `${width}px`
  host.style.height = `${height}px`
  Object.defineProperty(host, 'getBoundingClientRect', {
    value: () => ({
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
    }),
  })
  document.body.append(host)
  return host
}

const EImages = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg']

describe('mountImagesInMotion', () => {
  afterEach(() => {
    document.body.replaceChildren()
    document.getElementById('images-in-motion-style')?.remove()
  })

  it('renders alternating tracks with two copies of each cycle', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages, tileWidth: 168, gap: 4 })
    const layout = handle.getLayout()
    const tracks = [...host.querySelectorAll<HTMLElement>('.iim-track')]

    expect(layout.lanes.length).toBeGreaterThan(0)
    expect(tracks).toHaveLength(layout.lanes.length)
    expect(layout.lanes[0]!.reverse).toBe(false)
    expect(layout.lanes[1]!.reverse).toBe(true)
    expect(tracks[1]!.style.animationDirection).toBe('reverse')

    const first = layout.lanes[0]!
    expect(host.querySelectorAll('.iim-tile').length).toBeGreaterThan(0)
    expect(tracks[0]!.querySelectorAll('img')).toHaveLength(first.imageIndices.length * 2)
    handle.destroy()
  })

  it('pauses without rebuilding tracks, then resumes', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages, paused: false })
    const firstTrack = host.querySelector('.iim-track')
    expect(firstTrack).toBeTruthy()

    handle.update({ paused: true })
    expect(host.querySelector('.iim-track')).toBe(firstTrack)
    expect((firstTrack as HTMLElement).style.animationPlayState).toBe('paused')

    handle.update({ paused: false })
    expect((firstTrack as HTMLElement).style.animationPlayState).toBe('running')
    handle.destroy()
  })

  it('omits the overlay until opacity is set, including an explicit zero', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages })
    const overlay = host.querySelector('.iim-overlay') as HTMLDivElement
    expect(overlay.hidden).toBe(true)

    handle.update({ overlayOpacity: 0 })
    expect(overlay.hidden).toBe(false)
    expect(overlay.style.opacity).toBe('0')
    expect(overlay.style.backgroundColor).toBe('#000000')

    handle.update({ overlayOpacity: 0.4, overlayColor: '#cc3344' })
    expect(overlay.style.opacity).toBe('0.4')
    expect(overlay.style.backgroundColor).toBe('#cc3344')

    handle.update({ gapColor: '#336699', gapOpacity: 0.5 })
    const sheet = host.querySelector('.iim-sheet') as HTMLDivElement
    expect(sheet.style.backgroundColor).toBe('rgba(51, 102, 153, 0.5)')
    handle.destroy()
  })

  it('keeps the host and a zero-opacity gap transparent so the parent shows through', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages, gapOpacity: 0 })
    const sheet = host.querySelector('.iim-sheet') as HTMLDivElement
    const injected = document.getElementById('images-in-motion-style')?.textContent ?? ''

    expect(host.style.backgroundColor).toBe('transparent')
    expect(sheet.style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(injected).toMatch(/images-in-motion \{[^}]*background: transparent/)
    handle.destroy()
  })

  it('builds horizontal rows that scroll on the X axis', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, {
      images: EImages,
      tileWidth: 168,
      gap: 4,
      motionAxis: 'horizontal',
    })
    const layout = handle.getLayout()
    const tracks = [...host.querySelectorAll<HTMLElement>('.iim-track')]

    expect(layout.motionAxis).toBe('horizontal')
    expect(tracks.length).toBe(layout.lanes.length)
    expect(tracks.every((track) => track.classList.contains('is-horizontal'))).toBe(true)
    expect(tracks[1]!.style.animationDirection).toBe('reverse')
    expect(tracks[0]!.style.height).toBe(`${layout.tileHeight}px`)
    expect(tracks[0]!.style.width).toBe(`${layout.lanes[0]!.cycleHeight * 2}px`)
    handle.destroy()
  })

  it('normalizes SVG sources so tiles receive an intrinsic size', async () => {
    const markup = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="red"/></svg>'
    const blob = new Blob([markup], { type: 'image/svg+xml' })
    const src = URL.createObjectURL(blob)
    const nativeFetch = globalThis.fetch
    vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input) === src) {
        return new Response(markup, { headers: { 'Content-Type': 'image/svg+xml' } })
      }
      return nativeFetch(input, init)
    })
    const host = sizedHost()
    try {
      const handle = mountImagesInMotion(host, { images: [src], tileWidth: 168 })
      const img = host.querySelector('.iim-tile') as HTMLImageElement
      expect(img).toBeTruthy()
      await vi.waitFor(() => {
        expect(img.src).not.toBe(src)
      })
      handle.destroy()
    } finally {
      URL.revokeObjectURL(src)
      vi.unstubAllGlobals()
    }
  })

  it('freezes for reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      addEventListener() {},
      removeEventListener() {},
    }))
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages })
    const track = host.querySelector('.iim-track') as HTMLElement
    expect(track.style.animationPlayState).toBe('paused')
    handle.destroy()
    vi.unstubAllGlobals()
  })

  it('stops on hover and resumes when the pointer leaves', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages, stopOnHover: true })
    const track = host.querySelector('.iim-track') as HTMLElement
    expect(track.style.animationPlayState).toBe('running')

    host.dispatchEvent(new Event('pointerenter'))
    expect(track.style.animationPlayState).toBe('paused')

    host.dispatchEvent(new Event('pointerleave'))
    expect(track.style.animationPlayState).toBe('running')
    handle.destroy()
  })

  it('animates only while hovering', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages, animateOnHover: true })
    const track = host.querySelector('.iim-track') as HTMLElement
    expect(track.style.animationPlayState).toBe('paused')

    host.dispatchEvent(new Event('pointerenter'))
    expect(track.style.animationPlayState).toBe('running')

    host.dispatchEvent(new Event('pointerleave'))
    expect(track.style.animationPlayState).toBe('paused')
    handle.destroy()
  })

  it('ignores hover flags when both are set', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages, stopOnHover: true, animateOnHover: true })
    const track = host.querySelector('.iim-track') as HTMLElement
    expect(track.style.animationPlayState).toBe('running')

    host.dispatchEvent(new Event('pointerenter'))
    expect(track.style.animationPlayState).toBe('running')
    handle.destroy()
  })

  it('listens on the wrapper when the host ignores pointer events', () => {
    const wrap = document.createElement('div')
    document.body.append(wrap)
    const host = sizedHost()
    wrap.append(host)
    host.style.pointerEvents = 'none'
    const handle = mountImagesInMotion(host, { images: EImages, stopOnHover: true })
    const track = host.querySelector('.iim-track') as HTMLElement

    wrap.dispatchEvent(new Event('pointerenter'))
    expect(track.style.animationPlayState).toBe('paused')
    handle.destroy()
  })

  it('destroys the decoration and leaves the host empty of pattern nodes', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages })
    expect(host.querySelector('.iim-decoration')).toBeTruthy()
    handle.destroy()
    expect(host.querySelector('.iim-decoration')).toBeNull()
  })

  it('injects CSS keyframes and wires each track to them', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages, tileWidth: 168 })
    const css = document.getElementById('images-in-motion-style')?.textContent ?? ''
    const track = host.querySelector('.iim-track') as HTMLElement

    expect(css).toMatch(/@keyframes iim-scroll/)
    expect(css).toMatch(/@keyframes iim-scroll-x/)
    expect(css).toMatch(/animation-name:\s*iim-scroll/)
    expect(track.className).toBe('iim-track')
    expect(track.style.animationDuration).toMatch(/^\d+(\.\d+)?ms$/)
    expect(Number.parseFloat(track.style.animationDuration)).toBeGreaterThan(0)
    handle.destroy()
  })

  it('renders nothing for an empty image list, then builds tracks when images arrive', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: [] })
    expect(handle.getLayout().lanes).toEqual([])
    expect(host.querySelectorAll('.iim-track')).toHaveLength(0)

    handle.update({ images: EImages })
    expect(handle.getLayout().lanes.length).toBeGreaterThan(0)
    expect(host.querySelectorAll('.iim-track').length).toBeGreaterThan(0)
    handle.destroy()
  })

  it('keeps tracks when the image list is a new array of the same urls', () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages, paused: false })
    const first = host.querySelector('.iim-track')
    handle.update({ images: [...EImages], paused: true })
    expect(host.querySelector('.iim-track')).toBe(first)
    expect((first as HTMLElement).style.animationPlayState).toBe('paused')
    handle.destroy()
  })

  it('eases playbackRate when CSS animations are present', async () => {
    const host = sizedHost()
    const handle = mountImagesInMotion(host, { images: EImages, paused: false })
    const animation = {
      playState: 'running' as AnimationPlayState,
      playbackRate: 1,
      play() {
        this.playState = 'running'
      },
      pause() {
        this.playState = 'paused'
      },
    }
    for (const track of host.querySelectorAll('.iim-track')) {
      Object.defineProperty(track, 'getAnimations', {
        configurable: true,
        value: () => [animation],
      })
    }

    handle.update({ paused: true })
    expect(animation.playState).toBe('running')
    expect(animation.playbackRate).toBe(1)

    await vi.waitFor(() => {
      expect(animation.playbackRate).toBe(0)
      expect(animation.playState).toBe('paused')
    })
    handle.destroy()
  })

  it('accepts a named iimOptions constant', () => {
    const host = sizedHost()
    const iimOptions = { images: EImages, tileWidth: 168, angle: 12, paused: true }
    const handle = mountImagesInMotion(host, iimOptions)
    const track = host.querySelector('.iim-track') as HTMLElement
    expect(host.querySelectorAll('.iim-track').length).toBeGreaterThan(1)
    expect(track.style.animationPlayState).toBe('paused')
    handle.update({ ...iimOptions, paused: false })
    expect(track.style.animationPlayState).toBe('running')
    handle.destroy()
  })
})
