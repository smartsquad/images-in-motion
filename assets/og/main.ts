import { mountImagesInMotion } from 'images-in-motion'
import { EExampleImages } from '../../src/example-images'

const EProposal = new URLSearchParams(window.location.search).get('p')
const EHosts = [...document.querySelectorAll<HTMLElement>('[data-mount]')]

if (EProposal) {
  document.body.classList.add('is-solo')
  const frame = document.querySelector<HTMLElement>(`[data-frame="${EProposal}"]`)
  frame?.classList.add('is-active')
  if (frame) {
    document.body.append(frame)
  }
}

const ETargets = EProposal
  ? EHosts.filter((host) => host.closest(`[data-frame="${EProposal}"]`))
  : EHosts

for (const host of ETargets) {
  mountImagesInMotion(host, {
    images: EExampleImages,
    speedRange: [8, 18],
    angle: 12,
    tileWidth: Number(host.dataset.tile) || 168,
    gap: Number(host.dataset.gap) || 4,
  })
}

function framesReady(): boolean {
  const images = [...document.querySelectorAll('img')]
  return images.length > 0 && images.every((image) => image.complete)
}

function markReady(): void {
  if (framesReady()) {
    document.body.dataset.ready = '1'
    return
  }
  requestAnimationFrame(markReady)
}

requestAnimationFrame(markReady)
