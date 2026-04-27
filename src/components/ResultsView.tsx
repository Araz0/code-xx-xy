import { memo, useCallback, useEffect, useState } from 'react'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../quizStore'
import { ResultComparisonSlider } from './ResultComparisonSlider'
import { useNavigate } from 'react-router-dom'

const ResultsViewRaw = () => {
  const navigate = useNavigate()
  const allQuestions = useStoreValue(quizStore, 'allQuestions')
  const userAnswers = useStoreValue(quizStore, 'userAnswers')
  const totalQuestions = allQuestions.length
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
  const handlePrintClick = useCallback(() => {
    navigate('/print-results')
  }, [navigate])

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
    <Paper
      elevation={0}
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
  )
}

export const ResultsView = memo(ResultsViewRaw)
