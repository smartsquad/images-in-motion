import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref, type App } from 'vue'
import { ImagesInMotion } from '../src/vue'
import { createApp as createBundlerApp } from 'vue/dist/vue.esm-bundler.js'
import { createImagesInMotionLayout } from '../src/core'
import { cleanupMotionDom, ETestImages, ETestIimOptions, mockHostSize, mockParentAspectFill } from './host'

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

  it('maps width and height attrs onto host CSS', async () => {
    host = document.createElement('div')
    document.body.append(host)
    app = createBundlerApp({
      components: { ImagesInMotion },
      setup() {
        return { urls: [...ETestImages] }
      },
      template: '<ImagesInMotion :images="urls" width="30rem" height="40rem" />',
    })
    app.mount(host)
    await nextTick()

    const box = host.firstElementChild as HTMLElement
    expect(box.getAttribute('width')).toBeNull()
    expect(box.getAttribute('height')).toBeNull()
    expect(box.style.width).toBe('30rem')
    expect(box.style.height).toBe('40rem')
  })

  it('fills the parent with CSS when width and height are omitted', async () => {
    host = document.createElement('div')
    document.body.append(host)
    app = createApp({
      render: () => h(ImagesInMotion, {
        images: [...ETestImages],
      }),
    })
    app.mount(host)
    await nextTick()

    const box = host.firstElementChild as HTMLElement
    expect(box.getAttribute('width')).toBeNull()
    expect(box.getAttribute('height')).toBeNull()
    expect(box.style.width).toBe('100%')
    expect(box.style.height).toBe('100%')
    expect(box.style.display).toBe('block')
  })

  it('uses the parent 480 by 3/4 box when width and height are omitted', async () => {
    mockParentAspectFill()
    host = document.createElement('div')
    host.style.width = '480px'
    host.style.aspectRatio = '3 / 4'
    document.body.append(host)
    app = createApp({
      render: () => h(ImagesInMotion, {
        images: [...ETestImages],
        speedRange: [8, 18],
        angle: 12,
        overlayOpacity: 0.35,
      }),
    })
    app.mount(host)
    await nextTick()

    const box = host.firstElementChild as HTMLElement
    expect(box.getAttribute('width')).toBeNull()
    expect(box.getAttribute('height')).toBeNull()
    expect(box.style.display).toBe('block')
    expect(box.style.width).toBe('100%')
    expect(box.style.height).toBe('100%')
    expect(box.style.minHeight).toBe('')

    const expected = createImagesInMotionLayout(480, 640, ETestImages.length, {
      speedRange: [8, 18],
      angle: 12,
      overlayOpacity: 0.35,
    })
    const sheet = host.querySelector('.iim-sheet') as HTMLElement
    expect(host.querySelectorAll('.iim-track').length).toBeGreaterThan(0)
    expect(Number.parseFloat(sheet.style.height)).toBeCloseTo(expected.height, 4)
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
