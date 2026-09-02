import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveHoverPlayback, shouldRunAnimation } from '../src/core/playback'

afterEach(() => {
  vi.unstubAllGlobals()
})

function allowMotion(): void {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }))
}

describe('resolveHoverPlayback', () => {
  it('keeps continuous motion unless exactly one flag is set', () => {
    expect(resolveHoverPlayback()).toBe('always')
    expect(resolveHoverPlayback(false, false)).toBe('always')
    expect(resolveHoverPlayback(true, true)).toBe('always')
    expect(resolveHoverPlayback(true, false)).toBe('stop')
    expect(resolveHoverPlayback(false, true)).toBe('animate')
  })
})

describe('shouldRunAnimation', () => {
  it('lets paused win over hover mode', () => {
    allowMotion()
    expect(shouldRunAnimation(true, 'stop', false)).toBe(false)
    expect(shouldRunAnimation(true, 'animate', true)).toBe(false)
  })

  it('stops only while hovering in stop mode', () => {
    allowMotion()
    expect(shouldRunAnimation(false, 'stop', false)).toBe(true)
    expect(shouldRunAnimation(false, 'stop', true)).toBe(false)
  })

  it('runs only while hovering in animate mode', () => {
    allowMotion()
    expect(shouldRunAnimation(false, 'animate', false)).toBe(false)
    expect(shouldRunAnimation(false, 'animate', true)).toBe(true)
  })
})
