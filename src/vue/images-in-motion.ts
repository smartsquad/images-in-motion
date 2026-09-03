import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type CSSProperties,
  type PropType,
  type SetupContext,
} from 'vue'
import { cssBoxSize } from '../js/host-box'
import { mountImagesInMotion, type IImagesInMotionHandle, type IImagesInMotionMountOptions } from '../js/mount'
import type { TImagesInMotionImageOrder, TImagesInMotionMotionAxis, TImagesInMotionTileFit } from '../core'

const EHostStyle: CSSProperties = {
  display: 'block',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'transparent',
  width: '100%',
  height: '100%',
}

const EStageStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
}

export type TImagesInMotionProps = IImagesInMotionMountOptions

function readOptions(props: TImagesInMotionProps): IImagesInMotionMountOptions {
  return {
    images: props.images,
    speedRange: props.speedRange,
    angle: props.angle,
    tileWidth: props.tileWidth,
    tileAspectRatio: props.tileAspectRatio,
    gap: props.gap,
    overlayOpacity: props.overlayOpacity,
    overlayColor: props.overlayColor,
    imageOrder: props.imageOrder,
    motionAxis: props.motionAxis,
    tileFit: props.tileFit,
    gapColor: props.gapColor,
    gapOpacity: props.gapOpacity,
    paused: props.paused,
    stopOnHover: props.stopOnHover,
    animateOnHover: props.animateOnHover,
  }
}

export const ImagesInMotion = defineComponent(
  (props: TImagesInMotionProps, { slots, attrs }: SetupContext) => {
    const stage = ref<HTMLElement | null>(null)
    let handle: IImagesInMotionHandle | undefined

    onMounted(() => {
      if (!stage.value) {
        return
      }
      handle = mountImagesInMotion(stage.value, readOptions(props))
    })

    watch(
      () => readOptions(props),
      (options) => {
        handle?.update(options)
      },
      { deep: true },
    )

    onBeforeUnmount(() => {
      handle?.destroy()
      handle = undefined
    })

    return () => {
      const { class: className, style, width, height, ...rest } = attrs
      return h('div', {
        ...rest,
        class: className,
        style: [
          EHostStyle,
          {
            width: cssBoxSize(width) ?? EHostStyle.width,
            height: cssBoxSize(height) ?? EHostStyle.height,
          },
          style as CSSProperties | undefined,
        ],
      }, [
        h('div', {
          ref: stage,
          'aria-hidden': 'true',
          style: EStageStyle,
        }),
        slots.default?.(),
      ])
    }
  },
  {
    name: 'ImagesInMotion',
    inheritAttrs: false,
    props: {
      images: { type: Array as PropType<readonly string[]>, required: true },
      speedRange: { type: Array as unknown as PropType<readonly [number, number]>, default: undefined },
      angle: { type: Number, default: undefined },
      tileWidth: { type: Number, default: undefined },
      tileAspectRatio: { type: Number, default: undefined },
      gap: { type: Number, default: undefined },
      overlayOpacity: { type: Number, default: undefined },
      overlayColor: { type: String, default: undefined },
      imageOrder: { type: String as PropType<TImagesInMotionImageOrder>, default: undefined },
      motionAxis: { type: String as PropType<TImagesInMotionMotionAxis>, default: undefined },
      tileFit: { type: String as PropType<TImagesInMotionTileFit>, default: undefined },
      gapColor: { type: String, default: undefined },
      gapOpacity: { type: Number, default: undefined },
      paused: { type: Boolean, default: false },
      stopOnHover: { type: Boolean, default: false },
      animateOnHover: { type: Boolean, default: false },
    },
  },
)
