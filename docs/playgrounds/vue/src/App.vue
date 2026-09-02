<script setup lang="ts">
import { ImagesInMotion, type TImagesInMotionProps } from 'images-in-motion/vue'
import { EPlaygroundImages } from '../../shared/images'

const iimOptions: TImagesInMotionProps = {
  images: [...EPlaygroundImages],
  speedRange: [8, 18],
  angle: 12,
}
</script>

<template>
  <div class="stage">
    <ImagesInMotion v-bind="iimOptions" />
  </div>
</template>

<style>
html,
body {
  margin: 0;
  min-height: 100%;
  background: #141313;
}

.stage {
  width: min(480px, 100vw);
  aspect-ratio: 3 / 4;
}
</style>
