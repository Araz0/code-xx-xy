import { memo } from 'react'
import { Stack, Typography, Button } from '@mui/material'
import { QuestionCard } from '../../components'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../../quizStore'

export const FormRaw = () => {
  const totalQuestions = useStoreValue(quizStore, 'totalQuestions')
  const showResults = useStoreValue(quizStore, 'showResults')

  return (
    <>
      <QuestionCard />
      <Stack spacing={2} alignItems='center' sx={{ mt: 2 }}>
        {!showResults && (
          <>
            <Typography variant='h5'>
              All {totalQuestions} questions completed.
            </Typography>
            <Button
              variant='contained'
              onClick={() => quizStore.set('showResults')}
            >
              Show Results
            </Button>
            <Button variant='outlined' onClick={() => quizStore.set('start')}>
              Restart
            </Button>
          </>
        )}
      </Stack>
    </>
  )
}

export const Form = memo(FormRaw)
