import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createImagesInMotionWebViewHtml, mountImagesInMotion } from '../dist/js/index.js'
import { cleanupMotionDom, ETestImages, mockHostSize } from '../tests/host'

const EDistJs = resolve(process.cwd(), 'dist/js/index.js')
const EDistIife = resolve(process.cwd(), 'dist/iife/images-in-motion.global.js')
const EDistReact = resolve(process.cwd(), 'dist/react/index.js')
const EDistVue = resolve(process.cwd(), 'dist/vue/index.js')
const EDistCore = resolve(process.cwd(), 'dist/core/index.js')
const EDistJsDts = resolve(process.cwd(), 'dist/js/index.d.ts')

describe('built package', () => {
  afterEach(() => {
    cleanupMotionDom()
  })

  it('emits ESM, IIFE, and declaration files', () => {
    for (const path of [EDistJs, EDistIife, EDistReact, EDistVue, EDistCore, EDistJsDts]) {
      expect(existsSync(path), path).toBe(true)
    }
  })

  it('mounts tracks from the compiled ESM entry', () => {
    mockHostSize()
    const host = document.createElement('div')
    document.body.append(host)
    const handle = mountImagesInMotion(host, { images: [...ETestImages], tileWidth: 168 })
    expect(host.querySelectorAll('.iim-track').length).toBeGreaterThan(1)
    handle.destroy()
  })

  it('exposes mount on the IIFE global and registers the custom element', async () => {
    mockHostSize()
    const source = await readFile(EDistIife, 'utf8')
    expect(source).toContain('defineImagesInMotionElement')
    const api = new Function(`${source}\nreturn ImagesInMotion;`)() as {
      mountImagesInMotion: typeof mountImagesInMotion
      defineImagesInMotionElement: () => void
    }
    expect(typeof api.mountImagesInMotion).toBe('function')
    api.defineImagesInMotionElement()
    expect(customElements.get('images-in-motion')).toBeDefined()

    const host = document.createElement('div')
    document.body.append(host)
    const handle = api.mountImagesInMotion(host, { images: [...ETestImages] })
    expect(host.querySelectorAll('.iim-track').length).toBeGreaterThan(0)
    handle.destroy()
  })

  it('webview HTML embeds options the IIFE can mount', async () => {
    mockHostSize()
    const html = createImagesInMotionWebViewHtml({ images: [...ETestImages], tileWidth: 168 })
    const match = /ImagesInMotion\.mountImagesInMotion\(document\.getElementById\("stage"\),(.*)\)/.exec(html)
    expect(match?.[1]).toBeDefined()
    const options = JSON.parse(match![1]!) as { images: string[], tileWidth: number }
    const source = await readFile(EDistIife, 'utf8')
    const api = new Function(`${source}\nreturn ImagesInMotion;`)() as {
      mountImagesInMotion: typeof mountImagesInMotion
    }
    const host = document.createElement('div')
    document.body.append(host)
    const handle = api.mountImagesInMotion(host, options)
    expect(host.querySelectorAll('.iim-track').length).toBeGreaterThan(0)
    handle.destroy()
  })
})
