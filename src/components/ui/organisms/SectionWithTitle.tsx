import React from 'react';
import { Box, Typography } from '@mui/material';

interface SectionWithTitleProps {
  title: string;
  children: React.ReactNode;
  padding?: number | string;
  marginBottom?: number | string;
  marginTop?: number | string;
  titleVariant?: 'h6' | 'h5' | 'h4' | 'h3';
  titleMarginBottom?: number | string;
}

const SectionWithTitle: React.FC<SectionWithTitleProps> = ({
  title,
  children,
  padding = 3,
  marginBottom = 4,
  marginTop = 4,
  titleVariant = 'h6',
  titleMarginBottom = 1
}) => {
  return (
    <Box sx={{ 
      px: padding, 
      mb: marginBottom, 
      mt: marginTop 
    }}>
      <Typography 
        variant={titleVariant} 
        sx={{ mb: titleMarginBottom }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default SectionWithTitle; 