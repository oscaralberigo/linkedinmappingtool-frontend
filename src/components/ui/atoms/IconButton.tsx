import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';

interface IconButtonProps extends MuiIconButtonProps {
  children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ 
  children, 
  sx, 
  ...props 
}) => {
  return (
    <MuiIconButton
      sx={{
        borderRadius: 1,
        '&:hover': {
          backgroundColor: 'grey.100',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiIconButton>
  );
};

export default IconButton; 