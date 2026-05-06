import { memo, useCallback } from 'react'
import {
  Box,
  Button,
  Fade,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../quizStore'

const QuestionCardRaw = () => {
  const currentQuestion = useStoreValue(quizStore, 'currentQuestion')
  const currentIndex = useStoreValue(quizStore, 'currentIndex')
  const totalQuestions = useStoreValue(quizStore, 'totalQuestions')
  const currentGuess = useStoreValue(quizStore, 'currentGuess')
  const isLastQuestion = useStoreValue(quizStore, 'isLastQuestion')

  const handleClickNext = useCallback(async () => {
    if (isLastQuestion) {
      // Show user info form instead of finishing immediately
      quizStore.set('showUserInfoForm')
      return
    }
    quizStore.set('nextQuestion')
  }, [isLastQuestion])

  const handleOnSliderChange = useCallback(
    (_: Event, value: number | number[]) => {
      quizStore.set(
        'updateCurrentAnswer',
        Array.isArray(value) ? value[0] : value,
      )
    },
    [],
  )

  if (!currentQuestion) return null

  return (
    <Fade in key={currentQuestion.title} timeout={280}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          width: 'min(900px, 92vw)',
          textAlign: 'center', // Center align all text
          animation: 'questionReveal 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          '@keyframes questionReveal': {
            '0%': {
              opacity: 0,
              transform: 'translateY(16px) scale(0.99)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0) scale(1)',
            },
          },
        }}
      >
        <Stack spacing={4} alignItems="center">
          {' '}
          {/* Center align stack items */}
          <Typography variant="overline" color="text.secondary">
            Question {currentIndex + 1} of {totalQuestions}
          </Typography>
          <Typography variant="h3">{currentQuestion.question}</Typography>
          <Typography variant="h1">{currentGuess}</Typography>
          <Box
            sx={{
              px: 1,
              mt: 2,
              width: '100%', // Ensure slider takes full width
            }}
          >
            <Slider
              min={0}
              max={100}
              step={1}
              value={currentGuess}
              onChange={handleOnSliderChange}
              sx={{
                '& .MuiSlider-thumb': {
                  color: 'black', // Set the slider knob color to black
                },
                '& .MuiSlider-track': {
                  color: 'transparent', // Remove the track color
                },
              }}
            />
          </Box>
          <Button variant="contained" onClick={handleClickNext}>
            {isLastQuestion ? 'Next' : 'Next'}
          </Button>
        </Stack>
      </Paper>
    </Fade>
  )
}

export const QuestionCard = memo(QuestionCardRaw)
