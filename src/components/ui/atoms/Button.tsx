import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'error';
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
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button; 