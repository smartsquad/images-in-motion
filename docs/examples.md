# Examples

Live Vue mounts of the same renderer. The docs stage is sized by this page, not by a library default. Expo and NativeScript host that same CSS in a WebView. Images are Unsplash URLs, never blobs. Open the [studio](/studio/) to change canvas size and copy settings. App mounts fill the available box and size the mosaic to `20rem` by `20rem`. See [API](/api#size).

## Simple vertical

Straight vertical lanes. No inclination.

<div class="study">

<MotionDemo
  :angle="0"
  motion-axis="vertical"
  caption="Vertical columns, 0°."
/>

```js
mountImagesInMotion(el, {
  images,
  speedRange: [8, 18],
  angle: 0,
  motionAxis: 'vertical',
  imageOrder: 'sequential',
  tileFit: 'fixed',
})
```

</div>

## Simple horizontal

Straight horizontal rows. No inclination.

<div class="study">

<MotionDemo
  :angle="0"
  motion-axis="horizontal"
  caption="Horizontal rows, 0°."
/>

```js
mountImagesInMotion(el, {
  images,
  speedRange: [8, 18],
  angle: 0,
  motionAxis: 'horizontal',
  imageOrder: 'sequential',
  tileFit: 'fixed',
})
```

</div>

## Columns

Default study: independent vertical lanes, 12°, sequential cycle.

<div class="study">

<MotionDemo caption="Vertical columns, 12°, sequential." />

```js
mountImagesInMotion(el, {
  images,
  speedRange: [8, 18],
  angle: 12,
  motionAxis: 'vertical',
  imageOrder: 'sequential',
  tileFit: 'fixed',
})
```

</div>

## Film strip

Horizontal rows, shallow tilt, wide frame. Neighbours still run opposite ways.

<div class="study is-wide">

<MotionDemo
  motion-axis="horizontal"
  :angle="6"
  :speed-range="[14, 28]"
  :tile-width="220"
  :tile-aspect-ratio="1.5"
  :gap="6"
  ratio="21 / 9"
  caption="Rows, 6°, wider tiles."
/>

```js
mountImagesInMotion(el, {
  images,
  speedRange: [14, 28],
  angle: 6,
  motionAxis: 'horizontal',
  tileWidth: 220,
  tileAspectRatio: 1.5,
})
```

</div>

## Gold wash

Steeper sheet, random order, studio gold over the tiles.

<div class="study">

<MotionDemo
  :angle="24"
  :speed-range="[6, 14]"
  :overlay-opacity="0.42"
  overlay-color="#A59050"
  image-order="random"
  :gap="8"
  gap-color="#141313"
  caption="24°, random order, gold overlay."
/>

```js
mountImagesInMotion(el, {
  images,
  angle: 24,
  speedRange: [6, 14],
  overlayOpacity: 0.42,
  overlayColor: '#A59050',
  imageOrder: 'random',
  gap: 8,
  gapColor: '#141313',
})
```

</div>

## Paper gutters

Cream gap on a paper stage. The sheet is still dark; the joints are not.

<div class="study">

<MotionDemo
  :angle="10"
  :gap="10"
  gap-color="#F3EFE8"
  :gap-opacity="1"
  stage="#F3EFE8"
  :tile-width="150"
  caption="Gap color matches the paper."
/>

```js
mountImagesInMotion(el, {
  images,
  angle: 10,
  gap: 10,
  gapColor: '#F3EFE8',
  gapOpacity: 1,
})
```

</div>

## Dynamic height

Every tile is stretched to the tallest fitted height. Mixed Unsplash crops stay one row tall.

<div class="study">

<MotionDemo
  tile-fit="dynamic"
  :angle="14"
  :tile-width="132"
  :gap="3"
  :speed-range="[10, 20]"
  caption="Dynamic fit: max height, others stretch."
/>

```js
mountImagesInMotion(el, {
  images,
  tileFit: 'dynamic',
  tileWidth: 132,
  angle: 14,
  speedRange: [10, 20],
})
```

</div>

## Dense drift

Small tiles, tight gap, faster lanes. Auto fit keeps each photo's aspect.

<div class="study">

<MotionDemo
  tile-fit="auto"
  :tile-width="96"
  :gap="2"
  :angle="-8"
  :speed-range="[18, 36]"
  image-order="random"
  caption="Auto fit, negative tilt, higher speed."
/>

```js
mountImagesInMotion(el, {
  images,
  tileFit: 'auto',
  tileWidth: 96,
  gap: 2,
  angle: -8,
  speedRange: [18, 36],
  imageOrder: 'random',
})
```

</div>

## Slow monument

Large cover boxes, almost still, deep ink overlay.

<div class="study is-wide">

<MotionDemo
  :tile-width="260"
  :tile-aspect-ratio="0.72"
  :gap="12"
  :angle="16"
  :speed-range="[3, 7]"
  :overlay-opacity="0.28"
  overlay-color="#141313"
  ratio="16 / 9"
  caption="Large fixed tiles, slow, ink wash."
/>

```js
mountImagesInMotion(el, {
  images,
  tileWidth: 260,
  tileAspectRatio: 0.72,
  gap: 12,
  angle: 16,
  speedRange: [3, 7],
  overlayOpacity: 0.28,
  overlayColor: '#141313',
})
```

</div>

Designed by [Samuel Burlon](https://github.com/samuelburlon), implemented by [Massimo De Luisa](https://deluisa.me)
