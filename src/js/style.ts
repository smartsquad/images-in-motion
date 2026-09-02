const EStyleId = 'images-in-motion-style'

const ECss = `
images-in-motion {
  display: block;
  position: relative;
  overflow: hidden;
  background: transparent;
}
@keyframes iim-scroll {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, var(--iim-cycle), 0); }
}
@keyframes iim-scroll-x {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(var(--iim-cycle), 0, 0); }
}
.iim-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.iim-sheet {
  position: absolute;
  transform-origin: 50% 50%;
}
.iim-track {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  animation-name: iim-scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  will-change: transform;
}
.iim-track.is-horizontal {
  flex-direction: row;
  left: 0;
  animation-name: iim-scroll-x;
}
.iim-tile {
  display: block;
  flex-shrink: 0;
  object-fit: cover;
  pointer-events: none;
}
.iim-overlay {
  position: absolute;
  inset: 0;
  background: #000;
  pointer-events: none;
}
`

export function ensureImagesInMotionStyle(): void {
  if (typeof document === 'undefined') {
    return
  }
  if (document.getElementById(EStyleId)) {
    return
  }
  const style = document.createElement('style')
  style.id = EStyleId
  style.textContent = ECss
  document.head.appendChild(style)
}
