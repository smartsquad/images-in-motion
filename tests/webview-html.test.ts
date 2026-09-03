import { describe, expect, it } from 'vitest'
import { createImagesInMotionWebViewHtml, EImagesInMotionIifeSrc } from '../src/js/webview-html'
import { ETestIimOptions } from './host'

describe('createImagesInMotionWebViewHtml', () => {
  it('embeds iimOptions and mounts through the IIFE global', () => {
    const html = createImagesInMotionWebViewHtml(ETestIimOptions)
    expect(html).toContain('id="stage"')
    expect(html).toContain('id="frame"')
    expect(html).toContain('#frame{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}')
    expect(html).toContain('#stage{width:100%;height:100%}')
    expect(html).toContain(`src="${EImagesInMotionIifeSrc}"`)
    expect(html).toContain('ImagesInMotion.mountImagesInMotion')
    expect(html).not.toContain('react-native-web')
    expect(html).not.toContain('react-dom')
    expect(html).not.toContain('use dom')

    const match = /ImagesInMotion\.mountImagesInMotion\(document\.getElementById\("stage"\),(.*)\)/.exec(html)
    expect(match?.[1]).toBeDefined()
    expect(JSON.parse(match![1]!)).toEqual(ETestIimOptions)
  })

  it('accepts a local IIFE path and escapes the src attribute', () => {
    const html = createImagesInMotionWebViewHtml(ETestIimOptions, './images-in-motion.global.js?v="1"')
    expect(html).toContain('src="./images-in-motion.global.js?v=&quot;1&quot;"')
  })

  it('applies rem host size to #stage', () => {
    const html = createImagesInMotionWebViewHtml(ETestIimOptions, undefined, {
      width: '20rem',
      height: '20rem',
    })
    expect(html).toContain('#stage{width:20rem;height:20rem}')
    expect(html).toContain('#frame{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}')
  })

  it('sizes the document to measured native viewport pixels', () => {
    const html = createImagesInMotionWebViewHtml(ETestIimOptions, undefined, {
      width: '20rem',
      height: '20rem',
      viewportWidth: 390.4,
      viewportHeight: 844.2,
    })
    expect(html).toContain('html,body,#frame{margin:0;width:390px;height:844px;')
    expect(html).toContain('#frame{display:flex;align-items:center;justify-content:center}')
    expect(html).toContain('#stage{width:20rem;height:20rem}')
    expect(html).toContain('width=390,initial-scale=1')
    expect(html).not.toContain('position:fixed;inset:0')
  })

  it('keeps the percentage shell when the viewport is not a positive size', () => {
    const html = createImagesInMotionWebViewHtml(ETestIimOptions, undefined, {
      width: '20rem',
      height: '20rem',
      viewportWidth: 0,
      viewportHeight: 100,
    })
    expect(html).toContain('#frame{position:fixed;inset:0')
    expect(html).not.toContain('width:0px')
  })
})
