// worker.js
importScripts('../../lib/build/pdf.js')

self.onmessage = async event => {
  const pdfUrl = event.data
  const loadingTask = pdfjsLib.getDocument(pdfUrl)
  const pdf = await loadingTask.promise

  const pageNumber = 1 // change this to the page number you want to render
  const page = await pdf.getPage(pageNumber)

  const scale = 1.0
  const viewport = page.getViewport({ scale })

  const canvas = new OffscreenCanvas(viewport.width, viewport.height)
  const context = canvas.getContext('2d')

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  }

  await page.render(renderContext).promise

  const imageBitmap = await createImageBitmap(canvas)
  self.postMessage(imageBitmap, [imageBitmap])
}
