import { memo } from 'react'
import './Home.styles.css'
import { Button, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useNavigate } from 'react-router-dom'
import { LanguageToggle } from '../../components'

const HomeRaw = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <>
      <LanguageToggle />
      <h1>{t('home.title')}</h1>

      <Stack
        direction='row'
        spacing={2}
        flexWrap='wrap'
        justifyContent='center'
      >
        <Button
          variant='contained'
          color='primary'
          onClick={() => navigate('/form')}
        >
          {t('home.start')}
        </Button>
      </Stack>
    </>
  )
}

export const Home = memo(HomeRaw)
