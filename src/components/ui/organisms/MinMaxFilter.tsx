import React from 'react';
import { Box, Typography, TextField, Collapse } from '@mui/material';
import FilterSection from './FilterSection';

interface Range {
  min: number;
  max: number;
}

interface MinMaxFilterProps {
  title: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  isOpen: boolean;
  onToggle: () => void;
  range?: Range;
  loading?: boolean;
  error?: string;
  minLabel?: string;
  maxLabel?: string;
  step?: number;
  placeholder?: string;
}

const MinMaxFilter: React.FC<MinMaxFilterProps> = ({
  title,
  value,
  onChange,
  isOpen,
  onToggle,
  range,
  loading = false,
  error,
  minLabel = 'Min',
  maxLabel = 'Max',
  step = 1,
  placeholder = 'Enter value'
}) => {
  const handleInputChange = (index: 0 | 1) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value.replace(/[^0-9]/g, ''));
    const updated = [...value] as [number, number];
    updated[index] = newValue;
    onChange(updated);
  };

  if (error) {
    return (
      <FilterSection
        title={title}
        isOpen={isOpen}
        onToggle={onToggle}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="error">
            Error loading range: {error}
          </Typography>
        </Box>
      </FilterSection>
    );
  }

  return (
    <FilterSection
      title={title}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <Collapse in={isOpen}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Loading range...
            </Typography>
          ) : range ? (
            <>
              <TextField
                label={minLabel}
                type="number"
                value={value[0]}
                onChange={handleInputChange(0)}
                inputProps={{ 
                  min: range.min, 
                  max: value[1], 
                  step: step,
                  placeholder: placeholder
                }}
                fullWidth
                size="small"
              />
              <Typography variant="body2" color="text.secondary">to</Typography>
              <TextField
                label={maxLabel}
                type="number"
                value={value[1]}
                onChange={handleInputChange(1)}
                inputProps={{ 
                  min: value[0], 
                  max: range.max, 
                  step: step,
                  placeholder: placeholder
                }}
                fullWidth
                size="small"
              />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No range available
            </Typography>
          )}
        </Box>
      </Collapse>
    </FilterSection>
  );
};

export default MinMaxFilter; 