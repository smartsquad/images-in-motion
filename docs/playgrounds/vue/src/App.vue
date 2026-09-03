<script setup lang="ts">
import { ImagesInMotion } from 'images-in-motion/vue'

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
</script>

<template>
  <div style="width:100%;height:100%;min-height:100dvh;display:flex;align-items:center;justify-content:center">
    <ImagesInMotion
      width="20rem"
      height="20rem"
      :images="images"
      :speed-range="[8, 18]"
      :angle="12"
    />
  </div>
</template>
