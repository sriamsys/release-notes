import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#006578',
      light: '#008097',
      dark: '#004e5d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5d5e61',
      light: '#e2e2e5',
      dark: '#454749',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0b1c30',
      secondary: '#3d494c',
    },
    divider: 'rgba(189, 200, 205, 0.5)', // outline-variant mockup colour
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: 'none',
          padding: '6px 16px',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid rgba(189, 200, 205, 0.4)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
        },
      },
    },
  },
});
