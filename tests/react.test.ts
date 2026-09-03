import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createImagesInMotionLayout } from '../src/core'
import { ImagesInMotion } from '../src/react'
import { cleanupMotionDom, ETestImages, ETestIimOptions, mockHostSize, mockParentAspectFill } from './host'

describe('ImagesInMotion React binding', () => {
  let root: Root | undefined

  beforeEach(() => {
    ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
      .IS_REACT_ACT_ENVIRONMENT = true
    mockHostSize()
  })

  afterEach(() => {
    act(() => {
      root?.unmount()
      root = undefined
    })
    cleanupMotionDom()
  })

  it('mounts the JS renderer into the inner stage', () => {
    const host = document.createElement('div')
    document.body.append(host)
    root = createRoot(host)
    act(() => {
      root!.render(createElement(ImagesInMotion, {
        images: [...ETestImages],
        tileWidth: 168,
      }))
    })

    expect(host.querySelectorAll('.iim-track').length).toBeGreaterThan(1)
    expect(host.querySelector('[aria-hidden]')?.querySelector('.iim-decoration')).toBeTruthy()
  })

  it('updates pause without remounting tracks, then unmounts cleanly', () => {
    const host = document.createElement('div')
    document.body.append(host)
    root = createRoot(host)
    act(() => {
      root!.render(createElement(ImagesInMotion, {
        images: [...ETestImages],
        paused: false,
      }))
    })
    const first = host.querySelector('.iim-track')
    expect(first).toBeTruthy()
    expect((first as HTMLElement).style.animationPlayState).toBe('running')

    act(() => {
      root!.render(createElement(ImagesInMotion, {
        images: [...ETestImages],
        paused: true,
      }))
    })
    expect(host.querySelector('.iim-track')).toBe(first)
    expect((first as HTMLElement).style.animationPlayState).toBe('paused')

    act(() => {
      root!.unmount()
      root = undefined
    })
    expect(host.querySelector('.iim-decoration')).toBeNull()
  })

  it('maps width and height onto host CSS, not HTML attributes', () => {
    const host = document.createElement('div')
    document.body.append(host)
    root = createRoot(host)
    act(() => {
      root!.render(createElement(ImagesInMotion, {
        images: [...ETestImages],
        width: '30rem',
        height: '40rem',
      }))
    })

    const box = host.firstElementChild as HTMLElement
    expect(box.getAttribute('width')).toBeNull()
    expect(box.getAttribute('height')).toBeNull()
    expect(box.style.width).toBe('30rem')
    expect(box.style.height).toBe('40rem')
  })

  it('fills the parent with CSS when width and height are omitted', () => {
    const host = document.createElement('div')
    document.body.append(host)
    root = createRoot(host)
    act(() => {
      root!.render(createElement(ImagesInMotion, {
        images: [...ETestImages],
      }))
    })

    const box = host.firstElementChild as HTMLElement
    expect(box.getAttribute('width')).toBeNull()
    expect(box.getAttribute('height')).toBeNull()
    expect(box.style.width).toBe('100%')
    expect(box.style.height).toBe('100%')
    expect(box.style.display).toBe('block')
  })

  it('uses the parent 480 by 3/4 box when width and height are omitted', () => {
    mockParentAspectFill()
    const parent = document.createElement('div')
    parent.style.width = '480px'
    parent.style.aspectRatio = '3 / 4'
    document.body.append(parent)
    root = createRoot(parent)
    act(() => {
      root!.render(createElement(ImagesInMotion, {
        images: [...ETestImages],
        speedRange: [8, 18],
        angle: 12,
        overlayOpacity: 0.35,
      }))
    })

    const box = parent.firstElementChild as HTMLElement
    expect(box.getAttribute('width')).toBeNull()
    expect(box.getAttribute('height')).toBeNull()
    expect(box.style.display).toBe('block')
    expect(box.style.width).toBe('100%')
    expect(box.style.height).toBe('100%')
    expect(box.style.minHeight).toBe('')

    const expected = createImagesInMotionLayout(480, 640, ETestImages.length, {
      speedRange: [8, 18],
      angle: 12,
      overlayOpacity: 0.35,
    })
    const sheet = parent.querySelector('.iim-sheet') as HTMLElement
    expect(parent.querySelectorAll('.iim-track').length).toBeGreaterThan(0)
    expect(Number.parseFloat(sheet.style.height)).toBeCloseTo(expected.height, 4)
  })

  it('maps 100% width and height onto CSS, not HTML attributes', () => {
    const host = document.createElement('div')
    document.body.append(host)
    root = createRoot(host)
    act(() => {
      root!.render(createElement(ImagesInMotion, {
        images: [...ETestImages],
        width: '100%',
        height: '100%',
      }))
    })

    const box = host.firstElementChild as HTMLElement
    expect(box.getAttribute('width')).toBeNull()
    expect(box.getAttribute('height')).toBeNull()
    expect(box.style.width).toBe('100%')
    expect(box.style.height).toBe('100%')
  })

  it('spreads an iimOptions constant the same as individual props', () => {
    const host = document.createElement('div')
    document.body.append(host)
    root = createRoot(host)
    const iimOptions = { ...ETestIimOptions, paused: true }
    act(() => {
      root!.render(createElement(ImagesInMotion, iimOptions))
    })

    const track = host.querySelector('.iim-track') as HTMLElement
    expect(host.querySelectorAll('.iim-track').length).toBeGreaterThan(1)
    expect(track.style.animationPlayState).toBe('paused')

    act(() => {
      root!.render(createElement(ImagesInMotion, { ...iimOptions, paused: false }))
    })
    expect(host.querySelector('.iim-track')).toBe(track)
    expect(track.style.animationPlayState).toBe('running')
  })
})
