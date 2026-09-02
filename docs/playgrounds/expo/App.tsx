import { View } from 'react-native'
import { WebView } from 'react-native-webview'

const iimOptions = {
  images: [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fm=jpg&fit=crop&w=800&h=1200&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fm=jpg&fit=crop&w=1200&h=800&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fm=jpg&fit=crop&w=800&h=800&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fm=jpg&fit=crop&w=1000&h=700&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fm=jpg&fit=crop&w=800&h=1000&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fm=jpg&fit=crop&w=700&h=1100&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fm=jpg&fit=crop&w=800&h=1200&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fm=jpg&fit=crop&w=1200&h=800&q=80',
  ],
  speedRange: [8, 18],
  angle: 12,
}

const scriptSrc = 'https://smartsquad.github.io/images-in-motion/images-in-motion.global.js'

function escapeScriptSrc(src: string): string {
  return src.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function embedJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>html,body,#stage{margin:0;width:100%;height:100%;background:transparent;overflow:hidden}</style>
</head>
<body>
<div id="stage"></div>
<script src="${escapeScriptSrc(scriptSrc)}"></script>
<script>ImagesInMotion.mountImagesInMotion(document.getElementById("stage"),${embedJson(iimOptions)})</script>
</body>
</html>`

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        scrollEnabled={false}
      />
    </View>
  )
}
