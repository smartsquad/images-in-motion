export const EFrameworkHub = {
  text: 'Getting started',
  link: '/frameworks/',
} as const

/**
 * Product glyphs from Symbols Nerd Font.
 * https://www.nerdfonts.com/font-downloads
 */
export const EFrameworkGuides = [
  {
    id: 'react',
    text: 'React',
    link: '/frameworks/react',
    icon: '\u{e7ba}', // nf-dev-react U+E7BA
    detail: 'images-in-motion/react mounts the same renderer.',
  },
  {
    id: 'vue',
    text: 'Vue',
    link: '/frameworks/vue',
    icon: '\u{f0844}', // nf-md-vuejs U+F0844
    detail: 'images-in-motion/vue for Vue 3. Bindings do not reimplement geometry.',
  },
  {
    id: 'expo',
    text: 'Expo',
    link: '/frameworks/expo',
    icon: '\u{e90c}', // nf-dev-expo U+E90C
    detail: 'CSS renderer in a WebView. Same translate3d keyframes. No react-native-web.',
  },
  {
    id: 'nativescript',
    text: 'NativeScript',
    link: '/frameworks/nativescript',
    icon: '\u{f0880}', // nf-md-nativescript U+F0880
    detail: 'WebView hosts the custom element. Same CSS renderer. No native view port.',
  },
  {
    id: 'javascript',
    text: 'JavaScript',
    link: '/frameworks/javascript',
    icon: '\u{e781}', // nf-dev-javascript U+E781
    detail: 'mountImagesInMotion from the JS entry.',
  },
  {
    id: 'element',
    text: 'Custom element',
    link: '/frameworks/element',
    icon: '\u{f0c8b}', // nf-md-application_brackets U+F0C8B
    detail: '<images-in-motion> on any page, including a CDN script.',
  },
] as const

export type TFrameworkGuide = (typeof EFrameworkGuides)[number]

export function frameworkIconHtml(guide: TFrameworkGuide): string {
  return `<span class="nf fw-icon fw-icon--${guide.id}" aria-hidden="true">${guide.icon}</span>`
}

export function frameworkNavItems() {
  return [
    { text: EFrameworkHub.text, link: EFrameworkHub.link },
    ...EFrameworkGuides.map(({ text, link }) => ({ text, link })),
  ]
}

export function frameworkSidebarItems() {
  return [
    { text: EFrameworkHub.text, link: EFrameworkHub.link },
    ...EFrameworkGuides.map((guide) => ({
      text: `${frameworkIconHtml(guide)}${guide.text}`,
      link: guide.link,
    })),
  ]
}
