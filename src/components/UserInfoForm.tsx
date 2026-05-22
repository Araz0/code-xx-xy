import { memo, useCallback, useState } from 'react'
import {
  Box,
  Button,
  Fade,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../quizStore'
import { useNavigate } from 'react-router-dom'
import { useSupabase } from '../hooks/useSupabase'

const UserInfoFormRaw = () => {
  const navigate = useNavigate()
  const language = useStoreValue(quizStore, 'language')
  const userAnswers = useStoreValue(quizStore, 'userAnswers')
  const { t } = useTranslation()
  const { submitQuizResults } = useSupabase()

  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  const handleClickFinish = useCallback(async () => {
    // Save name and age to store
    quizStore.set('setUserName', name)
    quizStore.set('setUserAge', age)

    // Submit quiz results
    quizStore.set('finishQuiz')
    const { error } = await submitQuizResults({
      answers: userAnswers,
      language,
    })
    if (error) {
      console.error('Failed to submit quiz results', error)
    }

    // Navigate to results page
    navigate('/results', { state: { autoPrint: true } })
  }, [name, age, userAnswers, language, navigate, submitQuizResults])

  return (
    <Fade in timeout={280}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          width: 'min(900px, 92vw)',
          textAlign: 'center',
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
        <Stack spacing={4} alignItems='center'>
          <Typography variant='h3'>{t('userInfo.title')}</Typography>

          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Stack spacing={3}>
              <TextField
                label={t('userInfo.nameLabel')}
                placeholder={t('userInfo.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                variant='outlined'
              />
              <TextField
                label={t('userInfo.ageLabel')}
                placeholder={t('userInfo.agePlaceholder')}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                fullWidth
                variant='outlined'
                type='number'
                inputProps={{ min: '0', max: '150' }}
              />
            </Stack>
          </Box>

          <Button variant='contained' onClick={handleClickFinish}>
            {t('userInfo.finish')}
          </Button>
        </Stack>
      </Paper>
    </Fade>
  )
}

export const UserInfoForm = memo(UserInfoFormRaw)
