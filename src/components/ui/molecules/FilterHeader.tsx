import React from 'react';
import { Box, Typography } from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon 
} from '@mui/icons-material';

interface FilterHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  selectedCount?: number | string;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  title,
  isOpen,
  onToggle,
  selectedCount = 0
}) => {
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        '&:hover': {
          backgroundColor: 'grey.50',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        {selectedCount !== undefined && (
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              borderRadius: '50%',
              minWidth: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              padding: '0 4px',
            }}
          >
            {selectedCount}
          </Box>
        )}
      </Box>
      {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </Box>
  );
};

export default FilterHeader; 