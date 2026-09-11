import type {
  IImagesInMotionOptions,
  TImagesInMotionImageOrder,
  TImagesInMotionMotionAxis,
  TImagesInMotionTileFit,
} from './layout'
import { resolveHoverPlayback } from './playback'

type TImagesInMotionRequiredOptions = Required<
  Omit<IImagesInMotionOptions, 'overlayOpacity' | 'overlayColor' | 'imageOrder' | 'motionAxis' | 'tileFit' | 'imageAspects' | 'gapColor' | 'gapOpacity'>
>

export interface IImagesInMotionSettingsInput
  extends TImagesInMotionRequiredOptions {
  overlayEnabled: boolean
  overlayOpacity: number
  overlayColor: string
  imageOrder: TImagesInMotionImageOrder
  motionAxis: TImagesInMotionMotionAxis
  tileFit: TImagesInMotionTileFit
  gapColor: string
  gapOpacity: number
  width: number
  height: number
  imageCount: number
  stopOnHover?: boolean
  animateOnHover?: boolean
}

export type IImagesInMotionSettingsExport = TImagesInMotionRequiredOptions & {
  overlayOpacity?: number
  overlayColor?: string
  imageOrder: TImagesInMotionImageOrder
  motionAxis: TImagesInMotionMotionAxis
  tileFit: TImagesInMotionTileFit
  gapColor: string
  gapOpacity: number
  stopOnHover?: true
  animateOnHover?: true
}

/** Image-free props object for the studio clipboard copy. */
export function createImagesInMotionSettingsExport(
  input: IImagesInMotionSettingsInput,
): IImagesInMotionSettingsExport {
  const tileFit = input.tileFit === 'auto' || input.tileFit === 'static' || input.tileFit === 'dynamic'
    ? input.tileFit
    : 'fixed'
  const hoverPlayback = resolveHoverPlayback(input.stopOnHover, input.animateOnHover)
  return {
    speedRange: [input.speedRange[0], input.speedRange[1]],
    angle: input.angle,
    tileWidth: input.tileWidth,
    tileAspectRatio: input.tileAspectRatio,
    gap: input.gap,
    imageOrder: input.imageOrder === 'random' ? 'random' : 'sequential',
    motionAxis: input.motionAxis === 'horizontal' ? 'horizontal' : 'vertical',
    tileFit,
    gapColor: input.gapColor,
    gapOpacity: input.gapOpacity,
    ...(input.overlayEnabled
      ? { overlayOpacity: input.overlayOpacity, overlayColor: input.overlayColor }
      : {}),
    ...(hoverPlayback === 'stop' ? { stopOnHover: true as const } : {}),
    ...(hoverPlayback === 'animate' ? { animateOnHover: true as const } : {}),
  }
}
