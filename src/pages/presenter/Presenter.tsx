import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../../quizStore'
import { PrintChartPresenter } from '../../components'
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
  const { t } = useTranslation()
  const rawQuestions = useStoreValue(quizStore, 'rawQuestions')
  const { resultsSets, loading, error } = usePresenterResults()

  const { cssVariables, dynamicPrintStyle, printData } = usePrinting({
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
          <Typography variant='body2'>{t('presenter.loading')}</Typography>
        ) : null}
      </Box>

      <div className='presenter-content'>
        <PrintChartPresenter
          printData={printData}
          cssVariables={presenterCssVariables}
          headerText={t('presenter.header')}
          subHeaderText={t('presenter.subHeader')}
          legendText={{
            correct: t('results.legend.correct'),
            historical: t('results.legend.historical'),
            user: t('results.legend.latest'),
          }}
        />
      </div>
    </Box>
  )
}
