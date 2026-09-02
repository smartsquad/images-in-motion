<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  ImagesInMotion,
  type TImagesInMotionImageOrder,
  type TImagesInMotionMotionAxis,
  type TImagesInMotionTileFit,
} from 'images-in-motion/vue'
import { EExampleImages, pickExampleImages } from '../../../../src/example-images'

const ready = ref(false)
const resolvedImages = ref<readonly string[]>(EExampleImages)

const props = withDefaults(defineProps<{
  images?: readonly string[]
  angle?: number
  speedRange?: readonly [number, number]
  tileWidth?: number
  tileAspectRatio?: number
  gap?: number
  overlayOpacity?: number
  overlayColor?: string
  imageOrder?: TImagesInMotionImageOrder
  motionAxis?: TImagesInMotionMotionAxis
  tileFit?: TImagesInMotionTileFit
  gapColor?: string
  gapOpacity?: number
  ratio?: string
  stage?: string
  caption?: string
  fill?: boolean
}>(), {
  angle: 12,
  speedRange: () => [8, 18],
  tileWidth: 168,
  gap: 4,
  ratio: '3 / 4',
  stage: '#000000',
  fill: false,
})

onMounted(() => {
  resolvedImages.value = props.images ?? pickExampleImages(24).images
  ready.value = true
})
</script>

<template>
  <figure class="motion-demo" :class="{ 'motion-demo--fill': fill }">
    <div
      class="motion-demo__stage"
      :class="{ 'motion-demo__stage--fill': fill }"
      :style="fill
        ? { width: '100%', height: '100%', background: stage }
        : { aspectRatio: ratio, background: stage }"
    >
      <ImagesInMotion
        v-if="ready"
        class="motion-demo__sheet"
        :images="resolvedImages"
        :angle="angle"
        :speed-range="speedRange"
        :tile-width="tileWidth"
        :tile-aspect-ratio="tileAspectRatio"
        :gap="gap"
        :overlay-opacity="overlayOpacity"
        :overlay-color="overlayColor"
        :image-order="imageOrder"
        :motion-axis="motionAxis"
        :tile-fit="tileFit"
        :gap-color="gapColor"
        :gap-opacity="gapOpacity"
      />
    </div>
    <figcaption v-if="caption" class="motion-demo__caption">{{ caption }}</figcaption>
  </figure>
</template>
