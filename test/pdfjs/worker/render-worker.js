// import pdfjsLib from '../../../lib/build/pdf.js'
importScripts('./renderpdf3.js')
onmessage = function (event) {
  renderPage(event.data.buffer, event.data.pdfjsLib).then(bitmap => {
    postMessage({ bitmap })
  })
}
