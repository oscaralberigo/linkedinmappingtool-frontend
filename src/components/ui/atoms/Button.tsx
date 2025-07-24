import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'linkedin';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  sx, 
  ...props 
}) => {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return { variant: 'contained' as const, color: 'primary' as const };
      case 'secondary':
        return { variant: 'outlined' as const, color: 'primary' as const };
      case 'success':
        return { variant: 'contained' as const, color: 'success' as const };
      case 'error':
        return { variant: 'contained' as const, color: 'error' as const };
      case 'linkedin':
        return { variant: 'contained' as const, color: 'primary' as const };
      default:
        return { variant: 'contained' as const, color: 'primary' as const };
    }
  };

  return (
    <MuiButton
      {...getVariantProps()}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 500,
        ...(variant === 'linkedin' && {
          backgroundColor: '#0077b5', // LinkedIn blue
          color: 'white',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 119, 181, 0.2)',
          '&:hover': {
            backgroundColor: '#005885', // Darker LinkedIn blue on hover
            boxShadow: '0 4px 8px rgba(0, 119, 181, 0.3)',
          },
          '&:disabled': {
            backgroundColor: '#cccccc',
            color: '#666666',
            boxShadow: 'none',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button; 