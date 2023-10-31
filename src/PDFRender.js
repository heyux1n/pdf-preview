class PageRect {
  left
  top
  right
  bottom
  width
  height
  constructor({ left, top, right, bottom, width, height }) {
    this.left = left
    this.top = top
    this.right = right
    this.bottom = bottom
    this.width = width
    this.height = height
  }
}

class PDFRender {
  static PAGE_MARGIN_BOTTOM = 10
  static SCROLLBAR_SIZE = 8

  PDFWidth = 0
  PDFHeight = 0
  pdfDoc
  pageInfos

  RenderTasks
  previewCanvas
  previewFrame
  frameMatrix = new DOMMatrix([1, 0, 0, 0, 1, 0])

  constructor({ PDFWidth, PDFHeight, pdfDoc, pageInfos }) {
    this.PDFWidth = PDFWidth
    this.PDFHeight = PDFHeight
    this.pdfDoc = pdfDoc
    this.pageInfos = pageInfos
  }

  static async load(url) {
    let pdfDoc = await pdfjsLib.getDocument(url).promise
    let pageInfos = new Array(pdfDoc.numPages)
    let scale = 1
    let PDFWidth = 0
    for (let i = 0; i < pageInfos.length; i++) {
      let pdfPageProxy = await pdfDoc.getPage(i + 1)
      let viewport = pdfPageProxy.getViewport({ scale })

      let left = 0
      let top = pageInfos[i - 1] ? pageInfos[i - 1].bottom + PDFRender.PAGE_MARGIN_BOTTOM : 0
      let right = viewport.width
      let bottom = top + viewport.height
      let width = viewport.width
      let height = viewport.height
      PDFWidth = Math.max(PDFWidth, width)

      pageInfos[i] = new PageRect({ left, top, right, bottom, width, height })
    }

    let PDFHeight = pageInfos[pageInfos.length - 1].top + pageInfos[pageInfos.length - 1].height
    return new PDFRender({ PDFWidth, PDFHeight, pdfDoc, pageInfos })
  }

  initDom(dom) {
    let previewWrapper = document.createElement('div')
    previewWrapper.style.height = '100%'
    previewWrapper.style.width = '100%'
    previewWrapper.style.position = 'relative'
    previewWrapper.style.overflow = 'auto'
    previewWrapper.addEventListener('scroll', this.scrollListener)
    previewWrapper.addEventListener('dblclick', this.dblclickListener)

    let scrollWrapper = document.createElement('div')
    scrollWrapper.style.height = `${this.PDFHeight}px`
    scrollWrapper.style.width = `${this.PDFWidth}px`
    previewWrapper.append(scrollWrapper)

    let previewCanvas = document.createElement('canvas')
    previewCanvas.style.width = '100%'
    previewCanvas.style.height = '100%'
    let width = dom.clientHeight > this.PDFHeight ? dom.clientWidth : dom.clientWidth - PDFRender.SCROLLBAR_SIZE
    let height = dom.clientWidth > this.PDFWidth ? dom.clientHeight : dom.clientHeight - PDFRender.SCROLLBAR_SIZE
    previewCanvas.width = width
    previewCanvas.height = height
    this.previewFrame = new PageRect({ left: 0, top: 0, right: width, bottom: height })
    previewCanvas.style.position = 'absolute'
    previewCanvas.style.top = '0'
    dom.append(previewCanvas)

    window.onresize = () => {
      let width = dom.clientHeight > this.PDFHeight ? dom.clientWidth : dom.clientWidth - PDFRender.SCROLLBAR_SIZE
      let height = dom.clientWidth > this.PDFWidth ? dom.clientHeight : dom.clientHeight - PDFRender.SCROLLBAR_SIZE
      previewCanvas.width = width
      previewCanvas.height = height
      this.previewFrame = new PageRect({ left: 0, top: 0, right: width, bottom: height })
    }

    this.previewCanvas = previewWrapper
    return previewWrapper
  }

  render(matrix) {
    //基于frame transform matrix获取需要渲染的页面
    let leftTopPoint = new DOMPoint(this.previewFrame.left, this.previewFrame.top).matrixTransform(matrix)
    let rightBottomPoint = new DOMPoint(this.previewFrame.right, this.previewFrame.bottom).matrixTransform(matrix)

    //基于matrix计算需要进行渲染的页面进行渲染
    let isFound
    for (let i = 0; i < this.pageInfos.length; i++) {
      let pageInfo = this.pageInfos[i]
      if (
        pageInfo.right < leftTopPoint.left ||
        pageInfo.bottom < leftTopPoint.top ||
        pageInfo.left > rightBottomPoint.right ||
        pageInfo.top > rightBottomPoint.bottom
      ) {
        //在当前视口外
        if (isFound) {
          break
        }
        continue
      }
      isFound = true
    }

    //1.多个renderTask作为一个task
    //2.如果存在正在执行的任务取消该任务
    //3.通过frame位置计算需渲染page的transform matrix(页面[0, 0]对于视口[0, 0])值进行渲染
  }

  scrollListener(e) {
    console.log(e)
  }

  dblclickListener(e) {
    console.log(e)
  }
}
