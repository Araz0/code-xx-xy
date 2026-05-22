import { useMemo } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../../quizStore'
import { usePrinting } from '../../hooks/usePrinting'
import { PrintChart } from '../../components/PrintChart'
import './printResults.css'

export function PrintResultsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const rawQuestions = useStoreValue(quizStore, 'rawQuestions')
  const userAnswers = useStoreValue(quizStore, 'userAnswers')
  const userName = useStoreValue(quizStore, 'userName')
  const userAge = useStoreValue(quizStore, 'userAge')

  const state = location.state as { resultsSets?: number[][] } | null
  const resultsSets = useMemo(() => {
    if (state?.resultsSets && state.resultsSets.length > 0) {
      return state.resultsSets
    }
    return [userAnswers]
  }, [state, userAnswers])

  const { cssVariables, dynamicPrintStyle, printData } = usePrinting({
    questions: rawQuestions,
    resultsSets,
    autoPrint: true,
  })

  const legendText = {
    correct: t('results.legend.correct'),
    historical: t('results.legend.historical'),
    user: t('results.legend.user'),
  }

  if (!rawQuestions.length) {
    return (
      <Stack spacing={2} alignItems='center' sx={{ py: 3 }}>
        <Typography variant='h6'>{t('printResults.noResults')}</Typography>
        <Button variant='outlined' onClick={() => navigate('/')}>
          {t('printResults.backHome')}
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={2.5} sx={{ py: 3 }} className='print-results-page'>
      <style>{dynamicPrintStyle}</style>
      <PrintChart
        printData={printData}
        cssVariables={cssVariables}
        headerText={t('results.printHeader')}
        legendText={legendText}
        userName={userName}
        userAge={userAge}
      />
    </Stack>
  )
}
