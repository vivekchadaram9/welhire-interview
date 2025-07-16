import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#005AA9',
    },
    error: {
      main: '#FF3B30',
    },
    text: {
      primary: '#000000',
      secondary: '#535353',
    },
    secondary: {
      main: '#4B78FD',           
    },
    grey: {
      300: '#E0E0E0',            
      500: '#838383',            
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    subtitle1: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,                   
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',    
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: '#E0E0E0',
        },
      },
    },
  },
});

export const colors = {
  mainBackground: '#292F66',
  activeSideBackground: '#D9EBFF',
  activeIconColor: '#32337B',
};
