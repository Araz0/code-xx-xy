import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Box, Button, Slider, Stack, Typography } from '@mui/material'
import questionsJson from '../../questions.json'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DEFAULT_PRINT_CONFIG } from './config'
import { demoPrintData } from './demoPrintData'

import { PrintChart } from '../../components/PrintChart'
import type { GenderLabel, PrintData } from './types'
import './printResults.css'
import {
  toPrettyJson,
  applyBiasToPrintData,
  normalizePrintData,
  generateRandomData,
} from './printDataUtils'

type BiasPreset = {
  label: string
  percent: number
  direction: GenderLabel | null
}

const biasPresets: BiasPreset[] = [
  { label: '0-5%', percent: 3, direction: null },
  { label: '6-10%', percent: 8, direction: 'men' },
  { label: '11-15%', percent: 13, direction: 'women' },
  { label: '16-20%', percent: 18, direction: 'men' },
  { label: '21-25%', percent: 23, direction: 'women' },
  { label: '26-30%', percent: 28, direction: 'men' },
  { label: '31-35%', percent: 33, direction: 'women' },
  { label: '36-40%', percent: 38, direction: 'men' },
  { label: '41-45%', percent: 43, direction: 'women' },
  { label: '46-50%', percent: 48, direction: 'men' },
  { label: '51-55%', percent: 53, direction: 'women' },
  { label: '56-60%', percent: 58, direction: 'men' },
  { label: '61-65%', percent: 63, direction: 'women' },
  { label: '66-70%', percent: 68, direction: 'men' },
  { label: '71-75%', percent: 73, direction: 'women' },
  { label: '76-80%', percent: 78, direction: 'men' },
  { label: '81-85%', percent: 83, direction: 'women' },
  { label: '86-90%', percent: 88, direction: 'men' },
  { label: '91-95%', percent: 93, direction: 'women' },
  { label: '96-100%', percent: 98, direction: 'men' },
]

function applyPreviewCssVariables(config: typeof DEFAULT_PRINT_CONFIG) {
  return {
    '--page-bg': config.pageBackground,
    '--line-border': config.lineBorderColor,
    '--line-border-width': `${config.lineBorderWidth}px`,
    '--screen-max-width': `${config.screenMaxWidth}px`,
    '--print-page-padding': config.printPagePadding,
    '--row-height': `${config.rowHeight}px`,
    '--row-gap': `${config.rowGap}px`,
    '--scale-font-size': `${config.scaleFontSize}px`,
    '--print-header-font-size': `${config.headerFontSize}px`,
    '--line-number-width': `${config.lineNumberWidth}px`,
    '--line-number-font-size': `${config.lineNumberFontSize}px`,
    '--legend-font-size': `${config.legendFontSize}px`,
    '--point-color': config.pointColor,
    '--historical-point-size': `${config.historicalPointSize}px`,
    '--correct-point-size': `${config.correctPointSize}px`,
    '--user-point-size': `${config.userPointSize}px`,
  } as CSSProperties
}

