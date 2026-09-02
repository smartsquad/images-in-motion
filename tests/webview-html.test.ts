import { describe, expect, it } from 'vitest'
import { createImagesInMotionWebViewHtml, EImagesInMotionIifeSrc } from '../src/js/webview-html'
import { ETestIimOptions } from './host'

describe('createImagesInMotionWebViewHtml', () => {
  it('embeds iimOptions and mounts through the IIFE global', () => {
    const html = createImagesInMotionWebViewHtml(ETestIimOptions)
    expect(html).toContain('id="stage"')
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
})
