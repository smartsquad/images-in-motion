import { describe, expect, it } from 'vitest'
import { formatRangeValue, parseRangeValue, snapRangeValue } from '../studio/range-value'

describe('range value parsing', () => {
  it('snaps integers to the slider step and clamps to min/max', () => {
    expect(snapRangeValue(25, 1, 40, 1)).toBe(25)
    expect(snapRangeValue(0, 1, 40, 1)).toBe(1)
    expect(snapRangeValue(100, 1, 40, 1)).toBe(40)
    expect(snapRangeValue(18.6, 1, 40, 1)).toBe(19)
  })

  it('snaps decimal opacity to 0.05 steps without float residue', () => {
    expect(snapRangeValue(0.37, 0, 1, 0.05)).toBe(0.35)
    expect(snapRangeValue(0.025, 0, 1, 0.05)).toBe(0.05)
    expect(snapRangeValue(1.2, 0, 1, 0.05)).toBe(1)
    expect(formatRangeValue(0.35, 0.05)).toBe('0.35')
  })

  it('keeps negative inclination in range', () => {
    expect(parseRangeValue('-12', -90, 90, 1)).toBe(-12)
    expect(parseRangeValue('-120', -90, 90, 1)).toBe(-90)
    expect(formatRangeValue(-12, 1)).toBe('-12')
  })

  it('returns null for empty or non-numeric input so the field can revert', () => {
    expect(parseRangeValue('', 1, 40, 1)).toBeNull()
    expect(parseRangeValue('   ', 1, 40, 1)).toBeNull()
    expect(parseRangeValue('px', 1, 40, 1)).toBeNull()
    expect(parseRangeValue('--', -90, 90, 1)).toBeNull()
  })

  it('parses trimmed numeric text used by composition fields', () => {
    expect(parseRangeValue(' 200 ', 64, 320, 1)).toBe(200)
    expect(parseRangeValue('600', 1, 10000, 1)).toBe(600)
    expect(parseRangeValue('1', 1, 10000, 1)).toBe(1)
    expect(parseRangeValue('0', 1, 10000, 1)).toBe(1)
    expect(parseRangeValue('4', 0, 24, 1)).toBe(4)
    expect(parseRangeValue('0.8', 0, 1, 0.05)).toBe(0.8)
  })
})
