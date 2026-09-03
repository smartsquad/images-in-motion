<script setup lang="ts">
import { onMounted, onServerPrefetch, ref } from 'vue'
import { highlightFrameworkExample } from '../../framework-example-highlight'
import {
  EFrameworkExampleMosaicRem,
  EFrameworkExampleNote,
  frameworkExampleTabs,
  pickFrameworkExampleImages,
  type TFrameworkExampleTab,
} from '../../framework-example-source'
import type { TPlaygroundId } from '../../playground'
import FrameworkPlayground from './FrameworkPlayground.vue'
import MotionDemo from './MotionDemo.vue'

type TFrameworkExampleBlock = TFrameworkExampleTab & {
  html: string
}

const props = defineProps<{
  id: TPlaygroundId
}>()

const groupId = props.id
const liveImages = ref<readonly string[]>([])
const ready = ref(false)
const activeTab = ref(0)
const blocks = ref<TFrameworkExampleBlock[]>([])

async function paintTabs(): Promise<void> {
  const tabs = frameworkExampleTabs(props.id)
  const html = await Promise.all(tabs.map((tab) => highlightFrameworkExample(tab.code, tab.lang)))
  blocks.value = tabs.map((tab, index) => ({
    ...tab,
    html: html[index] ?? '',
  }))
}

async function copyCode(event: Event, code: string): Promise<void> {
  const button = event.currentTarget
  if (!(button instanceof HTMLButtonElement)) {
    return
  }
  await navigator.clipboard.writeText(code)
  button.classList.add('copied')
  window.setTimeout(() => {
    button.classList.remove('copied')
  }, 1600)
}

onServerPrefetch(async () => {
  await paintTabs()
})

onMounted(async () => {
  liveImages.value = pickFrameworkExampleImages().liveImages
  if (blocks.value.length === 0) {
    await paintTabs()
  }
  ready.value = true
})
</script>

<template>
  <div class="fw-example">
    <MotionDemo
      v-if="ready"
      class="fw-example__demo"
      :images="liveImages"
      :size="EFrameworkExampleMosaicRem"
    />
    <div
      v-if="blocks.length"
      class="vp-code-group vp-adaptive-theme"
    >
      <div class="tabs">
        <template
          v-for="(tab, index) in blocks"
          :key="tab.label"
        >
          <input
            :id="`tab-${groupId}-${index}`"
            v-model="activeTab"
            type="radio"
            :name="`group-${groupId}`"
            :value="index"
          >
          <label
            :data-title="tab.label"
            :for="`tab-${groupId}-${index}`"
          >{{ tab.label }}</label>
        </template>
      </div>
      <div class="blocks">
        <div
          v-for="(tab, index) in blocks"
          :key="tab.label"
          :class="['language-' + tab.lang, 'vp-adaptive-theme', { active: index === activeTab }]"
        >
          <button
            title="Copy Code"
            class="copy"
            type="button"
            @click="copyCode($event, tab.code)"
          />
          <span class="lang">{{ tab.lang }}</span>
          <div
            class="fw-example__shiki"
            v-html="tab.html"
          />
        </div>
      </div>
    </div>
    <p class="fw-example__note">{{ EFrameworkExampleNote }}</p>
    <FrameworkPlayground
      v-if="blocks[activeTab]"
      :id="id"
      :tab="blocks[activeTab]"
      :key="`${id}-${activeTab}`"
    />
  </div>
</template>
