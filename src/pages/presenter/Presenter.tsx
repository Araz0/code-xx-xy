import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Box, Typography } from '@mui/material'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../../quizStore'
import { PrintChart } from '../../components/PrintChart'
import { usePrinting } from '../../hooks/usePrinting'
import { usePresenterResults } from '../../hooks/usePresenterResults'
import '../printing/printResults.css'
import './presenter.css'

function applyPresenterCssVariables(cssVariables: CSSProperties) {
  return {
    ...cssVariables,
    '--page-bg': '#ffffff',
    '--screen-max-width': '100vw',
  } as CSSProperties
}

export function PresenterPage() {
  const rawQuestions = useStoreValue(quizStore, 'rawQuestions')
  const language = useStoreValue(quizStore, 'language')
  const { resultsSets, loading, error } = usePresenterResults()

  const { config, cssVariables, dynamicPrintStyle, printData } = usePrinting({
    questions: rawQuestions,
    resultsSets,
  })

  const presenterCssVariables = useMemo(
    () => applyPresenterCssVariables(cssVariables),
    [cssVariables],
  )

  return (
    <Box className='presenter-page'>
      <style>{dynamicPrintStyle}</style>

      <Box className='presenter-status' aria-live='polite'>
        {error ? (
          <Typography variant='body2'>{error}</Typography>
        ) : loading ? (
          <Typography variant='body2'>Loading live results...</Typography>
        ) : null}
      </Box>

      <div className='presenter-content'>
        <PrintChart
          printData={printData}
          cssVariables={presenterCssVariables}
          headerText={config.headerTextEn || 'Presenter'}
          legendText={{
            correct: 'Correct answer',
            historical: 'Previous answers',
            user: 'Latest answer',
          }}
          language={language}
        />
      </div>
    </Box>
  )
}
