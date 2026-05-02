import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../quizStore'
import { ResultComparisonSlider } from './ResultComparisonSlider'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePrinting } from '../hooks/usePrinting'
import { useSupabase } from '../hooks/useSupabase'
import { PrintChart } from './PrintChart'
import '../pages/printing/printResults.css'

const ResultsViewRaw = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const allQuestions = useStoreValue(quizStore, 'allQuestions')
  const rawQuestions = useStoreValue(quizStore, 'rawQuestions')
  const userAnswers = useStoreValue(quizStore, 'userAnswers')
  const language = useStoreValue(quizStore, 'language')
  const totalQuestions = allQuestions.length
  const [historicalResults, setHistoricalResults] = useState<number[][]>([])
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [visibleRows, setVisibleRows] = useState(0)
  const [revealedRows, setRevealedRows] = useState(0)
  const [startRevealReal, setStartRevealReal] = useState(false)

  const handleRestartClick = useCallback(() => {
    quizStore.set('startQuiz')
    navigate('/form')
  }, [navigate])
  const handleHomeClick = useCallback(() => {
    quizStore.set('startQuiz')
    navigate('/')
  }, [navigate])
  const { fetchQuizResults } = useSupabase()

  const resultsSets = useMemo(() => {
    const unique = new Map<string, number[]>()

    const addSet = (values?: number[]) => {
      if (!values || values.length === 0) return
      const key = JSON.stringify(values)
      if (!unique.has(key)) {
        unique.set(key, values)
      }
    }

    addSet(userAnswers)
    historicalResults.forEach(addSet)

    return Array.from(unique.values())
  }, [historicalResults, userAnswers])
  const shouldAutoPrint = Boolean(
    (location.state as { autoPrint?: boolean } | null)?.autoPrint,
  )

  const { config, cssVariables, dynamicPrintStyle, printData, requestPrint } =
    usePrinting({
      questions: rawQuestions,
      resultsSets,
      autoPrint: shouldAutoPrint && historyLoaded,
    })

  const headerText =
    language === 'de' ? config.headerTextDe : config.headerTextEn
  const legendText = {
    correct: language === 'de' ? 'Reale Daten' : 'Correct answer',
    historical: language === 'de' ? 'Vorgaenger-Antworten' : 'Previous answers',
    user: language === 'de' ? 'Deine Antwort' : 'Your answer',
  }

  const handlePrintClick = useCallback(() => {
    requestPrint()
  }, [requestPrint])

  useEffect(() => {
    let isMounted = true

    const loadHistory = async () => {
      const { data, error } = await fetchQuizResults()

      if (!isMounted) return

      if (error) {
        console.error('Failed to load historical results', error)
        setHistoryLoaded(true)
        return
      }

      const answers = (data ?? [])
        .map((row) => row.answers)
        .filter((values) => Array.isArray(values) && values.length > 0)

      setHistoricalResults(answers)
      setHistoryLoaded(true)
    }

    loadHistory()

    return () => {
      isMounted = false
    }
  }, [fetchQuizResults])

  // Gradually reveal the user's estimated results, one by one, with animation
  useEffect(() => {
    if (!totalQuestions) return

    let index = 0
    const intervalId = window.setInterval(() => {
      index += 1
      setVisibleRows(index)
      // When all results are visible, trigger the real values reveal after a short pause
      if (index >= totalQuestions) {
        window.clearInterval(intervalId)
        setTimeout(() => setStartRevealReal(true), 350) // short pause before real values
      }
    }, 85)

    return () => window.clearInterval(intervalId)
  }, [totalQuestions])

  // After the user's results are revealed, gradually reveal the real values, also with animation
  useEffect(() => {
    if (!startRevealReal || !totalQuestions) return

    let index = 0
    const intervalId = window.setInterval(() => {
      index += 1
      setRevealedRows(index)
      if (index >= totalQuestions) {
        window.clearInterval(intervalId)
      }
    }, 110)

    return () => window.clearInterval(intervalId)
  }, [startRevealReal, totalQuestions])

  return (
    <>
      <style>{dynamicPrintStyle}</style>
      <Paper
        elevation={0}
        className="results-view"
        sx={{ p: { xs: 2.25, sm: 3.5 }, width: 'min(980px, 94vw)' }}
      >
        <Stack spacing={3.25}>
          <Typography variant="h4" component="h2" textAlign="center">
            Your perception compared to real data
          </Typography>

          <Stack spacing={3}>
            {allQuestions.map((question, index) => (
              <ResultComparisonSlider
                key={question.title}
                index={index}
                title={question.title}
                estimate={userAnswers[index] ?? 0}
                actual={question.answer}
                visible={index < visibleRows}
                reveal={index < revealedRows}
              />
            ))}
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
          >
            <Button variant="outlined" onClick={handleRestartClick}>
              Restart
            </Button>
            <Button variant="outlined" onClick={handleHomeClick}>
              Home
            </Button>
            <Button variant="outlined" onClick={handlePrintClick}>
              Print
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <div className="print-results-page print-only">
        <PrintChart
          printData={printData}
          config={config}
          cssVariables={cssVariables}
          headerText={headerText}
          legendText={legendText}
          language={language}
        />
      </div>
    </>
  )
}

export const ResultsView = memo(ResultsViewRaw)
