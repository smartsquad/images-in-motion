import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createImagesInMotionSettingsExport } from 'images-in-motion/core'
import { ImagesInMotion } from 'images-in-motion/react'
import { pickExampleImages } from '../src/example-images'
import { createImageObjectUrl, isImageFile } from '../src/js/svg'
import { appendSources, clampImageCount, removeSourceAt } from './image-library'
import { previewCornerRadiusCss } from './preview-frame'
import { formatRangeValue, parseRangeValue } from './range-value'
import './styles.css'

/** nf-md-delete U+F01B4. Requires Symbols Nerd Font: https://www.nerdfonts.com/font-downloads */
const ETrashGlyph = '\u{f01b4}'
/** nf-md-delete_sweep U+F05E9 */
const EClearGlyph = '\u{f05e9}'
/** nf-md-fullscreen U+F0293 */
const EFullscreenGlyph = '\u{f0293}'
/** nf-md-fullscreen_exit U+F0294 */
const EFullscreenExitGlyph = '\u{f0294}'
/** nf-md-image_size_select_large U+F0C8E */
const ECustomSizeGlyph = '\u{f0c8e}'
/** nf-md-image U+F02E9 */
const EImageGlyph = '\u{f02e9}'
/** nf-md-tune U+F062E */
const ETuneGlyph = '\u{f062e}'
/** nf-md-content_copy U+F018F */
const ECopyGlyph = '\u{f018f}'
/** nf-md-clipboard_check U+F014E */
const ECopiedGlyph = '\u{f014e}'
/** nf-md-restore U+F099B */
const ERestoreGlyph = '\u{f099b}'

const ECanvasMin = 1
const ECanvasMax = 10000
const EPresets = [
  { name: 'Portrait', width: 480, height: 640, glyph: '\u{f01a1}' }, // nf-md-crop_portrait U+F01A1
  { name: 'Square', width: 600, height: 600, glyph: '\u{f01a2}' }, // nf-md-crop_square U+F01A2
  { name: 'Landscape', width: 760, height: 460, glyph: '\u{f01a0}' }, // nf-md-crop_landscape U+F01A0
] as const
const EDefaults = {
  width: 480,
  height: 640,
  speedMin: 8,
  speedMax: 18,
  angle: 12,
  tileWidth: 168,
  tileHeight: 252,
  gap: 4,
  imageCount: 24,
  overlay: false,
  opacity: 0.35,
  overlayColor: '#000000',
  imageOrder: 'sequential' as 'sequential' | 'random',
  motionAxis: 'vertical' as 'vertical' | 'horizontal',
  tileFit: 'fixed' as 'auto' | 'static' | 'dynamic' | 'fixed',
  gapColor: '#000000',
  gapOpacity: 1,
  hoverPlayback: 'always' as 'always' | 'stop' | 'animate',
  previewRadius: 0,
}
const ECopySettingsLabel = 'Copy settings to clipboard'
const ECopyButtonLabel = 'Copy'
const ECopiedLabel = 'Copied'
const EFullscreenEvents = ['fullscreenchange', 'webkitfullscreenchange']
type TExportStatus = 'idle' | 'success' | 'error'

interface ILegacyFullscreenElement {
  webkitRequestFullscreen?: () => Promise<void> | void
}

