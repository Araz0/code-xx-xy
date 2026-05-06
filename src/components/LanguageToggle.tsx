import { memo, useCallback } from 'react'
import { Button, Stack } from '@mui/material'
import { useStoreValue } from 'zustand-x'
import { quizStore } from '../quizStore'

const LanguageToggleRaw = () => {
  const language = useStoreValue(quizStore, 'language')

  const handleToggle = useCallback(() => {
    quizStore.set('toggleLanguage')
  }, [])

  return (
    <Stack
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <Button
        size="small"
        variant={language === 'en' ? 'contained' : 'outlined'}
        onClick={handleToggle}
        sx={{
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          fontWeight: 700,
          minWidth: 60,
        }}
      >
        {language === 'en' ? 'EN' : 'DE'}
      </Button>
    </Stack>
  )
}

export const LanguageToggle = memo(LanguageToggleRaw)
