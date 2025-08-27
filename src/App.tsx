import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './components/ui/pages/LoginPage';
import LinkedInSearch from './components/ui/pages/LinkedInSearch';
import AdvertProcessingPage from './components/ui/pages/AdvertProcessingPage';
import ProtectedRoute from './components/ui/pages/ProtectedRoute';
import RootRedirect from './components/ui/pages/RootRedirect';
import { AuthProvider } from './contexts/AuthContext';

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
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/linkedinsearch"
                element={
                  <ProtectedRoute>
                    <LinkedInSearch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/advertprocessing"
                element={
                  <ProtectedRoute>
                    <AdvertProcessingPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App; 