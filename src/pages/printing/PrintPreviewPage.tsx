import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { DEFAULT_PRINT_CONFIG } from './config'
import { fakeUserData } from './fakeUserData'
import {
  generateRandomData,
  getAdaptiveBarWidth,
  getBarColorForPoint,
  getPointBarClass,
  normalizePrintData,
  toPrettyJson,
} from './printDataUtils'
import type { PrintData } from './types'
import './printPreview.css'

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

function usePrintPreviewState(initialData: PrintData) {
  const [jsonText, setJsonText] = useState(() => toPrettyJson(initialData))
  const [previewData, setPreviewData] = useState<PrintData>(() =>
    normalizePrintData(initialData),
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

  return {
    jsonText,
    previewData,
    error,
    setJsonText,
    renderFromJsonText,
    loadData,
  }
}

export function PrintPreviewPage() {
  const config = DEFAULT_PRINT_CONFIG
  const cssVariables = useMemo(() => applyPreviewCssVariables(config), [config])

  const {
    jsonText,
    previewData,
    error,
    setJsonText,
    renderFromJsonText,
    loadData,
  } = usePrintPreviewState(fakeUserData)

  useEffect(() => {
    const syncBeforePrint = () => {
      renderFromJsonText(jsonText)
    }

    window.addEventListener('beforeprint', syncBeforePrint)

    return () => {
      window.removeEventListener('beforeprint', syncBeforePrint)
    }
  }, [jsonText, renderFromJsonText])

  const dynamicPrintStyle = `
    @media print {
      @page {
        size: ${config.pageSize} ${config.pageOrientation};
        margin: ${config.printMargin};
      }
    }
  `

  const gradientStops = [
    config.colorPalette.orange.hex,
    config.colorPalette.pink.hex,
    config.colorPalette.grau.hex,
    config.colorPalette.gelb.hex,
    config.colorPalette.gruen.hex,
  ]

  return (
    <Stack spacing={2.5} alignItems='center' sx={{ py: 3 }}>
      <style>{dynamicPrintStyle}</style>

      <Paper elevation={0} className='print-page-shell'>
        <Stack
          direction='row'
          justifyContent='space-between'
          className='print-page-topbar'
        >
          <Typography variant='h4' component='h1'>
            Test Page: Print Preview
          </Typography>
          <Button href='/' variant='text'>
            Back to Quiz
          </Button>
        </Stack>

        <section className='print-controls'>
          <Typography variant='body2' sx={{ mb: 1 }}>
            Paste JSON in {`{"lines":[{"points":[0..100]}...]}`} format with 13
            lines.
          </Typography>

          <textarea
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            aria-label='Print JSON input'
          />

          <div className='print-actions'>
            <Button variant='outlined' onClick={() => loadData(fakeUserData)}>
              Load Fake Data
            </Button>
            <Button
              variant='outlined'
              onClick={() => loadData(generateRandomData())}
            >
              Randomize Data
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                const ok = renderFromJsonText(jsonText)
                if (ok) {
                  window.print()
                }
              }}
            >
              Print Page
            </Button>
            <Button variant='text' onClick={() => renderFromJsonText(jsonText)}>
              Refresh Preview
            </Button>
          </div>

          {error ? <div className='print-error'>{error}</div> : null}
        </section>

        <section className='print-palette'>
          <Typography variant='h6' sx={{ mb: 1 }}>
            Color Palette and Gradient
          </Typography>

          <div className='color-legend'>
            {Object.values(config.colorPalette).map((color) => (
              <div className='color-swatch' key={color.name}>
                <div className='color-bar' style={{ background: color.hex }} />
                <div className='color-info'>
                  <div className='color-name'>{color.name}</div>
                  <div className='color-values'>
                    {color.rgb}
                    <br />
                    {color.cmyk}
                  </div>
                </div>
              </div>
            ))}
            <div className='color-swatch'>
              <div
                className='color-bar'
                style={{
                  background: `linear-gradient(to right, ${gradientStops.join(', ')})`,
                }}
              />
              <div className='color-info'>
                <div className='color-name'>
                  ORANGE to GELB (Unified Gradient)
                </div>
                <div className='color-values'>with neutral center</div>
              </div>
            </div>
          </div>
        </section>

        <main
          className='print-page-preview'
          style={cssVariables}
          aria-label='Printable chart preview'
        >
          {previewData.lines.map((lineData, lineIndex) => {
            const effectiveBarWidth = getAdaptiveBarWidth(
              lineData.points.length,
              config,
            )
            const halfBarWidth = effectiveBarWidth / 2

            return (
              <section
                className='print-line-row'
                key={lineData.line}
                style={
                  {
                    '--line-color':
                      config.lineColors[lineIndex] || config.defaultLineColor,
                  } as CSSProperties
                }
              >
                <div className='print-bars-layer'>
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
                    className='correct-answer-label'
                    style={{ left: `calc(${lineData.correctAnswer}% - 12px)` }}
                  >
                    {lineData.correctAnswer}
                  </div>
                </div>
              </section>
            )
          })}
        </main>
      </Paper>
    </Stack>
  )
}
