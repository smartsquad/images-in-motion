---
title: JavaScript | Frameworks
description: Mount the renderer with mountImagesInMotion from the images-in-motion JS entry.
---

# JavaScript

Import `mountImagesInMotion` from `images-in-motion` and pass a host. Examples fill the available box. The host is `20rem` by `20rem`. The second argument is the options object. There is no `<ImagesInMotion>` component.

<FrameworkExample id="javascript" />

The same import also registers `<images-in-motion>`. See the [custom element](/frameworks/element) if you want attributes instead of a call.

`update` accepts a partial options object. `destroy` removes the sheet and listeners. `getLayout()` returns the last computed geometry.

Options are listed on the [API](/api) page.

[Expo](/frameworks/expo) loads this same mount through `createImagesInMotionWebViewHtml`. [NativeScript](/frameworks/nativescript) hosts the custom element or this mount in a WebView.
