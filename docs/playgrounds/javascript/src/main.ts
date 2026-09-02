import { mountImagesInMotion } from 'images-in-motion'
import { EPlaygroundImages } from '../../shared/images'

const iimOptions = {
  images: [...EPlaygroundImages],
  speedRange: [8, 18] as [number, number],
  angle: 12,
  tileWidth: 168,
  gap: 4,
}

const stage = document.querySelector('#stage')
if (stage instanceof HTMLElement) {
  mountImagesInMotion(stage, iimOptions)
}
