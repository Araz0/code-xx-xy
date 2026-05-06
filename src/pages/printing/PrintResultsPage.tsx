import { useMemo } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../../quizStore'
import { usePrinting } from '../../hooks/usePrinting'
import { PrintChart } from '../../components/PrintChart'
import './printResults.css'

export function PrintResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const rawQuestions = useStoreValue(quizStore, 'rawQuestions')
  const userAnswers = useStoreValue(quizStore, 'userAnswers')
  const language = useStoreValue(quizStore, 'language')
  const userName = useStoreValue(quizStore, 'userName')
  const userAge = useStoreValue(quizStore, 'userAge')

  const state = location.state as { resultsSets?: number[][] } | null
  const resultsSets = useMemo(() => {
    if (state?.resultsSets && state.resultsSets.length > 0) {
      return state.resultsSets
    }
    return [userAnswers]
  }, [state, userAnswers])

  const { config, cssVariables, dynamicPrintStyle, printData } = usePrinting({
    questions: rawQuestions,
    resultsSets,
    autoPrint: true,
  })

  const headerText =
    language === 'de' ? config.headerTextDe : config.headerTextEn
  const legendText = {
    correct: language === 'de' ? 'Reale Daten' : 'Correct answer',
    historical: language === 'de' ? 'Vorgaenger-Antworten' : 'Previous answers',
    user: language === 'de' ? 'Deine Antwort' : 'Your answer',
  }

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
    <Stack spacing={2.5} sx={{ py: 3 }} className="print-results-page">
      <style>{dynamicPrintStyle}</style>
      <PrintChart
        printData={printData}
        cssVariables={cssVariables}
        headerText={headerText}
        legendText={legendText}
        language={language}
        userName={userName}
        userAge={userAge}
      />
    </Stack>
  )
}
