export default class PDFPageInfo {
  left
  top
  width
  heigh
  matrix

  constructor({ left, top, width, heigh, matrix }) {
    this.left = left
    this.top = top
    this.width = width
    this.heigh = heigh
    this.matrix = matrix
  }
}
