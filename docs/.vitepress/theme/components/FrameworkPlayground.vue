<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useData } from 'vitepress'
import expoApp from '../../../playgrounds/expo/App.tsx?raw'
import {
  ENativeScriptNew,
  EStackBlitzOpenFiles,
  createSnackLaunchUrl,
  isWebPlaygroundId,
  stackBlitzGithubUrl,
  type TPlaygroundId,
} from '../../playground'
import { createStackBlitzProject } from '../playground-projects'

/** Icons: nf-dev-stackblitz U+E942, nf-dev-expo U+E90C, nf-md-nativescript U+F0880, nf-md-open_in_new U+F03CC, nf-md-play_circle U+F040C. */

const props = defineProps<{
  id: TPlaygroundId
}>()

const { isDark } = useData()
const embedHost = ref<HTMLElement | null>(null)
const embedLoaded = ref(false)
const embedStarting = ref(false)
const opening = ref(false)
const embedError = ref('')

const web = computed(() => isWebPlaygroundId(props.id))

const href = computed(() => {
  if (isWebPlaygroundId(props.id)) {
    return stackBlitzGithubUrl(props.id)
  }
  if (props.id === 'expo') {
    return createSnackLaunchUrl(expoApp)
  }
  return ENativeScriptNew
})

const label = computed(() => {
  if (web.value) {
    return 'Open in StackBlitz'
  }
  if (props.id === 'expo') {
    return 'Open in Expo Snack'
  }
  return 'Open NativeScript Preview'
})

const title = computed(() => {
  if (web.value) {
    return 'Open a live editor with the current library source'
  }
  if (props.id === 'expo') {
    return 'Open this WebView host in Expo Snack'
  }
  return 'Open the official NativeScript TypeScript starter on StackBlitz'
})

function editorTheme(): 'light' | 'dark' {
  return isDark.value ? 'dark' : 'light'
}

async function loadSdk() {
  const mod = await import('@stackblitz/sdk')
  return mod.default
}

async function openEditor(event: MouseEvent): Promise<void> {
  if (!isWebPlaygroundId(props.id)) {
    return
  }
  event.preventDefault()
  opening.value = true
  embedError.value = ''
  try {
    const sdk = await loadSdk()
    sdk.openProject(createStackBlitzProject(props.id), {
      newWindow: true,
      openFile: EStackBlitzOpenFiles[props.id],
      theme: editorTheme(),
    })
  } catch (error) {
    embedError.value = error instanceof Error ? error.message : 'StackBlitz failed to open.'
  } finally {
    opening.value = false
  }
}

async function loadEmbed(): Promise<void> {
  if (!isWebPlaygroundId(props.id) || embedLoaded.value || embedStarting.value) {
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
    await sdk.embedProject(host, createStackBlitzProject(props.id), {
      clickToLoad: false,
      openFile: EStackBlitzOpenFiles[props.id],
      view: 'preview',
      hideExplorer: true,
      hideNavigation: true,
      showSidebar: false,
      height: 520,
      theme: editorTheme(),
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
          v-if="web"
          class="nf fw-play__icon"
          aria-hidden="true"
        >{{ '\u{e942}' }}</span>
        <span
          v-else-if="id === 'expo'"
          class="nf fw-play__icon fw-icon--expo"
          aria-hidden="true"
        >{{ '\u{e90c}' }}</span>
        <span
          v-else
          class="nf fw-play__icon fw-icon--nativescript"
          aria-hidden="true"
        >{{ '\u{f0880}' }}</span>
        {{ opening ? 'Opening...' : label }}
        <span class="nf fw-play__icon fw-play__icon--out" aria-hidden="true">{{ '\u{f03cc}' }}</span>
      </a>
      <button
        v-if="web && !embedLoaded"
        type="button"
        class="fw-play__btn fw-play__btn--ghost"
        title="Load a live preview in this page"
        :disabled="embedStarting"
        @click="loadEmbed"
      >
        <span class="nf fw-play__icon" aria-hidden="true">{{ '\u{f040c}' }}</span>
        {{ embedStarting ? 'Loading preview...' : 'Load live preview' }}
      </button>
    </div>

    <p v-if="embedError" class="fw-play__error">{{ embedError }}</p>
    <div v-if="web" class="fw-play__embed" :hidden="!embedLoaded">
      <div ref="embedHost" />
    </div>
  </div>
</template>
