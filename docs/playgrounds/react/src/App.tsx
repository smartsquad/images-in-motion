import { ImagesInMotion, type IImagesInMotionMountOptions } from 'images-in-motion/react'
import { EPlaygroundImages } from '../../shared/images'

const iimOptions: IImagesInMotionMountOptions = {
  images: [...EPlaygroundImages],
  speedRange: [8, 18],
  angle: 12,
}

export function App() {
  return (
    <div style={{ width: 480, maxWidth: '100%', aspectRatio: '3 / 4', background: '#000' }}>
      <ImagesInMotion {...iimOptions} />
    </div>
  )
}
