import { createHighlighter } from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const ELangs = ['tsx', 'vue', 'javascript', 'html'] as const
const EThemes = ['github-light', 'github-dark'] as const

const ELangAlias: Record<string, string> = {
  html: 'html',
  js: 'javascript',
  tsx: 'tsx',
  vue: 'vue',
}

let highlighterPromise: ReturnType<typeof createHighlighter> | undefined

function frameworkHighlighter(): ReturnType<typeof createHighlighter> {
  highlighterPromise ??= createHighlighter({
    engine: createJavaScriptRegexEngine(),
    langs: [...ELangs],
    themes: [...EThemes],
  })
  return highlighterPromise
}

export async function highlightFrameworkExample(code: string, lang: string): Promise<string> {
  const highlighter = await frameworkHighlighter()
  return highlighter.codeToHtml(code.trimEnd() + '\n', {
    defaultColor: false,
    lang: ELangAlias[lang] ?? lang,
    themes: {
      dark: 'github-dark',
      light: 'github-light',
    },
    transformers: [
      {
        pre(node) {
          const current = node.properties.class
          const classes = Array.isArray(current)
            ? current.map(String)
            : current === undefined || current === null
              ? []
              : [String(current)]
          if (!classes.includes('vp-code')) {
            classes.push('vp-code')
          }
          node.properties.class = classes
        },
      },
    ],
  })
}
