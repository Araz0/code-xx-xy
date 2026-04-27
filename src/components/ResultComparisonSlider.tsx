import { Box, Fade, Stack, Typography } from '@mui/material'

type ResultComparisonSliderProps = {
  index: number
  title: string
  estimate: number
  actual: number
  visible: boolean
  reveal: boolean
}

export const ResultComparisonSlider = ({
  index,
  title,
  estimate,
  actual,
  visible,
  reveal,
}: ResultComparisonSliderProps) => {
  const clampedEstimate = Math.max(0, Math.min(100, estimate))
  const clampedActual = Math.max(0, Math.min(100, actual))

  return (
    <Fade in={visible} timeout={420}>
      <Stack spacing={1.25}>
        <Typography variant='subtitle1' color='text.secondary'>
          Q{index + 1}: {title}
        </Typography>

        <Typography
          variant='caption'
          sx={{ fontWeight: 700, letterSpacing: 0.8 }}
        >
          YOUR ESTIMATE
        </Typography>

        <Box sx={{ position: 'relative', px: 0.75, pt: 1.5 }}>
          <Box
            sx={{
              height: 12,
              borderRadius: 999,
              bgcolor: 'grey.200',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <Box
              sx={{
                width: `${clampedEstimate}%`,
                height: '100%',
                borderRadius: 999,
                bgcolor: 'primary.main',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                left: `calc(${clampedEstimate}% - 7px)`,
                top: '50%',
                width: 14,
                height: 14,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                border: '2px solid #fff',
                transform: 'translateY(-50%)',
                boxShadow: 1,
                zIndex: 2,
              }}
            />

            {reveal && (
              <Fade in timeout={280}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: `calc(${clampedActual}% - 7px)`,
                    top: '50%',
                    width: 14,
                    height: 14,
                    border: '2px solid',
                    borderColor: 'secondary.main',
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    boxShadow: 2,
                    zIndex: 4,
                  }}
                />
              </Fade>
            )}

            {reveal && (
              <Fade in timeout={280}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: `calc(${clampedActual}% - 1px)`,
                    top: -18,
                    width: 2,
                    height: 38,
                    bgcolor: 'secondary.main',
                    opacity: 0.8,
                    zIndex: 3,
                  }}
                />
              </Fade>
            )}
          </Box>

          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            sx={{ mt: 0.75 }}
          >
            <Typography variant='caption'>
              {clampedEstimate.toFixed(1)}%
            </Typography>
            {reveal && (
              <Typography
                variant='caption'
                sx={{ color: 'secondary.main', fontWeight: 700 }}
              >
                Real: {clampedActual.toFixed(1)}%
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>
    </Fade>
  )
}
