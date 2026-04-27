export type PrintLine = {
  line: number
  correctAnswer: number
  points: number[]
}

export type PrintData = {
  lines: PrintLine[]
}

export type PrintColor = {
  hex: string
  rgb: string
  cmyk: string
  name: string
}

export type PrintColorPalette = {
  orange: PrintColor
  pink: PrintColor
  grau: PrintColor
  gelb: PrintColor
  gruen: PrintColor
}

export type PrintConfig = {
  pageSize: string
  pageOrientation: 'portrait' | 'landscape'
  printMargin: string
  pageBackground: string
  lineBorderColor: string
  lineBorderWidth: number
  screenMaxWidth: number
  printPagePadding: string
  rowHeight: number
  rowGap: number
  barWidth: number
  minBarWidth: number
  maxBarWidth: number
  barTopOffset: number
  scaleFontSize: number
  altAColor: string
  altBColor: string
  defaultLineColor: string
  correctAnswerColor: string
  lineColors: string[]
  colorPalette: PrintColorPalette
}
