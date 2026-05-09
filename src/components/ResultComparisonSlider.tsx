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

  // Circle sizes from config
  const userCircleSize = 16
  const correctCircleSize = 10

  return (
    <Fade in={visible} timeout={420}>
      <Stack spacing={2}>
        <Typography variant="subtitle1" color="text.secondary">
          Q{index + 1}: {title}
        </Typography>

        <Box>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 40,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Track bar */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 4,
                borderRadius: 999,
                bgcolor: 'grey.200',
                transform: 'translateY(-50%)',
                zIndex: 0,
              }}
            />

            {/* User estimate circle (big, filled black) */}
            <Box
              sx={{
                position: 'absolute',
                left: `${clampedEstimate}%`,
                top: '50%',
                width: userCircleSize,
                height: userCircleSize,
                borderRadius: '50%',
                bgcolor: '#000000',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 2,
                flexShrink: 0,
              }}
            />

            {/* Correct answer circle (mid-size, outlined) - only show on reveal */}
            {reveal && (
              <Fade in timeout={280}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${clampedActual}%`,
                    top: '50%',
                    width: correctCircleSize + 'px',
                    height: correctCircleSize + 'px',
                    border: '2px solid',
                    bgcolor: 'black',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    zIndex: 3,
                    flexShrink: 0,
                  }}
                />
              </Fade>
            )}
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 1.5 }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Your Estimate: {clampedEstimate}%
            </Typography>
            {reveal && (
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Real: {clampedActual}%
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>
    </Fade>
  )
}
