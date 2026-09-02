export const EGithubRepo = 'smartsquad/images-in-motion'

export const EDocsHostedIife = 'https://iim.smartsquad.io/images-in-motion.global.js'

export const EWebPlaygroundIds = ['react', 'vue', 'javascript', 'element'] as const

export type TWebPlaygroundId = (typeof EWebPlaygroundIds)[number]

export type TPlaygroundId = TWebPlaygroundId | 'expo' | 'nativescript'

export const EPlaygroundTitles: Record<TPlaygroundId, string> = {
  react: 'Images in motion (React)',
  vue: 'Images in motion (Vue)',
  javascript: 'Images in motion (JavaScript)',
  element: 'Images in motion (custom element)',
  expo: 'Images in motion (Expo WebView)',
  nativescript: 'Images in motion (NativeScript WebView)',
}

export const EStackBlitzOpenFiles: Record<TWebPlaygroundId, string> = {
  react: 'src/App.tsx',
  vue: 'src/App.vue',
  javascript: 'src/main.ts',
  element: 'src/main.ts',
}

export function playgroundFolder(id: TWebPlaygroundId): string {
  return `docs/playgrounds/${id}`
}

export function isWebPlaygroundId(id: TPlaygroundId): id is TWebPlaygroundId {
  return (EWebPlaygroundIds as readonly string[]).includes(id)
}

/** Whole-repo import so Vite can alias `images-in-motion` to `src/`. Folder-only import cannot see the library. */
export function stackBlitzGithubUrl(id: TWebPlaygroundId): string {
  const configPath = playgroundFolder(id)
  const params = new URLSearchParams({
    configPath,
    file: `${configPath}/${EStackBlitzOpenFiles[id]}`,
    title: EPlaygroundTitles[id],
  })
  return `https://stackblitz.com/fork/github/${EGithubRepo}/tree/main?${params.toString()}`
}

/** Official NativeScript Preview short link. Resolves to the TypeScript StackBlitz starter. */
export const ENativeScriptNew = 'https://nativescript.new/typescript'

export const ENativeScriptPreview = 'https://preview.nativescript.org/'

/** Current redirect target of `ENativeScriptNew` (2026). Prefer the short link in UI. */
export const ENativeScriptStackBlitz =
  'https://stackblitz.com/github/NativeScript/stackblitz-templates/tree/typescript?file=app%2Fmain-page.xml&title=NativeScript+Starter+TypeScript'

export function createSnackLaunchUrl(appTsx: string): string {
  const files = {
    'App.tsx': {
      type: 'CODE',
      contents: appTsx,
    },
  }
  const params = new URLSearchParams({
    name: EPlaygroundTitles.expo,
    description: 'CSS renderer in a WebView. No react-native-web mosaic.',
    dependencies: 'react-native-webview',
    platform: 'mydevice',
    supportedPlatforms: 'mydevice,ios,android',
    preview: 'true',
    hideQueryParams: 'true',
    files: JSON.stringify(files),
  })
  return `https://snack.expo.dev?${params.toString()}`
}
