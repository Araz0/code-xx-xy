export type GenderLabel = 'men' | 'women'

export type PrintLine = {
  line: number
  correctAnswer: number
  historicalPoints: number[]
  userPoint: number | null
  targetGender?: GenderLabel
  biasDiff?: number | null
  biasDirection?: GenderLabel | null
}

export type PrintData = {
  lines: PrintLine[]
  biasSummary?: {
    direction: GenderLabel | null
    percent: number
    score: number
    count: number
  }
}

export type PrintColor = {
  hex: string
  rgb: string
  cmyk: string
  name: string
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
  headerTextEn: string
  headerTextDe: string
  headerFontSize: number
  lineNumberWidth: number
  lineNumberFontSize: number
  legendFontSize: number
  historicalBarWidth: number
  userBarWidth: number
  correctBarWidth: number
  historicalBarColor: string
  correctBarColor: string
  altAColor: string
  altBColor: string
  defaultLineColor: string
  correctAnswerColor: string
  lineColors: string[]
}
