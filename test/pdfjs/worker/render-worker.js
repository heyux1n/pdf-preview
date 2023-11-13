// import pdfjsLib from '../../../lib/build/pdf.js'
self.importScripts('./renderpdf3.js')
onmessage = function (event) {
  renderPage(event.data.buffer).then(bitmap => {
    postMessage({ bitmap })
  })
}
