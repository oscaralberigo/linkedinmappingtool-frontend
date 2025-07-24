import React from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';

type TextFieldProps = MuiTextFieldProps & {
  children?: React.ReactNode;
};

const TextField: React.FC<TextFieldProps> = ({ 
  children, 
  sx, 
  ...props 
}) => {
  return (
    <MuiTextField
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: 'white',
          '& fieldset': {
            borderColor: 'grey.300',
          },
          '&:hover fieldset': {
            borderColor: 'grey.400',
          },
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiTextField>
  );
};

export default TextField; 