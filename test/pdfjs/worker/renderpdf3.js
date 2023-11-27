// import globalThis from '../../../lib/pdfjs-4.0.189-dist/build/pdf.mjs'
importScripts('../../../lib/pdfjs-4.0.189-dist/build/pdf.mjs')

async function renderPage(buffer) {
  // const worker = new Worker('../../../lib/build/pdf.worker.js')
  // pdfjsLib.GlobalWorkerOptions.workerSrc = worker

  var { pdfjsLib } = globalThis
  pdfjsLib.GlobalWorkerOptions.workerSrc = '../../../lib/pdfjs-4.0.189-dist/build/pdf.worker.mjs'

  const document = {
    fonts: self.fonts,
    createElement: name => {
      if (name == 'canvas') {
        return new OffscreenCanvas(1, 1)
      }
      return null
    },
  }

  let pdfDoc = await pdfjsLib.getDocument({ data: buffer, ownerDocument: document }).promise
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