function clampSliderValue(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function getSliderValues(data: PrintData) {
  return data.lines.map((line) =>
    clampSliderValue(line.userPoint ?? line.correctAnswer),
  )
}

export function PrintTestPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const config = DEFAULT_PRINT_CONFIG
  const cssVariables = useMemo(() => applyPreviewCssVariables(config), [config])

  // Build initial preview from the real `questions.json` answers
  const buildDataFromQuestions = useCallback(() => {
    const raw = (questionsJson as any).questions as Array<{
      answer: number
      targetGender?: GenderLabel
    }>

    const randHistorical = (base: number) => {
      const count = Math.floor(Math.random() * 3) // 0..2 historical points
      const arr: number[] = []
      for (let i = 0; i < count; i++) {
        const noise = Math.round((Math.random() - 0.5) * 30) // +/-15
        arr.push(clampSliderValue(base + noise))
      }
      return arr
    }

    const lines = raw.map((q, idx) => ({
      line: idx + 1,
      correctAnswer: Number.isFinite(q.answer) ? q.answer : 0,
      historicalPoints: randHistorical(
        Number.isFinite(q.answer) ? q.answer : 0,
      ),
      userPoint: Number.isFinite(q.answer) ? clampSliderValue(q.answer) : null,
      targetGender: q.targetGender ?? 'men',
    }))

    return applyBiasToPrintData(normalizePrintData({ lines }))
  }, [])

  const initialDataFromQuestions = buildDataFromQuestions()

  const [jsonText, setJsonText] = useState(() =>
    toPrettyJson(initialDataFromQuestions),
  )
  const [previewData, setPreviewData] = useState<PrintData>(
    () => initialDataFromQuestions,
  )
  const [sliderValues, setSliderValues] = useState<number[]>(() =>
    getSliderValues(initialDataFromQuestions),
  )
  const [error, setError] = useState('')

  const createBiasPresetData = useCallback((preset: BiasPreset) => {
    const normalized = applyBiasToPrintData(normalizePrintData(demoPrintData))
    const score =
      preset.direction === null
        ? 0
        : preset.direction === 'men'
          ? preset.percent
          : -preset.percent

    return {
      ...normalized,
      biasSummary: {
        direction: preset.direction,
        percent: preset.percent,
        score,
        count: normalized.lines.length,
      },
    }
  }, [])

  const syncPreviewData = useCallback((nextData: PrintData) => {
    const nextSliderValues = getSliderValues(nextData)
    setPreviewData(nextData)
    setSliderValues(nextSliderValues)
    setJsonText(toPrettyJson(nextData))
    setError('')

    console.log('[PrintTestPage] preview updated', {
      biasSummary: nextData.biasSummary,
      historicalBiasSummary: nextData.historicalBiasSummary,
      historicalBiasBySet: nextData.historicalBiasBySet,
    })
  }, [])

  const loadBiasPreset = useCallback(
    (preset: BiasPreset) => {
      const nextData = createBiasPresetData(preset)
      syncPreviewData(nextData)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.print()
        })
      })
    },
    [createBiasPresetData, syncPreviewData],
  )

  const renderFromJsonText = useCallback(
    (nextJsonText: string) => {
      try {
        const parsed = JSON.parse(nextJsonText) as unknown
        const normalized = applyBiasToPrintData(normalizePrintData(parsed))
        syncPreviewData(normalized)
        return true
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unknown JSON error'
        setError(t('printTest.invalidJson', { message }))
        return false
      }
    },
    [syncPreviewData, t],
  )

  const loadData = (data: PrintData) => {
    const normalized = applyBiasToPrintData(normalizePrintData(data))
    syncPreviewData(normalized)
  }

  const setExtremeBias = useCallback((direction: 'women' | 'men') => {
    setPreviewData((current) => {
      const nextLines = current.lines.map((line) => ({
        ...line,
        userPoint: line.targetGender === direction ? 100 : 0,
      }))
      const next = applyBiasToPrintData({ ...current, lines: nextLines })
      setSliderValues(getSliderValues(next))
      setJsonText(toPrettyJson(next))
      return next
    })
  }, [])

  const handleSliderChange = useCallback(
    (lineIndex: number, rawValue: number) => {
      const nextValue = clampSliderValue(rawValue)

      setSliderValues((currentValues) => {
        const nextValues = [...currentValues]
        nextValues[lineIndex] = nextValue
        return nextValues
      })

      setPreviewData((currentData) => {
        const nextLines = currentData.lines.map((line, index) =>
          index === lineIndex ? { ...line, userPoint: nextValue } : line,
        )
        const nextData = applyBiasToPrintData({
          ...currentData,
          lines: nextLines,
        })

        setJsonText(toPrettyJson(nextData))
        setError('')

        console.log('[PrintTestPage] slider changed', {
          line: lineIndex + 1,
          userPoint: nextValue,
          biasSummary: nextData.biasSummary,
        })

        return nextData
      })
    },
    [],
  )

  const dynamicPrintStyle = `
    @media print {
      @page {
        size: ${config.pageSize} ${config.pageOrientation};
        margin: ${config.printMargin};
      }
    }
  `

  const legendText = {
    correct: t('results.legend.correct'),
    historical: t('results.legend.historical'),
    user: t('results.legend.user'),
  }

  useEffect(() => {
    const syncBeforePrint = () => {
      renderFromJsonText(jsonText)
    }

    window.addEventListener('beforeprint', syncBeforePrint)

    return () => {
      window.removeEventListener('beforeprint', syncBeforePrint)
    }
  }, [jsonText, renderFromJsonText])

  return (
    <Stack spacing={2.5} sx={{ py: 3 }} className='print-results-page'>
      <style>{dynamicPrintStyle}</style>

      <Stack
        direction='row'
        justifyContent='space-between'
        className='print-page-topbar'
      >
        <Typography variant='h5' component='h1'>
          {t('printTest.title')}
        </Typography>
        <Stack direction='row' spacing={1.5}>
          <Button variant='text' onClick={() => navigate('/results')}>
            {t('printTest.results')}
          </Button>
          <Button variant='text' onClick={() => navigate('/')}>
            {t('printTest.home')}
          </Button>
        </Stack>
      </Stack>

      <section className='print-controls'>
        <Typography variant='body2' sx={{ mb: 1 }}>
          {t('printTest.instructions')}
        </Typography>

        <textarea
          value={jsonText}
          onChange={(event) => setJsonText(event.target.value)}
          aria-label='Print JSON input'
        />

        <div className='print-actions'>
          <Button variant='outlined' onClick={() => loadData(demoPrintData)}>
            {t('printTest.loadDemoData')}
          </Button>
          <Button
            variant='outlined'
            onClick={() => {
              const data = buildDataFromQuestions()
              syncPreviewData(data)
            }}
          >
            Load Correct Answers
          </Button>
          <Button
            variant='outlined'
            onClick={() => loadData(generateRandomData())}
          >
            {t('printTest.randomizeData')}
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
            {t('printTest.printPage')}
          </Button>
          <Button variant='text' onClick={() => renderFromJsonText(jsonText)}>
            {t('printTest.refreshPreview')}
          </Button>
        </div>

        {error ? <div className='print-error'>{error}</div> : null}
      </section>

      {/* <PrintChart
        printData={previewData}
        cssVariables={cssVariables}
        headerText={t('presenter.header')}
        legendText={{
          correct: t('results.legend.correct'),
          historical: t('results.legend.historical'),
          user: t('results.legend.user'),
        }}
      /> */}
      <PrintChart
        printData={previewData}
        cssVariables={cssVariables}
        headerText={t('presenter.header')}
        legendText={legendText}
        userName={'Araz'}
        userAge={'22'}
      />

      <section className='print-test-sliders'>
        <Typography variant='h6' component='h2'>
          Live question sliders
        </Typography>
        <Typography variant='body2' sx={{ mb: 1.5 }}>
          Move a slider to change the testing value for that question and watch
          the chart, score, and text update immediately.
        </Typography>

        <Stack spacing={2}>
          <Stack direction='row' spacing={1} sx={{ mb: 1 }}>
            <Button
              variant='outlined'
              size='small'
              onClick={() => setExtremeBias('women')}
            >
              Set 100% women
            </Button>
            <Button
              variant='outlined'
              size='small'
              onClick={() => setExtremeBias('men')}
            >
              Set 100% men
            </Button>
          </Stack>
          {previewData.lines.map((line, index) => (
            <Box key={line.line} className='print-test-slider-row'>
              <Typography variant='body2' className='print-test-slider-label'>
                Q{line.line} · {line.targetGender} · correct{' '}
                {line.correctAnswer}
              </Typography>
              <Slider
                value={
                  sliderValues[index] ?? line.userPoint ?? line.correctAnswer
                }
                min={0}
                max={100}
                step={1}
                valueLabelDisplay='auto'
                onChange={(_, value) => {
                  const nextValue = Array.isArray(value) ? value[0] : value
                  handleSliderChange(index, nextValue)
                }}
              />
            </Box>
          ))}
        </Stack>
      </section>

      <section className='print-test-presets'>
        <Typography variant='h6' component='h2'>
          Bias band presets
        </Typography>
        <Typography variant='body2' sx={{ mb: 1.5 }}>
          Use these buttons to load a fake bias summary for each translation
          band and print it immediately.
        </Typography>

        <div className='print-test-presets-grid'>
          {biasPresets.map((preset) => (
            <Button
              key={preset.label}
              variant='outlined'
              size='small'
              onClick={() => loadBiasPreset(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </section>
    </Stack>
  )
}
