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
      default: '#ffffff',
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
          letterSpacing: '0.1rem',
          paddingInline: '48px',
        },
      },
    },
  },
  typography: {
    fontFamily:
      'Swis721 BT, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: 'Swis721 BT Bold',
      fontSize: '2.5rem',
      letterSpacing: '0.5px',
    },
    h2: {
      fontFamily: 'Swis721 BT Bold',
      fontSize: '2rem',
      letterSpacing: '0.5px',
    },
    h3: {
      fontFamily: 'Swiss 721 Rounded Bold',
      fontSize: '1.75rem',
      letterSpacing: '0.5px',
    },
    h4: {
      fontFamily: 'Swis721 BT Bold',
      fontSize: '1.5rem',
      letterSpacing: '0.5px',
    },
    h5: {
      fontFamily: 'Swis721 BT Bold',
      fontSize: '1.25rem',
      letterSpacing: '0.5px',
    },
    h6: {
      fontFamily: 'Swis721 BT Bold',
      fontSize: '1.125rem',
      letterSpacing: '0.5px',
    },
  },
})
