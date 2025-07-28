import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { apiService } from '../../../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to make an API call to check if user is authenticated
        await apiService.getBusinessModels(); // or any protected endpoint
        setIsAuthenticated(true);
      } catch (error: any) {
        if (error.message.includes('401') || error.message.includes('Not authenticated')) {
          setIsAuthenticated(false);
        } else {
          // Other errors (network, etc.) - assume not authenticated
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;