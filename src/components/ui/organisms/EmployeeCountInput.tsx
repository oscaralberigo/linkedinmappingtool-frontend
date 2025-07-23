import React from 'react';
import { Box, Typography, TextField, Collapse } from '@mui/material';
import FilterSection from './FilterSection';
import { useEmployeeCountRange } from '../../../hooks';

interface EmployeeCountInputsProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const EmployeeCountInputs: React.FC<EmployeeCountInputsProps> = ({
  value,
  onChange,
  isOpen,
  onToggle
}) => {
  const { range, loading, error } = useEmployeeCountRange();

  const handleInputChange = (index: 0 | 1) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value.replace(/[^0-9]/g, ''));
    const updated = [...value] as [number, number];
    updated[index] = newValue;
    onChange(updated);
  };

  if (error) {
    return (
      <FilterSection
        title="Employee Count"
        isOpen={isOpen}
        onToggle={onToggle}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="error">
            Error loading employee count range: {error}
          </Typography>
        </Box>
      </FilterSection>
    );
  }

  return (
    <FilterSection
      title="Employee Count"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <Collapse in={isOpen}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Loading employee count range...
            </Typography>
          ) : range ? (
            <>
              <TextField
                label="Min employees"
                type="number"
                value={value[0]}
                onChange={handleInputChange(0)}
                inputProps={{ min: range.min, max: value[1], step: 1 }}
                fullWidth
                size="small"
              />
              <Typography variant="body2" color="text.secondary">to</Typography>
              <TextField
                label="Max employees"
                type="number"
                value={value[1]}
                onChange={handleInputChange(1)}
                inputProps={{ min: value[0], max: range.max, step: 1 }}
                fullWidth
                size="small"
              />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No employee count range available
            </Typography>
          )}
        </Box>
      </Collapse>
    </FilterSection>
  );
};

export default EmployeeCountInputs; 