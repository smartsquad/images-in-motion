<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import {
  createSnackLaunchUrl,
  isExpoNativeTab,
  type TPlaygroundId,
} from '../../playground'
import { frameworkExampleTabs, type TFrameworkExampleTab } from '../../framework-example-source'
import { createStackBlitzProject, snippetOpenFile } from '../playground-projects'

/** Icons: nf-dev-stackblitz U+E942, nf-dev-expo U+E90C, nf-md-open_in_new U+F03CC, nf-md-play_circle U+F040C. */

const props = defineProps<{
  id: TPlaygroundId
  tab?: TFrameworkExampleTab
}>()

const { isDark } = useData()
const embedHost = ref<HTMLElement | null>(null)
const embedLoaded = ref(false)
const embedStarting = ref(false)
const opening = ref(false)
const embedError = ref('')
const isolated = ref(false)

onMounted(() => {
  isolated.value = window.crossOriginIsolated
})

const tab = computed(() => props.tab ?? frameworkExampleTabs(props.id)[0]!)
const snack = computed(() => isExpoNativeTab(props.id, tab.value))
const stackblitz = computed(() => !snack.value)

const href = computed(() => {
  if (snack.value) {
    return createSnackLaunchUrl(tab.value.code)
  }
  return '#'
})

const label = computed(() => (snack.value ? 'Open in Expo Snack' : 'Open in StackBlitz'))

const title = computed(() => (
  snack.value
    ? 'Open the snippet above in Expo Snack'
    : 'Open the snippet above in StackBlitz'
))

watch(() => tab.value.code, () => {
  embedLoaded.value = false
  embedStarting.value = false
  embedError.value = ''
  embedHost.value?.replaceChildren()
})

function editorTheme(): 'light' | 'dark' {
  return isDark.value ? 'dark' : 'light'
}

async function loadSdk() {
  const mod = await import('@stackblitz/sdk')
  return mod.default
}

async function openEditor(event: MouseEvent): Promise<void> {
  if (snack.value) {
    return
  }
  event.preventDefault()
  opening.value = true
  embedError.value = ''
  try {
    const sdk = await loadSdk()
    sdk.openProject(createStackBlitzProject(props.id, tab.value), {
      newWindow: true,
      openFile: snippetOpenFile(props.id, tab.value),
      theme: editorTheme(),
    })
  } catch (error) {
    embedError.value = error instanceof Error ? error.message : 'StackBlitz failed to open.'
  } finally {
    opening.value = false
  }
}

async function loadEmbed(): Promise<void> {
  if (!stackblitz.value || embedLoaded.value || embedStarting.value) {
    return
  }
  embedStarting.value = true
  embedError.value = ''
  await nextTick()
  const host = embedHost.value
  if (!host) {
    embedError.value = 'Preview host is not ready.'
    embedStarting.value = false
    return
  }
  try {
    const sdk = await loadSdk()
    host.replaceChildren()
    await sdk.embedProject(host, createStackBlitzProject(props.id, tab.value), {
      clickToLoad: false,
      openFile: snippetOpenFile(props.id, tab.value),
      view: 'preview',
      hideExplorer: true,
      hideNavigation: true,
      showSidebar: false,
      height: 520,
      theme: editorTheme(),
      crossOriginIsolated: true,
    })
    embedLoaded.value = true
  } catch (error) {
    embedError.value = error instanceof Error ? error.message : 'StackBlitz failed to embed.'
  } finally {
    embedStarting.value = false
  }
}
</script>

<template>
  <div class="fw-play">
    <div class="fw-play__row">
      <a
        class="fw-play__btn"
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        :title="title"
        :aria-busy="opening ? 'true' : undefined"
        @click="openEditor"
      >
        <span
          v-if="snack"
          class="nf fw-play__icon fw-icon--expo"
          aria-hidden="true"
        >{{ '\u{e90c}' }}</span>
        <span
          v-else
          class="nf fw-play__icon"
          aria-hidden="true"
        >{{ '\u{e942}' }}</span>
        {{ opening ? 'Opening...' : label }}
        <span class="nf fw-play__icon fw-play__icon--out" aria-hidden="true">{{ '\u{f03cc}' }}</span>
      </a>
      <button
        v-if="stackblitz && isolated && !embedLoaded"
        type="button"
        class="fw-play__btn fw-play__btn--ghost"
        title="Load the snippet above in this page"
        :disabled="embedStarting"
        @click="loadEmbed"
      >
        <span class="nf fw-play__icon" aria-hidden="true">{{ '\u{f040c}' }}</span>
        {{ embedStarting ? 'Loading preview...' : 'Load live preview' }}
      </button>
    </div>

    <p v-if="embedError" class="fw-play__error">{{ embedError }}</p>
    <div v-if="stackblitz" class="fw-play__embed" :hidden="!embedLoaded">
      <div ref="embedHost" />
    </div>
  </div>
</template>
