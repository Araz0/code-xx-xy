import { memo } from 'react'
import './Home.styles.css'
import { Button, Stack, Typography } from '@mui/material'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../quizStore'
import { QuestionCard } from './QuestionCard'
import { ResultsView } from './ResultsView'

const HomeRaw = () => {
  const started = useStoreValue(quizStore, 'started')
  const completed = useStoreValue(quizStore, 'completed')
  const totalQuestions = useStoreValue(quizStore, 'totalQuestions')
  const showResults = useStoreValue(quizStore, 'showResults')

  return (
    <div className='page-container'>
      <Typography variant='h3' component='h1' gutterBottom>
        Occlusion
      </Typography>
      {!started && (
        <Stack
          direction='row'
          spacing={2}
          flexWrap='wrap'
          justifyContent='center'
        >
          <Button
            variant='contained'
            color='primary'
            onClick={() => quizStore.set('start')}
          >
            Start
          </Button>
          <Button variant='outlined' href='/test-page'>
            Test Page
          </Button>
        </Stack>
      )}

      {started && !completed && <QuestionCard />}

      {started && completed && (
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
      )}

      {started && completed && showResults && <ResultsView />}
    </div>
  )
}

export const Home = memo(HomeRaw)
