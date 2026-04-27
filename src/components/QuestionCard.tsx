import { memo } from 'react'
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
import { useNavigate } from 'react-router-dom'

const QuestionCardRaw = () => {
  const navigate = useNavigate()
  const currentQuestion = useStoreValue(quizStore, 'currentQuestion')
  const currentIndex = useStoreValue(quizStore, 'currentIndex')
  const totalQuestions = useStoreValue(quizStore, 'totalQuestions')
  const currentGuess = useStoreValue(quizStore, 'currentGuess')
  const isLastQuestion = useStoreValue(quizStore, 'isLastQuestion')

  if (!currentQuestion) return null

  return (
    <Fade in key={currentQuestion.title} timeout={280}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          width: 'min(900px, 92vw)',
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
        <Stack spacing={2.5}>
          <Typography variant='overline' color='text.secondary'>
            Question {currentIndex + 1} of {totalQuestions}
          </Typography>

          <Typography variant='h5' component='h2'>
            Question:
          </Typography>

          <Typography variant='body1'>{currentQuestion.question}</Typography>

          <Box sx={{ px: 1 }}>
            <Slider
              min={0}
              max={100}
              step={1}
              value={currentGuess}
              valueLabelDisplay='on'
              onChange={(_, value) =>
                quizStore.set(
                  'setCurrentGuess',
                  Array.isArray(value) ? value[0] : value,
                )
              }
            />
          </Box>

          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography color='text.secondary'>
              Your answer: {currentGuess}
            </Typography>
            <Button variant='contained' onClick={() => navigate('/results')}>
              {isLastQuestion ? 'Finish' : 'Next'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Fade>
  )
}

export const QuestionCard = memo(QuestionCardRaw)
