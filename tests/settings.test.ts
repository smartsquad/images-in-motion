import { describe, expect, it } from 'vitest'
import {
  createImagesInMotionSettingsExport,
  type IImagesInMotionSettingsInput,
} from '../src/core'

const EInput: IImagesInMotionSettingsInput = {
  speedRange: [7, 16],
  angle: 14,
  tileWidth: 176,
  tileAspectRatio: 0.72,
  gap: 6,
  overlayEnabled: true,
  overlayOpacity: 0.38,
  overlayColor: '#1a2b3c',
  imageOrder: 'sequential',
  motionAxis: 'vertical',
  tileFit: 'fixed',
  gapColor: '#112233',
  gapOpacity: 0.8,
  width: 960,
  height: 540,
  imageCount: 12,
}

describe('createImagesInMotionSettingsExport', () => {
  it('returns only the props payload', () => {
    const settings = createImagesInMotionSettingsExport(EInput)

    expect(settings).toEqual({
      speedRange: [7, 16],
      angle: 14,
      tileWidth: 176,
      tileAspectRatio: 0.72,
      gap: 6,
      imageOrder: 'sequential',
      motionAxis: 'vertical',
      tileFit: 'fixed',
      gapColor: '#112233',
      gapOpacity: 0.8,
      overlayOpacity: 0.38,
      overlayColor: '#1a2b3c',
    })
    expect(JSON.stringify(settings)).toBe(
      '{"speedRange":[7,16],"angle":14,"tileWidth":176,"tileAspectRatio":0.72,"gap":6,"imageOrder":"sequential","motionAxis":"vertical","tileFit":"fixed","gapColor":"#112233","gapOpacity":0.8,"overlayOpacity":0.38,"overlayColor":"#1a2b3c"}',
    )
  })

  it('omits overlay fields when the overlay is disabled', () => {
    const settings = createImagesInMotionSettingsExport({
      ...EInput,
      overlayEnabled: false,
    })

    expect(settings).not.toHaveProperty('overlayOpacity')
    expect(settings).not.toHaveProperty('overlayColor')
    expect(Object.keys(settings)).toEqual([
      'speedRange',
      'angle',
      'tileWidth',
      'tileAspectRatio',
      'gap',
      'imageOrder',
      'motionAxis',
      'tileFit',
      'gapColor',
      'gapOpacity',
    ])
  })

  it('preserves an explicit zero overlay opacity', () => {
    const settings = createImagesInMotionSettingsExport({
      ...EInput,
      overlayOpacity: 0,
    })

    expect(settings).toHaveProperty('overlayOpacity', 0)
    expect(settings).toHaveProperty('overlayColor', '#1a2b3c')
  })

  it('exports fit, gap color, and motion without image values', () => {
    const settings = createImagesInMotionSettingsExport({
      ...EInput,
      imageOrder: 'random',
      motionAxis: 'horizontal',
      tileFit: 'dynamic',
      gapOpacity: 0,
      imageCount: 0,
    })

    expect(settings.imageOrder).toBe('random')
    expect(settings.motionAxis).toBe('horizontal')
    expect(settings.tileFit).toBe('dynamic')
    expect(settings.gapOpacity).toBe(0)
    expect(settings).not.toHaveProperty('preview')
    expect(settings).not.toHaveProperty('version')
    expect(settings).not.toHaveProperty('component')
    expect(JSON.stringify(settings)).not.toMatch(/"images"|"imageUrls"|https?:\/\//)
  })

  it('exports a hover flag only when exactly one mode is set', () => {
    expect(createImagesInMotionSettingsExport(EInput)).not.toHaveProperty('stopOnHover')
    expect(createImagesInMotionSettingsExport(EInput)).not.toHaveProperty('animateOnHover')

    expect(createImagesInMotionSettingsExport({ ...EInput, stopOnHover: true })).toMatchObject({
      stopOnHover: true,
    })
    expect(createImagesInMotionSettingsExport({ ...EInput, stopOnHover: true })).not.toHaveProperty('animateOnHover')

    expect(createImagesInMotionSettingsExport({ ...EInput, animateOnHover: true })).toMatchObject({
      animateOnHover: true,
    })
    expect(createImagesInMotionSettingsExport({ ...EInput, animateOnHover: true })).not.toHaveProperty('stopOnHover')

    const both = createImagesInMotionSettingsExport({
      ...EInput,
      stopOnHover: true,
      animateOnHover: true,
    })
    expect(both).not.toHaveProperty('stopOnHover')
    expect(both).not.toHaveProperty('animateOnHover')
  })
})
