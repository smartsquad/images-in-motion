import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineImagesInMotionElement } from '../src/js/element'
import { cleanupMotionDom, ETestImages, mockHostSize } from './host'

defineImagesInMotionElement()

function createElement(): HTMLElement {
  const element = document.createElement('images-in-motion')
  element.setAttribute('images', ETestImages.join(','))
  element.setAttribute('tile-width', '168')
  document.body.append(element)
  return element
}

describe('images-in-motion custom element', () => {
  beforeEach(() => {
    mockHostSize()
  })

  afterEach(() => {
    cleanupMotionDom()
  })

  it('registers once and mounts tracks from a comma-separated images attribute', () => {
    expect(customElements.get('images-in-motion')).toBeDefined()
    defineImagesInMotionElement()
    const element = createElement()
    const tracks = element.querySelectorAll('.iim-track')
    expect(tracks.length).toBeGreaterThan(1)
    expect(tracks[1]!.classList.contains('iim-track')).toBe(true)
    expect((tracks[1] as HTMLElement).style.animationDirection).toBe('reverse')
  })

  it('accepts a JSON images array and speed-range', () => {
    const element = document.createElement('images-in-motion')
    element.setAttribute('images', JSON.stringify([...ETestImages]))
    element.setAttribute('speed-range', '[9, 9]')
    element.setAttribute('tile-width', '120')
    document.body.append(element)
    const layoutTrack = element.querySelector('.iim-track') as HTMLElement
    expect(layoutTrack).toBeTruthy()
    expect(layoutTrack.style.animationDuration).toMatch(/ms$/)
    expect(Number.parseFloat(layoutTrack.style.animationDuration)).toBeGreaterThan(0)
  })

  it('pauses from the paused attribute and lays out horizontal rows', () => {
    const element = createElement()
    element.setAttribute('paused', '')
    const track = element.querySelector('.iim-track') as HTMLElement
    expect(track.style.animationPlayState).toBe('paused')

    element.setAttribute('motion-axis', 'horizontal')
    expect(element.querySelector('.iim-track')!.classList.contains('is-horizontal')).toBe(true)
  })

  it('tears down on disconnect', () => {
    const element = createElement()
    expect(element.querySelector('.iim-decoration')).toBeTruthy()
    element.remove()
    expect(element.querySelector('.iim-decoration')).toBeNull()
  })
})
