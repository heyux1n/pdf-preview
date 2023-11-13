// import pdfjsLib from '../../../lib/build/pdf.js'
self.importScripts('../../../lib/build/pdf.js')
onmessage = function (event) {
  renderPage(event.data.blob).then(bitmap => {
    postMessage({ bitmap })
  })
}

async function renderPage(blob) {
  console.log(URL.createObjectURL(blob))
  let pdfDoc = await pdfjsLib.getDocument({ data: blob }).promise
  let pdfPageProxy = await pdfDoc.getPage(2)
  let viewport = pdfPageProxy.getViewport({
    scale: 1,
  })

  let canvas = new OffscreenCanvas(viewport.width, viewport.height)
  let ctx = canvas.getContext('2d')

  ctx.save()
  let renderContext = {
    viewport: viewport,
    canvasContext: ctx,
  }
  await pdfPageProxy.render(renderContext).promise
  ctx.restore()
  let bitmap = offscreenDraftCanvas.transferToImageBitmap()
  console.log(bitmap)
  return bitmap
}
