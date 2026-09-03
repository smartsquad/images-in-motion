import { mountImagesInMotion } from 'images-in-motion'

const images = [
  'https://picsum.photos/800/1200?random=1',
  'https://picsum.photos/1200/800?random=2',
  'https://picsum.photos/800/800?random=3',
  'https://picsum.photos/1000/700?random=4',
  'https://picsum.photos/800/1000?random=5',
  'https://picsum.photos/700/1100?random=6',
  'https://picsum.photos/800/1200?random=7',
  'https://picsum.photos/1200/800?random=8',
]

const shell = document.querySelector('#app')
shell.style.width = '100%'
shell.style.height = '100%'
shell.style.minHeight = '100dvh'
shell.style.display = 'flex'
shell.style.alignItems = 'center'
shell.style.justifyContent = 'center'

const stage = document.querySelector('#stage')
stage.style.width = '20rem'
stage.style.height = '20rem'

mountImagesInMotion(stage, {
  images,
  speedRange: [8, 18],
  angle: 12,
  tileWidth: 168,
  gap: 4,
})
