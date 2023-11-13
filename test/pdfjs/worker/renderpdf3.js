import 

async function renderPage(buffer) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '../../../lib/build/pdf.worker.js'
  let pdfDoc = await pdfjsLib.getDocument(buffer).promise
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
