import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Paper,
  Avatar
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth endpoint
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
    window.location.href = `${baseUrl}/auth/google`;
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: 'primary.main',
            }}
          >
            <GoogleIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              backgroundColor: '#4285f4',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#3367d6',
              },
            }}
          >
            Sign in with Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;