import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LinkedInSearch from './components/pages/LinkedInSearch';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LinkedInSearch />
    </ThemeProvider>
  );
}

export default App; 