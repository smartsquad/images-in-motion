import { afterEach, describe, expect, it } from 'vitest'
import { cssBoxSize, readHostBox } from '../src/js/host-box'

describe('cssBoxSize', () => {
  it('turns finite numbers into px and keeps CSS strings', () => {
    expect(cssBoxSize(480)).toBe('480px')
    expect(cssBoxSize('480')).toBe('480px')
    expect(cssBoxSize('100%')).toBe('100%')
    expect(cssBoxSize(' 30rem ')).toBe('30rem')
    expect(cssBoxSize('40rem')).toBe('40rem')
    expect(cssBoxSize('')).toBeUndefined()
    expect(cssBoxSize(Number.NaN)).toBeUndefined()
    expect(cssBoxSize(undefined)).toBeUndefined()
  })
})

describe('readHostBox', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('returns the measured box without changing styles', () => {
    const host = document.createElement('div')
    Object.defineProperty(host, 'getBoundingClientRect', {
      value: () => ({
        width: 480,
        height: 640,
        top: 0,
        left: 0,
        bottom: 640,
        right: 480,
        x: 0,
        y: 0,
        toJSON() {
          return {}
        },
      }),
    })
    document.body.append(host)
    expect(readHostBox(host)).toEqual({ width: 480, height: 640 })
    expect(host.style.width).toBe('')
    expect(host.style.height).toBe('')
    expect(host.style.minHeight).toBe('')
  })

  it('returns 0x0 when the host has no used size', () => {
    const host = document.createElement('div')
    document.body.append(host)
    expect(readHostBox(host)).toEqual({ width: 0, height: 0 })
    expect(host.style.minHeight).toBe('')
  })
})
