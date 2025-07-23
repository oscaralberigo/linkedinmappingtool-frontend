import React from 'react';
import { Paper, PaperProps } from '@mui/material';

interface CardProps extends PaperProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  sx, 
  ...props 
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

export default Card; 