import React from 'react';
import { Box, Stack } from '@mui/material';
import { Button } from '../atoms';

interface ActionButton {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  disabled?: boolean;
}

interface TwoActionButtonsProps {
  primaryAction: ActionButton;
  secondaryAction: ActionButton;
  loading?: boolean;
}

const TwoActionButtons: React.FC<TwoActionButtonsProps> = ({
  primaryAction,
  secondaryAction,
  loading = false
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" spacing={2}>
        <Button
          variant={primaryAction.variant || 'primary'}
          onClick={primaryAction.onClick}
          disabled={loading || primaryAction.disabled}
          fullWidth
        >
          {primaryAction.text}
        </Button>
        <Button
          variant={secondaryAction.variant || 'secondary'}
          onClick={secondaryAction.onClick}
          disabled={loading || secondaryAction.disabled}
          fullWidth
        >
          {secondaryAction.text}
        </Button>
      </Stack>
    </Box>
  );
};

export default TwoActionButtons; 