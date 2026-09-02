import { describe, expect, it } from 'vitest'
import {
  EImagesInMotionPlaybackRampMs,
  playbackRampFinished,
  playbackRampRate,
  playbackRampT,
} from '../src/js/playback-ramp'

describe('playbackRampT', () => {
  it('clamps elapsed time into 0-1', () => {
    expect(playbackRampT(-10, EImagesInMotionPlaybackRampMs)).toBe(0)
    expect(playbackRampT(0, EImagesInMotionPlaybackRampMs)).toBe(0)
    expect(playbackRampT(260, EImagesInMotionPlaybackRampMs)).toBeCloseTo(0.5)
    expect(playbackRampT(EImagesInMotionPlaybackRampMs, EImagesInMotionPlaybackRampMs)).toBe(1)
    expect(playbackRampT(900, EImagesInMotionPlaybackRampMs)).toBe(1)
    expect(playbackRampT(10, 0)).toBe(1)
  })
})

describe('playbackRampRate', () => {
  it('eases in and out between the two rates', () => {
    expect(playbackRampRate(0, 1, 0)).toBe(0)
    expect(playbackRampRate(0, 1, 1)).toBe(1)
    expect(playbackRampRate(0, 1, 0.5)).toBeCloseTo(0.5)
    expect(playbackRampRate(1, 0, 0.5)).toBeCloseTo(0.5)
    expect(playbackRampRate(0, 1, 0.25)).toBeLessThan(0.25)
    expect(playbackRampRate(0, 1, 0.75)).toBeGreaterThan(0.75)
  })
})

describe('playbackRampFinished', () => {
  it('is true at the end of the ease', () => {
    expect(playbackRampFinished(0.99)).toBe(false)
    expect(playbackRampFinished(1)).toBe(true)
  })
})
