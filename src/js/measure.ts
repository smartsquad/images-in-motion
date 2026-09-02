const EAspectCache = new Map<string, number>()

export function measureImageAspect(src: string): Promise<number | undefined> {
  const cached = EAspectCache.get(src)
  if (cached !== undefined) {
    return Promise.resolve(cached)
  }
  if (typeof Image === 'undefined') {
    return Promise.resolve(undefined)
  }
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        const aspect = image.naturalWidth / image.naturalHeight
        EAspectCache.set(src, aspect)
        resolve(aspect)
        return
      }
      resolve(undefined)
    }
    image.onerror = () => resolve(undefined)
    image.src = src
  })
}

export async function measureImageAspects(
  sources: readonly string[],
): Promise<(number | undefined)[]> {
  return Promise.all(sources.map(measureImageAspect))
}
