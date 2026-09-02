<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MotionDemo from './MotionDemo.vue'

gsap.registerPlugin(ScrollTrigger)

const ECaption = 'Default study: vertical columns, 12°, sequential order.'
const ECardRatio = '16 / 9'

const root = ref<HTMLElement | null>(null)
const slot = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const reduced = ref(false)

let ctx: gsap.Context | undefined

function gsapNumber(el: HTMLElement, prop: string, fallback: number) {
  const value = gsap.getProperty(el, prop)
  const parsed = typeof value === 'number' ? value : parseFloat(String(value))
  return Number.isFinite(parsed) ? parsed : fallback
}

function measureFrom() {
  const slotEl = slot.value
  const stageEl = stage.value
  if (!slotEl || !stageEl || typeof window === 'undefined' || window.innerWidth === 0 || window.innerHeight === 0) {
    return null
  }

  // Read the slot before touching the stage, so a 100vw box cannot inflate the card.
  const slotRect = slotEl.getBoundingClientRect()
  const slotLeft = slotRect.left
  const slotWidth = slotRect.width
  const slotHeight = slotRect.height

  stageEl.style.width = `${window.innerWidth}px`
  stageEl.style.height = `${window.innerHeight}px`
  // Park on the viewport left using the snapped slot, not 50vw. GSAP x is then
  // the remaining delta, so the two offsets cannot stack.
  stageEl.style.marginLeft = `${-slotLeft}px`

  const currentX = gsapNumber(stageEl, 'x', 0)
  const currentScaleX = gsapNumber(stageEl, 'scaleX', 1)
  const currentScaleY = gsapNumber(stageEl, 'scaleY', 1)
  const stageRect = stageEl.getBoundingClientRect()
  const unscaledWidth = stageRect.width / currentScaleX
  const unscaledHeight = stageRect.height / currentScaleY
  // Origin is top left, so scale does not move the left edge.
  const layoutLeft = stageRect.left - currentX

  return {
    x: slotLeft - layoutLeft,
    toX: -layoutLeft,
    scaleX: unscaledWidth === 0 ? 1 : slotWidth / unscaledWidth,
    scaleY: unscaledHeight === 0 ? 1 : slotHeight / unscaledHeight,
  }
}

function setupMorph() {
  const stageEl = stage.value
  const slotEl = slot.value
  const trackEl = track.value
  if (!stageEl || !slotEl || !trackEl || !root.value) {
    return
  }

  ctx?.revert()
  ctx = gsap.context(() => {
    gsap.set(stageEl, { transformOrigin: 'top left' })
    let from = measureFrom()
    if (!from) {
      return
    }

    gsap.set(stageEl, {
      x: from.x,
      y: 0,
      scaleX: from.scaleX,
      scaleY: from.scaleY,
      borderRadius: 8,
      '--home-live-edge': 2,
      autoAlpha: 1,
    })

    gsap.fromTo(
      stageEl,
      {
        x: () => from?.x ?? 0,
        y: 0,
        scaleX: () => from?.scaleX ?? 1,
        scaleY: () => from?.scaleY ?? 1,
        borderRadius: 8,
        '--home-live-edge': 2,
      },
      {
        x: () => from?.toX ?? 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        borderRadius: 0,
        '--home-live-edge': 0,
        ease: 'power3.inOut',
        immediateRender: true,
        scrollTrigger: {
          trigger: slotEl,
          endTrigger: trackEl,
          start: 'top 70%',
          end: 'top top',
          scrub: 0.4,
          invalidateOnRefresh: true,
          onRefresh: () => {
            const next = measureFrom()
            if (next) {
              from = next
            }
          },
        },
      },
    )
  }, root.value)
}

function onResize() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
  })
}

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('resize', onResize, { passive: true })
  if (reduced.value) {
    return
  }
  requestAnimationFrame(() => {
    setupMorph()
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  ctx?.revert()
  ctx = undefined
})
</script>

<template>
  <div ref="root" class="home-live" :class="{ 'is-reduced': reduced }">
    <template v-if="reduced">
      <MotionDemo :ratio="ECardRatio" :caption="ECaption" stage="var(--vp-c-bg)" />
    </template>
    <template v-else>
      <div class="home-live__intro">
        <div ref="slot" class="home-live__slot"></div>
        <p class="motion-demo__caption">{{ ECaption }}</p>
      </div>
      <div ref="track" class="home-live__track">
        <div class="home-live__sticky">
          <div ref="stage" class="home-live__stage">
            <MotionDemo fill stage="transparent" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
