import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref, type App } from 'vue'
import { ImagesInMotion } from '../src/vue'
import { createApp as createBundlerApp } from 'vue/dist/vue.esm-bundler.js'
import { cleanupMotionDom, ETestImages, ETestIimOptions, mockHostSize } from './host'

describe('ImagesInMotion Vue binding', () => {
  let app: App | undefined
  let host: HTMLDivElement | undefined

  beforeEach(() => {
    mockHostSize()
  })

  afterEach(() => {
    app?.unmount()
    app = undefined
    host = undefined
    cleanupMotionDom()
  })

  it('mounts the JS renderer on the inner stage', async () => {
    host = document.createElement('div')
    document.body.append(host)
    app = createApp({
      render: () => h(ImagesInMotion, {
        images: [...ETestImages],
        tileWidth: 168,
      }),
    })
    app.mount(host)
    await nextTick()

    expect(host.querySelectorAll('.iim-track').length).toBeGreaterThan(1)
    expect(host.querySelector('[aria-hidden]')?.querySelector('.iim-decoration')).toBeTruthy()
  })

  it('updates pause without remounting tracks, then unmounts cleanly', async () => {
    host = document.createElement('div')
    document.body.append(host)
    const paused = ref(false)
    app = createApp({
      setup() {
        return () => h(ImagesInMotion, {
          images: [...ETestImages],
          paused: paused.value,
        })
      },
    })
    app.mount(host)
    await nextTick()
    const first = host.querySelector('.iim-track')
    expect(first).toBeTruthy()
    expect((first as HTMLElement).style.animationPlayState).toBe('running')

    paused.value = true
    await nextTick()
    expect(host.querySelector('.iim-track')).toBe(first)
    expect((first as HTMLElement).style.animationPlayState).toBe('paused')

    app.unmount()
    app = undefined
    expect(host.querySelector('.iim-decoration')).toBeNull()
  })

  it('passes an iimOptions constant the same as individual props', async () => {
    host = document.createElement('div')
    document.body.append(host)
    const iimOptions = { ...ETestIimOptions, paused: true }
    app = createApp({
      render: () => h(ImagesInMotion, iimOptions),
    })
    app.mount(host)
    await nextTick()

    const track = host.querySelector('.iim-track') as HTMLElement
    expect(host.querySelectorAll('.iim-track').length).toBeGreaterThan(1)
    expect(track.style.animationPlayState).toBe('paused')
  })

  it('v-binds an iimOptions constant in a template', async () => {
    host = document.createElement('div')
    document.body.append(host)
    const iimOptions = { ...ETestIimOptions, paused: true }
    app = createBundlerApp({
      components: { ImagesInMotion },
      setup() {
        return { iimOptions }
      },
      template: '<ImagesInMotion v-bind="iimOptions" />',
    })
    app.mount(host)
    await nextTick()

    const track = host.querySelector('.iim-track') as HTMLElement
    expect(host.querySelectorAll('.iim-track').length).toBeGreaterThan(1)
    expect(track.style.animationPlayState).toBe('paused')
  })
})