interface ILegacyFullscreenDocument {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

function getFullscreenElement(): Element | null {
  const doc = document as Document & ILegacyFullscreenDocument
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

function subscribeFullscreen(onChange: () => void): () => void {
  EFullscreenEvents.forEach((name) => document.addEventListener(name, onChange))
  return () => EFullscreenEvents.forEach((name) => document.removeEventListener(name, onChange))
}

async function requestPreviewFullscreen(element: HTMLElement): Promise<void> {
  if (element.requestFullscreen) {
    await element.requestFullscreen()
    return
  }
  const legacy = element as HTMLElement & ILegacyFullscreenElement
  if (legacy.webkitRequestFullscreen) {
    await legacy.webkitRequestFullscreen()
  }
}

async function exitPreviewFullscreen(): Promise<void> {
  if (document.exitFullscreen && document.fullscreenElement) {
    await document.exitFullscreen()
    return
  }
  const doc = document as Document & ILegacyFullscreenDocument
  if (doc.webkitExitFullscreen && doc.webkitFullscreenElement) {
    await doc.webkitExitFullscreen()
  }
}

interface IRangeProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  disabled?: boolean
  onChange: (value: number) => void
}

function Range({ label, value, min, max, step = 1, unit = '', disabled, onChange }: IRangeProps) {
  const id = useId()
  const sliderId = `${id}-slider`
  const [draft, setDraft] = useState(() => formatRangeValue(value, step))
  const draftRef = useRef(draft)
  const focusedRef = useRef(false)
  const committedRef = useRef(value)
  draftRef.current = draft
  committedRef.current = value

  useEffect(() => {
    if (disabled || !focusedRef.current) {
      setDraft(formatRangeValue(value, step))
    }
  }, [value, step, disabled])

  const commit = (raw: string) => {
    const next = parseRangeValue(raw, min, max, step)
    if (next === null) {
      const restored = formatRangeValue(committedRef.current, step)
      draftRef.current = restored
      setDraft(restored)
      return
    }
    const formatted = formatRangeValue(next, step)
    draftRef.current = formatted
    setDraft(formatted)
    if (next !== committedRef.current) {
      onChange(next)
    }
  }

  const cancel = () => {
    const restored = formatRangeValue(committedRef.current, step)
    draftRef.current = restored
    setDraft(restored)
  }

  return (
    <div className="range-field">
      <span className="field-heading">
        <label htmlFor={sliderId}>{label}</label>
        <label className="range-value">
          <input
            className="range-value-input"
            type="text"
            inputMode={min < 0 || step % 1 !== 0 ? 'decimal' : 'numeric'}
            enterKeyHint="done"
            autoComplete="off"
            spellCheck={false}
            aria-label={`${label} value`}
            disabled={disabled}
            value={draft}
            style={{ width: `${Math.max(draft.length, 1)}ch` }}
            onChange={(event) => setDraft(event.currentTarget.value)}
            onFocus={(event) => {
              focusedRef.current = true
              event.currentTarget.select()
            }}
            onBlur={() => {
              focusedRef.current = false
              commit(draftRef.current)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                commit(draftRef.current)
                event.currentTarget.blur()
              }
              if (event.key === 'Escape') {
                event.preventDefault()
                cancel()
                event.currentTarget.blur()
              }
            }}
          />
          {unit ? <span className="range-value-unit">{unit}</span> : null}
        </label>
      </span>
      <input id={sliderId} aria-label={label} type="range" min={min} max={max} step={step} value={value} disabled={disabled} onInput={(event) => onChange(Number(event.currentTarget.value))} />
    </div>
  )
}

interface IDimensionFieldProps {
  label: string
  value: number
  min: number
  max: number
  disabled?: boolean
  onChange: (value: number) => void
}

function DimensionField({ label, value, min, max, disabled, onChange }: IDimensionFieldProps) {
  const [draft, setDraft] = useState(() => formatRangeValue(value, 1))
  const draftRef = useRef(draft)
  const focusedRef = useRef(false)
  const committedRef = useRef(value)
  draftRef.current = draft
  committedRef.current = value

  useEffect(() => {
    if (disabled || !focusedRef.current) {
      setDraft(formatRangeValue(value, 1))
    }
  }, [value, disabled])

  const commit = (raw: string) => {
    const next = parseRangeValue(raw, min, max, 1)
    if (next === null) {
      const restored = formatRangeValue(committedRef.current, 1)
      draftRef.current = restored
      setDraft(restored)
      return
    }
    const formatted = formatRangeValue(next, 1)
    draftRef.current = formatted
    setDraft(formatted)
    if (next !== committedRef.current) {
      onChange(next)
    }
  }

  const cancel = () => {
    const restored = formatRangeValue(committedRef.current, 1)
    draftRef.current = restored
    setDraft(restored)
  }

  return (
    <label>
      {label}
      <input
        aria-label={label}
        type="text"
        inputMode="numeric"
        enterKeyHint="done"
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        value={draft}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onFocus={(event) => {
          focusedRef.current = true
          event.currentTarget.select()
        }}
        onBlur={() => {
          focusedRef.current = false
          commit(draftRef.current)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            commit(draftRef.current)
            event.currentTarget.blur()
          }
          if (event.key === 'Escape') {
            event.preventDefault()
            cancel()
            event.currentTarget.blur()
          }
        }}
      />
    </label>
  )
}

function copyTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => copyTextWithExecCommand(text))
  }
  return copyTextWithExecCommand(text)
}

function copyTextWithExecCommand(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.left = '-9999px'
    document.body.append(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    if (ok) {
      resolve()
      return
    }
    reject(new Error('copy failed'))
  })
}

function htmlIsDark(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
}

export function StudioApp({ embed = false }: { embed?: boolean }) {
  const [settings, setSettings] = useState(EDefaults)
  const [paused, setPaused] = useState(false)
  const [stageLight, setStageLight] = useState(() => (embed ? !htmlIsDark() : true))
  const [stageImage, setStageImage] = useState<string | undefined>()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [library, setLibrary] = useState<string[]>(() => pickExampleImages(24).images)
  const [exportStatus, setExportStatus] = useState<TExportStatus>('idle')
  const panelRef = useRef<HTMLElement>(null)
  const libraryRef = useRef(library)
  libraryRef.current = library
  const images = useMemo(
    () => library.slice(0, clampImageCount(settings.imageCount, library.length)),
    [library, settings.imageCount],
  )
  const isFlush = isFullscreen
  const fillStage = embed || !isFullscreen || isFlush
  const namedCanvasPreset = EPresets.find((preset) => preset.width === settings.width && preset.height === settings.height)
  const customCanvasSize = !isFullscreen && namedCanvasPreset === undefined
  const frameStyle = useMemo<CSSProperties>(() => {
    if (isFlush) {
      return { width: '100%', height: '100%', borderRadius: 0 }
    }
    return {
      borderRadius: previewCornerRadiusCss(settings.previewRadius, settings.width, settings.height),
      ['--preview-w' as string]: String(settings.width),
      ['--preview-h' as string]: String(settings.height),
    }
  }, [isFlush, settings.width, settings.height, settings.previewRadius])
  useEffect(() => {
    if (!embed) {
      return
    }
    const root = document.documentElement
    const sync = () => {
      setStageLight(!root.classList.contains('dark'))
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [embed])
  useEffect(() => () => {
    libraryRef.current
      .filter((src) => src.startsWith('blob:'))
      .forEach((url) => URL.revokeObjectURL(url))
  }, [])
  useEffect(() => {
    return () => {
      if (stageImage?.startsWith('blob:')) {
        URL.revokeObjectURL(stageImage)
      }
    }
  }, [stageImage])
  useEffect(() => {
    const sync = () => {
      setIsFullscreen(getFullscreenElement() === panelRef.current)
    }
    return subscribeFullscreen(sync)
  }, [])
  useEffect(() => {
    if (exportStatus === 'idle') {
      return
    }
    const timer = window.setTimeout(() => setExportStatus('idle'), 1800)
    return () => window.clearTimeout(timer)
  }, [exportStatus])

  const update = (key: keyof typeof EDefaults, value: number | boolean | string) => setSettings((current) => ({ ...current, [key]: value }))
  const reset = () => {
    libraryRef.current
      .filter((src) => src.startsWith('blob:'))
      .forEach((url) => URL.revokeObjectURL(url))
    setSettings(EDefaults)
    setPaused(false)
    setStageLight(true)
    setStageImage(undefined)
    setLibrary(pickExampleImages(24).images)
    setExportStatus('idle')
  }
  const removeImage = (index: number) => {
    const src = library[index]
    if (src?.startsWith('blob:')) {
      URL.revokeObjectURL(src)
    }
    const next = removeSourceAt(library, index)
    setLibrary(next)
    setSettings((current) => ({
      ...current,
      imageCount: clampImageCount(current.imageCount, next.length),
    }))
  }
  const clearImages = () => {
    library
      .filter((src) => src.startsWith('blob:'))
      .forEach((url) => URL.revokeObjectURL(url))
    setLibrary([])
    update('imageCount', 0)
  }
  const fullscreenLabel = isFullscreen ? 'Exit full screen' : 'Full screen'
  const toggleFullscreen = () => {
    const panel = panelRef.current
    if (!panel) {
      return
    }
    if (getFullscreenElement() === panel) {
      void exitPreviewFullscreen().catch(() => undefined)
      return
    }
    void requestPreviewFullscreen(panel).catch(() => undefined)
  }
  const copySettings = () => {
    const configuration = createImagesInMotionSettingsExport({
      speedRange: [settings.speedMin, settings.speedMax],
      angle: settings.angle,
      tileWidth: settings.tileWidth,
      tileAspectRatio: settings.tileWidth / settings.tileHeight,
      gap: settings.gap,
      overlayEnabled: settings.overlay,
      overlayOpacity: settings.opacity,
      overlayColor: settings.overlayColor,
      imageOrder: settings.imageOrder,
      motionAxis: settings.motionAxis,
      tileFit: settings.tileFit,
      gapColor: settings.gapColor,
      gapOpacity: settings.gapOpacity,
      width: settings.width,
      height: settings.height,
      imageCount: images.length,
      stopOnHover: settings.hoverPlayback === 'stop',
      animateOnHover: settings.hoverPlayback === 'animate',
    })
    const payload = `${JSON.stringify(configuration, null, 2)}\n`
    void copyTextToClipboard(payload).then(
      () => setExportStatus('success'),
      () => setExportStatus('error'),
    )
  }

  const copyTitle = exportStatus === 'success' ? ECopiedLabel : ECopySettingsLabel
  const copyLabel = exportStatus === 'success' ? ECopiedLabel : ECopyButtonLabel
  const copyGlyph = exportStatus === 'success' ? ECopiedGlyph : ECopyGlyph
  const exportFeedback = exportStatus === 'success'
    ? 'Settings copied to clipboard.'
    : exportStatus === 'error'
      ? 'Could not copy settings.'
      : ''

  return (
    <main className={embed ? 'studio-root is-embedded' : 'studio-root'}>
      {embed ? null : (
        <header className="page-header">
          <a className="wordmark" href="./">images in motion<span className="lab-tag">STUDIO</span></a>
          <span className="local-note">Open source · GitHub Pages</span>
        </header>
      )}
      {embed ? null : (
        <section className="intro">
          <div><p className="eyebrow">01 / MOTION STUDY</p><h1>Images in motion.</h1></div>
          <p>Independent columns. Opposite directions.<br />A continuous pattern, in any proportion.</p>
        </section>
      )}
      <div className="workspace">
        <section
          ref={panelRef}
          className={`preview-panel${stageLight ? '' : ' is-dark-stage'}${isFullscreen ? ' is-fullscreen' : ''}${isFlush ? ' is-flush' : ''}${fillStage ? ' is-fill' : ''}`}
          aria-label="Pattern preview"
        >
          <div className="preview-toolbar">
            <span className="playback-status"><span className={paused ? 'status-dot is-paused' : 'status-dot'} />{paused ? 'PAUSED' : 'PLAYING'}<span aria-hidden="true"> · </span>{settings.width} × {settings.height}</span>
            <div className="preview-toolbar-actions">
              {!isFullscreen ? (
                <button
                  type="button"
                  className="quiet-button preview-bg-toggle"
                  aria-label={stageLight ? 'Dark preview background' : 'Light preview background'}
                  aria-pressed={!stageLight}
                  title={stageLight ? 'Dark preview background' : 'Light preview background'}
                  onClick={() => setStageLight((value) => !value)}
                >
                  <span className="preview-bg-swatch" aria-hidden="true" />
                  {stageLight ? 'Light' : 'Dark'}
                </button>
              ) : null}
              <button
                type="button"
                className="quiet-button"
                title={paused ? 'Resume animation' : 'Pause animation'}
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? 'Resume animation' : 'Pause animation'}
              </button>
              <button
                type="button"
                className="quiet-button"
                title={fullscreenLabel}
                aria-pressed={isFullscreen}
                onClick={toggleFullscreen}
              >
                {fullscreenLabel}
              </button>
            </div>
          </div>
          <div className="stage" style={stageImage ? { backgroundImage: `url(${JSON.stringify(stageImage)})` } : undefined}>
            <div className="pattern-frame" style={frameStyle}>
              <ImagesInMotion
                images={images}
                speedRange={[settings.speedMin, settings.speedMax]}
                angle={settings.angle}
                tileWidth={settings.tileWidth}
                tileAspectRatio={settings.tileWidth / settings.tileHeight}
                gap={settings.gap}
                overlayOpacity={settings.overlay ? settings.opacity : undefined}
                overlayColor={settings.overlay ? settings.overlayColor : undefined}
                imageOrder={settings.imageOrder}
                motionAxis={settings.motionAxis}
                tileFit={settings.tileFit}
                gapColor={settings.gapColor}
                gapOpacity={settings.gapOpacity}
                paused={paused}
                stopOnHover={settings.hoverPlayback === 'stop'}
                animateOnHover={settings.hoverPlayback === 'animate'}
                data-testid="images-in-motion.preview"
              />
              {images.length === 0 && <div className="empty-state">No images selected<span>The component remains empty.</span></div>}
            </div>
          </div>
          <footer className="preview-footer"><span>{settings.width} × {settings.height} · Shrinks if the stage is smaller</span><span>{images.length} image{images.length === 1 ? '' : 's'} · {settings.angle}°</span></footer>
        </section>
        <form className="controls" onSubmit={(event) => event.preventDefault()}>
          <div className="controls-heading">
            <h2>
              <span className="nf" aria-hidden="true">{ETuneGlyph}</span>
              Make it yours
            </h2>
            <div className="controls-actions">
              <button type="button" className="text-button" title="Reset" onClick={reset}>
                <span className="nf" aria-hidden="true">{ERestoreGlyph}</span>
                Reset
              </button>
              <button type="button" className="export-button" title={copyTitle} aria-label={copyTitle} onClick={copySettings}>
                <span className="nf" aria-hidden="true">{copyGlyph}</span>
                {copyLabel}
              </button>
            </div>
          </div>
          <span className="export-feedback" role="status" aria-live="polite">{exportFeedback}</span>
          <fieldset className="canvas-fieldset">
            <legend>Canvas preview</legend>
            <p className="fieldset-lead">Preview host only: width and height are the canvas size, then shrink to fit the stage. Corners are circular. Full screen opens the preview on the whole screen. CSS on this page, not library props, omitted from JSON.</p>
            <div className={`preset-buttons is-icons${customCanvasSize ? ' has-custom' : ''}`}>
              {EPresets.map(({ name, width, height, glyph }) => {
                const label = `${name} ${width} × ${height}`
                return (
                  <button
                    key={name}
                    type="button"
                    title={label}
                    aria-label={label}
                    aria-pressed={!isFullscreen && namedCanvasPreset?.name === name}
                    onClick={() => {
                      setSettings((current) => ({ ...current, width, height }))
                    }}
                  >
                    <span className="nf" aria-hidden="true">{glyph}</span>
                  </button>
                )
              })}
              <button
                type="button"
                title={fullscreenLabel}
                aria-label={fullscreenLabel}
                aria-pressed={isFullscreen}
                onClick={toggleFullscreen}
              >
                <span className="nf" aria-hidden="true">{isFullscreen ? EFullscreenExitGlyph : EFullscreenGlyph}</span>
              </button>
              <button
                type="button"
                className="preset-custom"
                title={`Custom size ${settings.width} × ${settings.height}`}
                aria-label={`Custom size ${settings.width} × ${settings.height}`}
                aria-pressed={customCanvasSize}
                aria-hidden={!customCanvasSize}
                tabIndex={customCanvasSize ? 0 : -1}
                inert={!customCanvasSize}
              >
                <span className="nf" aria-hidden="true">{ECustomSizeGlyph}</span>
              </button>
            </div>
            <div className="dimensions">
              <DimensionField label="Width" value={settings.width} min={ECanvasMin} max={ECanvasMax} disabled={isFullscreen} onChange={(value) => update('width', value)} />
              <DimensionField label="Height" value={settings.height} min={ECanvasMin} max={ECanvasMax} disabled={isFullscreen} onChange={(value) => update('height', value)} />
            </div>
            <div className="radius-tools">
              <Range label="Rounded corners" value={settings.previewRadius} min={0} max={100} unit="%" disabled={isFullscreen} onChange={(value) => update('previewRadius', value)} />
              <button
                type="button"
                className="radius-full"
                title="100% rounded corners"
                aria-pressed={settings.previewRadius === 100}
                disabled={isFullscreen}
                onClick={() => update('previewRadius', 100)}
              >
                100%
              </button>
            </div>
            <div className="stage-image-tools">
              <label className="upload-button" title="Choose preview background image">
                <span className="nf" aria-hidden="true">{EImageGlyph}</span>
                {' '}
                {stageImage ? 'Change background image' : 'Background image'}
                <input
                  aria-label="Choose preview background image"
                  type="file"
                  accept="image/*,image/svg+xml,.svg"
                  onChange={(event) => {
                    const file = Array.from(event.target.files ?? []).find(isImageFile)
                    event.target.value = ''
                    if (!file) {
                      return
                    }
                    void createImageObjectUrl(file).then((url) => setStageImage(url))
                  }}
                />
              </label>
              <button
                type="button"
                className="text-button image-clear"
                title="Remove background image"
                disabled={!stageImage}
                onClick={() => setStageImage(undefined)}
              >
                <span className="nf" aria-hidden="true">{EClearGlyph}</span>
                Remove
              </button>
            </div>
          </fieldset>
          <fieldset>
            <legend>Movement</legend>
            <div className="preset-buttons is-pair">
              <button type="button" title="Vertical" aria-pressed={settings.motionAxis === 'vertical'} onClick={() => update('motionAxis', 'vertical')}>Vertical</button>
              <button type="button" title="Horizontal" aria-pressed={settings.motionAxis === 'horizontal'} onClick={() => update('motionAxis', 'horizontal')}>Horizontal</button>
            </div>
            <span className="field-heading"><span>Hover</span></span>
            <div className="preset-buttons is-triple">
              <button type="button" title="Always" aria-pressed={settings.hoverPlayback === 'always'} onClick={() => update('hoverPlayback', 'always')}>Always</button>
              <button type="button" title="Stop on hover" aria-pressed={settings.hoverPlayback === 'stop'} onClick={() => update('hoverPlayback', 'stop')}>Stop on hover</button>
              <button type="button" title="Animate on hover" aria-pressed={settings.hoverPlayback === 'animate'} onClick={() => update('hoverPlayback', 'animate')}>Animate on hover</button>
            </div>
            <Range label="Minimum speed" value={settings.speedMin} min={1} max={40} unit=" px/s" onChange={(value) => setSettings((current) => ({ ...current, speedMin: value, speedMax: Math.max(value, current.speedMax) }))} />
            <Range label="Maximum speed" value={settings.speedMax} min={1} max={40} unit=" px/s" onChange={(value) => setSettings((current) => ({ ...current, speedMax: value, speedMin: Math.min(value, current.speedMin) }))} />
            <Range label="Inclination" value={settings.angle} min={-90} max={90} unit="°" onChange={(value) => update('angle', value)} />
          </fieldset>
          <fieldset>
            <legend>Composition</legend>
            <span className="field-heading"><span>Image fit</span></span>
            <div className="preset-buttons is-quad">
              {(['auto', 'static', 'dynamic', 'fixed'] as const).map((fit) => {
                const label = fit === 'auto' ? 'Auto' : fit === 'static' ? 'Static' : fit === 'dynamic' ? 'Dynamic' : 'Fixed'
                return (
                  <button key={fit} type="button" title={label} aria-pressed={settings.tileFit === fit} onClick={() => update('tileFit', fit)}>{label}</button>
                )
              })}
            </div>
            <Range label="Tile width" value={settings.tileWidth} min={64} max={320} unit=" px" onChange={(value) => update('tileWidth', value)} />
            {settings.tileFit === 'fixed' && (
              <Range label="Tile height" value={settings.tileHeight} min={64} max={480} unit=" px" onChange={(value) => update('tileHeight', value)} />
            )}
            <Range label="Gap" value={settings.gap} min={0} max={24} unit=" px" onChange={(value) => update('gap', value)} />
            <label className="color-field">
              Gap color
              <input aria-label="Gap color" type="color" value={settings.gapColor} onChange={(event) => update('gapColor', event.target.value)} />
            </label>
            <Range label="Gap opacity" value={settings.gapOpacity} min={0} max={1} step={0.05} onChange={(value) => update('gapOpacity', value)} />
            <label className="checkbox-field"><input type="checkbox" checked={settings.overlay} onChange={(event) => update('overlay', event.target.checked)} />Overlay</label>
            <label className="color-field">
              Overlay color
              <input aria-label="Overlay color" type="color" value={settings.overlayColor} disabled={!settings.overlay} onChange={(event) => update('overlayColor', event.target.value)} />
            </label>
            <Range label="Overlay opacity" value={settings.opacity} min={0} max={1} step={0.05} disabled={!settings.overlay} onChange={(value) => update('opacity', value)} />
          </fieldset>
          <fieldset>
            <legend>Images</legend>
            <div className="preset-buttons is-pair">
              <button type="button" title="Sequential" aria-pressed={settings.imageOrder === 'sequential'} onClick={() => update('imageOrder', 'sequential')}>Sequential</button>
              <button type="button" title="Random order" aria-pressed={settings.imageOrder === 'random'} onClick={() => update('imageOrder', 'random')}>Random order</button>
            </div>
            <Range
              label="Image count"
              value={clampImageCount(settings.imageCount, library.length)}
              min={0}
              max={Math.max(library.length, 1)}
              disabled={library.length === 0}
              onChange={(value) => update('imageCount', value)}
            />
            <div className="image-thumbnails">
              {library.map((src, index) => (
                <button
                  key={`${index}-${src}`}
                  type="button"
                  className={`image-thumb${index >= settings.imageCount ? ' is-unused' : ''}`}
                  title={`Remove image ${index + 1}`}
                  aria-label={`Remove image ${index + 1}`}
                  onClick={() => removeImage(index)}
                >
                  <img src={src} alt="" />
                  <span className="image-thumb-remove nf" aria-hidden="true">{ETrashGlyph}</span>
                </button>
              ))}
            </div>
            <div className="image-actions">
              <label className="upload-button" title="Choose your images">Choose your images<input aria-label="Choose your images" type="file" accept="image/*,image/svg+xml,.svg" multiple onChange={(event) => {
                const files = Array.from(event.target.files ?? []).filter(isImageFile)
                event.target.value = ''
                if (files.length === 0) {
                  return
                }
                void Promise.all(files.map(createImageObjectUrl)).then((urls) => {
                  setLibrary((current) => {
                    const next = appendSources(current, urls)
                    setSettings((settingsCurrent) => ({ ...settingsCurrent, imageCount: next.length }))
                    return next
                  })
                })
              }} /></label>
              <button type="button" className="text-button image-clear" title="Clear all" disabled={library.length === 0} onClick={clearImages}>
                <span className="nf" aria-hidden="true">{EClearGlyph}</span>
                Clear all
              </button>
            </div>
            <p className="help-text">Images stay in this browser. Hover a card to remove it. Reset restores the examples.</p>
          </fieldset>
        </form>
      </div>
      <p className="page-note">Reduced motion is respected automatically. Pause eases to a freeze. Stop on hover and animate on hover cancel each other. Both off keeps continuous motion.</p>
    </main>
  )
}
