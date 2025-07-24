import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
}

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

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  sidebar,
  mainContent
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {sidebar}
        <Box sx={{ flex: 1, p: 3, backgroundColor: '#f5f5f5' }}>
          {mainContent}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SidebarLayout; 