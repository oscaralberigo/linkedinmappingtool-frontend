import React from 'react';
import { Box, Collapse } from '@mui/material';
import { FilterHeader } from '../molecules';

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  selectedCount?: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
  selectedCount = 0
}) => {
  return (
    <Box>
      <FilterHeader
        title={title}
        isOpen={isOpen}
        onToggle={onToggle}
        selectedCount={selectedCount}
      />
      <Collapse in={isOpen}>
        {children}
      </Collapse>
    </Box>
  );
};

export default FilterSection; 