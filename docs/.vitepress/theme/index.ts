import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import CopyOrDownloadAsMarkdownButtons from './components/CopyPageButtons.vue'
import 'virtual:group-icons.css'
import './style.css'
import FrameworkPlayground from './components/FrameworkPlayground.vue'
import FrameworksCards from './components/FrameworksCards.vue'
import HeroMotion from './components/HeroMotion.vue'
import HomeLive from './components/HomeLive.vue'
import MotionDemo from './components/MotionDemo.vue'
import StudioEmbed from './components/StudioEmbed.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'home-hero-info-before': () => h('p', { class: 'hero-eyebrow' }, 'OPEN SOURCE JS LIBRARY'),
    'home-hero-image': () => h(HeroMotion),
  }),
  enhanceApp({ app }) {
    app.component('CopyOrDownloadAsMarkdownButtons', CopyOrDownloadAsMarkdownButtons)
    app.component('FrameworkPlayground', FrameworkPlayground)
    app.component('FrameworksCards', FrameworksCards)
    app.component('HomeLive', HomeLive)
    app.component('MotionDemo', MotionDemo)
    app.component('StudioEmbed', StudioEmbed)
  },
} satisfies Theme
