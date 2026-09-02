import { describe, expect, it } from 'vitest'
import * as core from '../src/core'
import * as js from '../src/js'
import * as react from '../src/react'
import * as vue from '../src/vue'

describe('public entrypoints', () => {
  it('exports geometry and settings from core', () => {
    expect(typeof core.createImagesInMotionLayout).toBe('function')
    expect(typeof core.createImagesInMotionSettingsExport).toBe('function')
    expect(core.createImagesInMotionLayout(400, 700, 4).lanes.length).toBeGreaterThan(0)
  })

  it('exports mount and the custom element from js', () => {
    expect(typeof js.mountImagesInMotion).toBe('function')
    expect(typeof js.defineImagesInMotionElement).toBe('function')
    expect(typeof js.createImagesInMotionWebViewHtml).toBe('function')
    expect(js.ImagesInMotionElement).toBeDefined()
  })

  it('exports ImagesInMotion from the React and Vue bindings', () => {
    expect(react.ImagesInMotion).toBeTruthy()
    expect(react.ImagesInMotion).toBe(react.default)
    expect(vue.ImagesInMotion).toBeTruthy()
    expect(vue.ImagesInMotion).toBe(vue.default)
  })
})
