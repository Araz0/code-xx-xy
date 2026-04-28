import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_PRINT_CONFIG } from './config'
import { demoPrintData } from './demoPrintData'
import {
  generateRandomData,
  getAdaptiveBarWidth,
  getBarColorForPoint,
  getPointBarClass,
  normalizePrintData,
  toPrettyJson,
} from './printDataUtils'
import type { PrintData } from './types'
import './printResults.css'

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

export function PrintTestPage() {
  const navigate = useNavigate()
  const config = DEFAULT_PRINT_CONFIG
  const cssVariables = useMemo(() => applyPreviewCssVariables(config), [config])

  const [jsonText, setJsonText] = useState(() => toPrettyJson(demoPrintData))
  const [previewData, setPreviewData] = useState<PrintData>(() =>
    normalizePrintData(demoPrintData),
  )
  const [error, setError] = useState('')

  const renderFromJsonText = (nextJsonText: string) => {
    try {
      const parsed = JSON.parse(nextJsonText) as unknown
      const normalized = normalizePrintData(parsed)
      setPreviewData(normalized)
      setError('')
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown JSON error'
      setError(`Invalid JSON: ${message}`)
      return false
    }
  }

  const loadData = (data: PrintData) => {
    const normalized = normalizePrintData(data)
    setPreviewData(normalized)
    setJsonText(toPrettyJson(normalized))
    setError('')
  }

  const dynamicPrintStyle = `
    @media print {
      @page {
        size: ${config.pageSize} ${config.pageOrientation};
        margin: ${config.printMargin};
      }
    }
  `

  useEffect(() => {
    const syncBeforePrint = () => {
      renderFromJsonText(jsonText)
    }

    window.addEventListener('beforeprint', syncBeforePrint)

    return () => {
      window.removeEventListener('beforeprint', syncBeforePrint)
    }
  }, [jsonText])

  return (
    <Stack spacing={2.5} sx={{ py: 3 }} className="print-results-page">
      <style>{dynamicPrintStyle}</style>

      <Stack
        direction="row"
        justifyContent="space-between"
        className="print-page-topbar"
      >
        <Typography variant="h5" component="h1">
          Print Test
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="text" onClick={() => navigate('/results')}>
            Results
          </Button>
          <Button variant="text" onClick={() => navigate('/')}>
            Home
          </Button>
        </Stack>
      </Stack>

      <section className="print-controls">
        <Typography variant="body2" sx={{ mb: 1 }}>
          Paste JSON in {`{"lines":[{"points":[0..100]}...]}`} format with 13
          lines.
        </Typography>

        <textarea
          value={jsonText}
          onChange={(event) => setJsonText(event.target.value)}
          aria-label="Print JSON input"
        />

        <div className="print-actions">
          <Button variant="outlined" onClick={() => loadData(demoPrintData)}>
            Load Demo Data
          </Button>
          <Button
            variant="outlined"
            onClick={() => loadData(generateRandomData())}
          >
            Randomize Data
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const ok = renderFromJsonText(jsonText)
              if (ok) {
                window.print()
              }
            }}
          >
            Print Page
          </Button>
          <Button variant="text" onClick={() => renderFromJsonText(jsonText)}>
            Refresh Preview
          </Button>
        </div>

        {error ? <div className="print-error">{error}</div> : null}
      </section>

      <main
        className="print-page"
        style={cssVariables}
        aria-label="Printable chart preview"
      >
        {previewData.lines.map((lineData, lineIndex) => {
          const effectiveBarWidth = getAdaptiveBarWidth(
            lineData.points.length,
            config,
          )
          const halfBarWidth = effectiveBarWidth / 2

          return (
            <section
              className="line-row"
              key={lineData.line}
              style={
                {
                  '--line-color':
                    config.lineColors[lineIndex] || config.defaultLineColor,
                } as CSSProperties
              }
            >
              <div className="bars-layer">
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
                      className={`point-bar ${barClass}`.trim()}
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
                  className="correct-answer-label"
                  style={{ left: `calc(${lineData.correctAnswer}% - 12px)` }}
                >
                  {lineData.correctAnswer}
                </div>
              </div>
            </section>
          )
        })}
      </main>
    </Stack>
  )
}
