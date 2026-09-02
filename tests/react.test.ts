import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ImagesInMotion } from '../src/react'
import { cleanupMotionDom, ETestImages, ETestIimOptions, mockHostSize } from './host'

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
