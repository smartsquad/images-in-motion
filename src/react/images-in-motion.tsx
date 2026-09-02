import { useLayoutEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { mountImagesInMotion, type IImagesInMotionMountOptions } from '../js/mount'

const EHostStyle: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'transparent',
}

const EStageStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
}

export interface IImagesInMotionProps
  extends IImagesInMotionMountOptions, Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode
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
    <div {...props} style={{ ...EHostStyle, ...style }}>
      <div ref={stageRef} style={EStageStyle} aria-hidden />
      {children}
    </div>
  )
}
