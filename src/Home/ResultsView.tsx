import { memo, useEffect, useState } from 'react'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../quizStore'
import { ResultComparisonSlider } from './ResultComparisonSlider'

const ResultsViewRaw = () => {
  const questions = useStoreValue(quizStore, 'questions')
  const answers = useStoreValue(quizStore, 'answers')
  const revealRealValues = useStoreValue(quizStore, 'revealRealValues')
  const totalQuestions = questions.length
  const [visibleRows, setVisibleRows] = useState(0)
  const [revealedRows, setRevealedRows] = useState(0)

  useEffect(() => {
    if (!totalQuestions) return

    let index = 0
    const intervalId = window.setInterval(() => {
      index += 1
      setVisibleRows(index)

      if (index >= totalQuestions) {
        window.clearInterval(intervalId)
      }
    }, 85)

    return () => window.clearInterval(intervalId)
  }, [totalQuestions])

  useEffect(() => {
    if (!revealRealValues || !totalQuestions) return

    let index = 0
    const intervalId = window.setInterval(() => {
      index += 1
      setRevealedRows(index)

      if (index >= totalQuestions) {
        window.clearInterval(intervalId)
      }
    }, 110)

    return () => window.clearInterval(intervalId)
  }, [revealRealValues, totalQuestions])

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2.25, sm: 3.5 }, width: 'min(980px, 94vw)' }}
    >
      <Stack spacing={3.25}>
        <Typography variant='h4' component='h2' textAlign='center'>
          Your perception compared to real data
        </Typography>

        <Stack
          direction='row'
          spacing={2}
          justifyContent='center'
          flexWrap='wrap'
        >
          <Button
            variant='contained'
            color='secondary'
            disabled={revealRealValues}
            onClick={() => quizStore.set('revealResults')}
          >
            {revealRealValues ? 'Revealed' : 'Reveal'}
          </Button>
          <Button variant='outlined' onClick={() => quizStore.set('start')}>
            Restart
          </Button>
        </Stack>

        <Stack spacing={3}>
          {questions.map((question, index) => (
            <ResultComparisonSlider
              key={question.title}
              index={index}
              title={question.title}
              estimate={answers[question.title] ?? 50}
              actual={question.answer}
              visible={index < visibleRows}
              reveal={revealRealValues && index < revealedRows}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}

export const ResultsView = memo(ResultsViewRaw)
