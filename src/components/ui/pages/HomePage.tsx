import React from 'react';
import { Box, Button, Typography, Card, CardContent, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  const pages = [
    {
      title: 'LinkedIn Search',
      description: 'Search and analyse LinkedIn profiles and companies',
      path: '/linkedinsearch',
      color: '#0077b5'
    },
    {
      title: 'Advert Posting',
      description: 'Generate and automatically post job adverts to Efin and the Logan Sinclair website',
      path: '/advertprocessing',
      color: '#28a745'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img
              src="/ls-logo-black.png"
              alt="Logan Sinclair"
              style={{
                maxWidth: '150px',
                height: 'auto',
                display: 'block',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            />
          </Link>
        </Box>
        <Button
          variant="outlined"
          onClick={logout}
          sx={{
            borderColor: '#007bff',
            color: '#007bff',
            '&:hover': {
              borderColor: '#0056b3',
              backgroundColor: '#f8f9fa'
            }
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            color: '#333',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textAlign: 'center'
          }}
        >
          LSD Dashboard
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: '#666',
            marginBottom: '3rem',
            textAlign: 'center',
            maxWidth: '600px'
          }}
        >
          Choose a tool to get started.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            maxWidth: '800px',
            width: '100%'
          }}
        >
          {pages.map((page) => (
            <Card
              key={page.path}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ flex: 1, padding: '2rem' }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#333',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                  }}
                >
                  {page.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6
                  }}
                >
                  {page.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ padding: '1rem 2rem 2rem' }}>
                <Button
                  component={Link}
                  to={page.path}
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: page.color,
                    padding: '0.75rem 2rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: page.color,
                      opacity: 0.9
                    }
                  }}
                >
                  Open {page.title}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
