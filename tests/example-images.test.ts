import { describe, expect, it } from 'vitest'
import {
  EBannedExamplePhotoIds,
  EExampleImageCategories,
  EExampleImageCategoryNames,
  EExampleImages,
  exampleImagePhotoId,
  pickExampleImages,
} from '../src/example-images'

function photoIds(urls: readonly string[]): string[] {
  return urls.map((url) => exampleImagePhotoId(url)).filter((id): id is string => Boolean(id))
}

describe('example images', () => {
  it('ships at least twenty-four unique Unsplash photos', () => {
    expect(EExampleImages.length).toBeGreaterThanOrEqual(24)
    expect(new Set(EExampleImages).size).toBe(EExampleImages.length)
  })

  it('never includes the two 404 photo ids', () => {
    const ids = photoIds(Object.values(EExampleImageCategories).flat())
    for (const banned of EBannedExamplePhotoIds) {
      expect(ids).not.toContain(banned)
    }
  })

  it('picks a category and at least twenty-four unique urls', () => {
    const picked = pickExampleImages(24)
    expect(EExampleImageCategoryNames).toContain(picked.category)
    expect(picked.images.length).toBeGreaterThanOrEqual(24)
    expect(new Set(picked.images).size).toBe(picked.images.length)
    const ids = photoIds(picked.images)
    for (const banned of EBannedExamplePhotoIds) {
      expect(ids).not.toContain(banned)
    }
  })
})
