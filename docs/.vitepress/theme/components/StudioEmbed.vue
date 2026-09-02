<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { Root } from 'react-dom/client'

const host = ref<HTMLElement | null>(null)
let root: Root | undefined

onMounted(async () => {
  const el = host.value
  if (!el) {
    return
  }
  const [{ createElement }, { createRoot }, { StudioApp }] = await Promise.all([
    import('react'),
    import('react-dom/client'),
    import('../../../../studio/app.tsx'),
  ])
  root = createRoot(el)
  root.render(createElement(StudioApp, { embed: true }))
})

onUnmounted(() => {
  root?.unmount()
  root = undefined
})
</script>

<template>
  <div ref="host" class="studio-embed"></div>
</template>
