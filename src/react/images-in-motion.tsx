import { useLayoutEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { cssBoxSize } from '../js/host-box'
import { mountImagesInMotion, type IImagesInMotionMountOptions } from '../js/mount'

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

export interface IImagesInMotionProps
  extends IImagesInMotionMountOptions, Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'width' | 'height'> {
  children?: ReactNode
  /** Host CSS width. Number is px. Strings such as `30rem` pass through. */
  width?: number | string
  /** Host CSS height. Number is px. Strings such as `40rem` pass through. */
  height?: number | string
}

export function ImagesInMotion({
  images,
  speedRange,
  angle,
  tileWidth,
  tileAspectRatio,
  gap,
  overlayOpacity,
  overlayColor,
  imageOrder,
  motionAxis,
  tileFit,
  gapColor,
  gapOpacity,
  paused = false,
  stopOnHover = false,
  animateOnHover = false,
  style,
  width,
  height,
  children,
  ...props
}: IImagesInMotionProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<ReturnType<typeof mountImagesInMotion>>(undefined)

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) {
      return
    }
    const handle = mountImagesInMotion(stage, {
      images,
      speedRange,
      angle,
      tileWidth,
      tileAspectRatio,
      gap,
      overlayOpacity,
      overlayColor,
      imageOrder,
      motionAxis,
      tileFit,
      gapColor,
      gapOpacity,
      paused,
      stopOnHover,
      animateOnHover,
    })
    handleRef.current = handle
    return () => {
      handle.destroy()
      handleRef.current = undefined
    }
  }, [])

  useLayoutEffect(() => {
    handleRef.current?.update({
      images,
      speedRange,
      angle,
      tileWidth,
      tileAspectRatio,
      gap,
      overlayOpacity,
      overlayColor,
      imageOrder,
      motionAxis,
      tileFit,
      gapColor,
      gapOpacity,
      paused,
      stopOnHover,
      animateOnHover,
    })
  }, [images, speedRange, angle, tileWidth, tileAspectRatio, gap, overlayOpacity, overlayColor, imageOrder, motionAxis, tileFit, gapColor, gapOpacity, paused, stopOnHover, animateOnHover])

  return (
    <div
      {...props}
      style={{
        ...EHostStyle,
        width: cssBoxSize(width) ?? EHostStyle.width,
        height: cssBoxSize(height) ?? EHostStyle.height,
        ...style,
      }}
    >
      <div ref={stageRef} style={EStageStyle} aria-hidden />
      {children}
    </div>
  )
}
