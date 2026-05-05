import { memo } from 'react'
import './Home.styles.css'
import { Button, Stack } from '@mui/material'

import { useNavigate } from 'react-router-dom'

const HomeRaw = () => {
  const navigate = useNavigate()

  return (
    <>
      <h1>CODE-XX-XY</h1>

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
          Start
        </Button>
      </Stack>
    </>
  )
}

export const Home = memo(HomeRaw)
