import { createTheme, darken, lighten } from '@mui/material/styles'

const brandMain = '#030213'
const brandLight = lighten(brandMain, 0.2)
const brandLighter = lighten(brandMain, 0.35)
const brandDark = darken(brandMain, 0.2)

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandMain,
      light: brandLight,
      dark: brandDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: brandLight,
      light: brandLighter,
      dark: brandMain,
      contrastText: '#ffffff',
    },
    info: {
      main: brandLighter,
    },
    success: {
      main: '#1f5f4d',
    },
    warning: {
      main: '#7a5c26',
    },
    error: {
      main: '#7a2f42',
    },
    background: {
      default: '#f4f4fa',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          paddingBlock: '12px',
          paddingInline: '48px',
        },
      },
    },
  },
})
