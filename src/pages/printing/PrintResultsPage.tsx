import { useEffect, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../../quizStore'
import { DEFAULT_PRINT_CONFIG } from './config'
import {
  getAdaptiveBarWidth,
  getBarColorForPoint,
  getPointBarClass,
} from './printDataUtils'
import { buildPrintDataFromResults } from './printResultsUtils'
import './printPreview.css'

type LocationState = {
  resultsSets?: number[][]
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
    '--alt-a-color': config.altAColor,
    '--alt-b-color': config.altBColor,
    '--default-line-color': config.defaultLineColor,
  } as CSSProperties
}

export function PrintResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const rawQuestions = useStoreValue(quizStore, 'rawQuestions')
  const userAnswers = useStoreValue(quizStore, 'userAnswers')

  const state = location.state as LocationState | null
  const resultsSets = useMemo(() => {
    if (state?.resultsSets && state.resultsSets.length > 0) {
      return state.resultsSets
    }

    return [userAnswers]
  }, [state, userAnswers])

  const printData = useMemo(
    () => buildPrintDataFromResults(rawQuestions, resultsSets),
    [rawQuestions, resultsSets],
  )

  const config = DEFAULT_PRINT_CONFIG
  const cssVariables = useMemo(() => applyPreviewCssVariables(config), [config])

  const dynamicPrintStyle = `
    @media print {
      @page {
        size: ${config.pageSize} ${config.pageOrientation};
        margin: ${config.printMargin};
      }
    }
  `

  useEffect(() => {
    const timerId = window.setTimeout(() => window.print(), 120)
    return () => window.clearTimeout(timerId)
  }, [printData])

  if (!rawQuestions.length) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 3 }}>
        <Typography variant="h6">No results to print.</Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back Home
        </Button>
      </Stack>
    )
  }

  return (
    <Stack
      spacing={2.5}
      alignItems="center"
      sx={{ py: 3 }}
      className="print-results-page"
    >
      <style>{dynamicPrintStyle}</style>

      <Paper elevation={0} className="print-page-shell">
        <Stack
          direction="row"
          justifyContent="space-between"
          className="print-page-topbar"
        >
          <Typography variant="h5" component="h1">
            Print Results
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button variant="text" onClick={() => navigate('/results')}>
              View Results
            </Button>
            <Button variant="text" onClick={() => navigate('/')}>
              Home
            </Button>
          </Stack>
        </Stack>

        <main
          className="print-page-preview"
          style={cssVariables}
          aria-label="Printable chart preview"
        >
          {printData.lines.map((lineData, lineIndex) => {
            const effectiveBarWidth = getAdaptiveBarWidth(
              lineData.points.length,
              config,
            )
            const halfBarWidth = effectiveBarWidth / 2

            return (
              <section
                className="print-line-row"
                key={lineData.line}
                style={
                  {
                    '--line-color':
                      config.lineColors[lineIndex] || config.defaultLineColor,
                  } as CSSProperties
                }
              >
                <div className="print-bars-layer">
                  {lineData.points.map((point, pointIndex) => {
                    const barClass = getPointBarClass(lineIndex, pointIndex)
                    const color =
                      barClass.length > 0
                        ? undefined
                        : getBarColorForPoint(
                            point,
                            lineData.correctAnswer,
                            config,
                          )

                    return (
                      <div
                        className={`print-point-bar ${barClass}`.trim()}
                        key={`${lineData.line}-${pointIndex}-${point}`}
                        style={{
                          width: `${effectiveBarWidth}px`,
                          left: `calc(${point}% - ${halfBarWidth}px)`,
                          ...(color ? { backgroundColor: color } : {}),
                        }}
                      />
                    )
                  })}

                  <div
                    className="correct-answer-line"
                    style={{ left: `calc(${lineData.correctAnswer}% - 2.5px)` }}
                  />
                </div>
              </section>
            )
          })}
        </main>
      </Paper>
    </Stack>
  )
}
