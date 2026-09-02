/** Circular corner radius as CSS. Percentage `border-radius` is elliptical (rx from width, ry from height). */
export function previewCornerRadiusCss(radiusPercent: number, width: number, height: number): string {
  const boxWidth = Math.max(1, width)
  const boxHeight = Math.max(1, height)
  const percent = Math.min(100, Math.max(0, radiusPercent))
  if (percent === 0) {
    return '0'
  }
  const rx = percent * Math.min(1, boxHeight / boxWidth)
  const ry = percent * Math.min(1, boxWidth / boxHeight)
  if (Math.abs(rx - ry) < 0.0001) {
    return `${rx}%`
  }
  return `${rx}% / ${ry}%`
}
