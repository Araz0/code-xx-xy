import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_PRINT_CONFIG } from './config'
import { demoPrintData } from './demoPrintData'
import {
  applyBiasToPrintData,
  generateRandomData,
  normalizePrintData,
  toPrettyJson,
} from './printDataUtils'
import { PrintChart } from '../../components/PrintChart'
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

export function PrintTestPage() {
  const navigate = useNavigate()
  const config = DEFAULT_PRINT_CONFIG
  const cssVariables = useMemo(() => applyPreviewCssVariables(config), [config])

  const [jsonText, setJsonText] = useState(() => toPrettyJson(demoPrintData))
  const [previewData, setPreviewData] = useState<PrintData>(() =>
    applyBiasToPrintData(normalizePrintData(demoPrintData)),
  )
  const [error, setError] = useState('')

  const renderFromJsonText = (nextJsonText: string) => {
    try {
      const parsed = JSON.parse(nextJsonText) as unknown
      const normalized = applyBiasToPrintData(normalizePrintData(parsed))
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
    const normalized = applyBiasToPrintData(normalizePrintData(data))
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

      <PrintChart
        printData={previewData}
        config={config}
        cssVariables={cssVariables}
        headerText={config.headerTextEn}
        legendText={{
          correct: 'Correct answer',
          historical: 'Previous answers',
          user: 'Your answer',
        }}
        language="en"
      />
    </Stack>
  )
}
