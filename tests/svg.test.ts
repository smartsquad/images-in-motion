import { describe, expect, it } from 'vitest'
import {
  createImageObjectUrl,
  isImageFile,
  isSvgFile,
  isSvgMarkup,
  normalizeSvgMarkup,
} from '../src/js/svg'

describe('svg image loading', () => {
  it('accepts SVG files that browsers often mislabel', () => {
    expect(isSvgFile(new File(['<svg></svg>'], 'tile.svg', { type: 'image/svg+xml' }))).toBe(true)
    expect(isSvgFile(new File(['<svg></svg>'], 'tile.svg', { type: '' }))).toBe(true)
    expect(isSvgFile(new File(['<svg></svg>'], 'tile.svg', { type: 'text/xml' }))).toBe(true)
    expect(isSvgFile(new File(['<svg></svg>'], 'tile.svg', { type: 'application/xml' }))).toBe(true)
    expect(isImageFile(new File(['<svg></svg>'], 'tile.svg', { type: '' }))).toBe(true)
    expect(isImageFile(new File(['x'], 'photo.jpg', { type: 'image/jpeg' }))).toBe(true)
    expect(isImageFile(new File(['x'], 'notes.xml', { type: 'application/xml' }))).toBe(false)
  })

  it('detects SVG markup with an XML declaration', () => {
    expect(isSvgMarkup('<svg xmlns="http://www.w3.org/2000/svg"></svg>')).toBe(true)
    expect(isSvgMarkup('<?xml version="1.0"?><svg viewBox="0 0 10 10"></svg>')).toBe(true)
    expect(isSvgMarkup('<html></html>')).toBe(false)
  })

  it('adds width, height, and viewBox so tiles have an intrinsic size', () => {
    const normalized = normalizeSvgMarkup(
      '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="red"/></svg>',
    )

    expect(normalized).toMatch(/width="800"/)
    expect(normalized).toMatch(/height="1200"/)
    expect(normalized).toMatch(/viewBox="0 0 800 1200"/)
  })

  it('keeps an existing viewBox and numeric size', () => {
    const normalized = normalizeSvgMarkup(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36"><circle r="8"/></svg>',
    )

    expect(normalized).toMatch(/viewBox="0 0 24 36"/)
    expect(normalized).toMatch(/width="24"/)
    expect(normalized).toMatch(/height="36"/)
  })

  it('replaces percentage sizes using the viewBox', () => {
    const normalized = normalizeSvgMarkup(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 80" width="100%" height="100%"><rect/></svg>',
    )

    expect(normalized).toMatch(/viewBox="0 0 50 80"/)
    expect(normalized).toMatch(/width="50"/)
    expect(normalized).toMatch(/height="80"/)
  })

  it('creates a displayable object URL for an SVG file', async () => {
    const file = new File(
      ['<svg xmlns="http://www.w3.org/2000/svg"><rect width="8" height="8"/></svg>'],
      'mark.svg',
      { type: 'image/svg+xml' },
    )
    const url = await createImageObjectUrl(file)
    expect(url.startsWith('blob:')).toBe(true)
    URL.revokeObjectURL(url)
  })
})
