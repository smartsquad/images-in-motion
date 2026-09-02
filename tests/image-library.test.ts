import { describe, expect, it } from 'vitest'
import { appendSources, clampImageCount, removeSourceAt } from '../studio/image-library'

describe('studio image library', () => {
  it('clamps count to the current library length', () => {
    expect(clampImageCount(16, 20)).toBe(16)
    expect(clampImageCount(40, 20)).toBe(20)
    expect(clampImageCount(-2, 20)).toBe(0)
    expect(clampImageCount(4, 0)).toBe(0)
  })

  it('removes a single source by index', () => {
    expect(removeSourceAt(['a', 'b', 'c'], 1)).toEqual(['a', 'c'])
  })

  it('appends uploaded sources without replacing the list', () => {
    expect(appendSources(['a'], ['b', 'c'])).toEqual(['a', 'b', 'c'])
  })
})
