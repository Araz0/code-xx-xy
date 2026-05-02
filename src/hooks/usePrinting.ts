import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import type { RawQuestion } from '../quizStore'
import { DEFAULT_PRINT_CONFIG } from '../pages/printing/config'
import { buildPrintDataFromResults } from '../pages/printing/printResultsUtils'

type UsePrintingOptions = {
  questions: RawQuestion[]
  resultsSets: number[][]
  autoPrint?: boolean
  printDelayMs?: number
}

function applyPreviewCssVariables(config: typeof DEFAULT_PRINT_CONFIG) {
  return {
    '--page-bg': config.pageBackground,
    '--line-border': config.lineBorderColor,
    '--line-border-width': `${config.lineBorderWidth}px`,
    '--screen-max-width': `${config.screenMaxWidth}px`,
    '--print-page-padding': config.printPagePadding,
    '--row-height': `${config.rowHeight}px`,
    '--row-gap': `${config.rowGap}px`,
    '--bar-width': `${config.barWidth}px`,
    '--bar-top-offset': `${config.barTopOffset}px`,
    '--scale-font-size': `${config.scaleFontSize}px`,
    '--print-header-font-size': `${config.headerFontSize}px`,
    '--line-number-width': `${config.lineNumberWidth}px`,
    '--line-number-font-size': `${config.lineNumberFontSize}px`,
    '--legend-font-size': `${config.legendFontSize}px`,
    '--historical-bar-width': `${config.historicalBarWidth}px`,
    '--user-bar-width': `${config.userBarWidth}px`,
    '--correct-bar-width': `${config.correctBarWidth}px`,
    '--historical-bar-color': config.historicalBarColor,
    '--correct-bar-color': config.correctBarColor,
    '--alt-a-color': config.altAColor,
    '--alt-b-color': config.altBColor,
    '--default-line-color': config.defaultLineColor,
  } as CSSProperties
}

export function usePrinting({
  questions,
  resultsSets,
  autoPrint = false,
  printDelayMs = 120,
}: UsePrintingOptions) {
  const config = DEFAULT_PRINT_CONFIG

  const printData = useMemo(
    () => buildPrintDataFromResults(questions, resultsSets),
    [questions, resultsSets],
  )

  const cssVariables = useMemo(() => applyPreviewCssVariables(config), [config])

  const dynamicPrintStyle = useMemo(
    () => `
    @media print {
      @page {
        size: ${config.pageSize} ${config.pageOrientation};
        margin: ${config.printMargin};
      }
    }
  `,
    [config],
  )

  const printSignature = useMemo(() => JSON.stringify(printData), [printData])
  const lastPrintedRef = useRef<string | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const requestPrint = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      window.print()
    }, printDelayMs)
  }, [printDelayMs])

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!autoPrint || !questions.length) return
    if (lastPrintedRef.current === printSignature) return

    lastPrintedRef.current = printSignature
    requestPrint()
  }, [autoPrint, questions.length, printSignature, requestPrint])

  return {
    config,
    cssVariables,
    dynamicPrintStyle,
    printData,
    requestPrint,
  }
}
