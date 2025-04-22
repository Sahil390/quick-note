import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&[color="primary"]': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          }
        }
      }
    }
  }
});

export default theme;