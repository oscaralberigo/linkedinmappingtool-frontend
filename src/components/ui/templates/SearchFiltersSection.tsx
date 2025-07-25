import React from 'react';
import { Box, Typography } from '@mui/material';
import { SearchBar } from '../molecules';
import { MultiSelectDropdown } from '../molecules';
import MinMaxFilter from '../organisms/MinMaxFilter';
import { useEmployeeCountRange } from '../../../hooks';

interface SearchFiltersSectionProps {
  keywords?: string;
  onKeywordsChange?: (keywords: string) => void;
  categories: Array<{ id: string | number; name: string }>;
  selectedCategories: Array<string | number>;
  onCategoriesChange: (categories: Array<string | number>) => void;
  sizeRange: [number, number];
  onSizeRangeChange: (range: [number, number]) => void;
  isSizeOpen: boolean;
  onSizeToggle: () => void;
  loadingCategories: boolean;
}

const SearchFiltersSection: React.FC<SearchFiltersSectionProps> = ({
  keywords,
  onKeywordsChange,
  categories,
  selectedCategories,
  onCategoriesChange,
  sizeRange,
  onSizeRangeChange,
  isSizeOpen,
  onSizeToggle,
  loadingCategories
}) => {
  const { range, loading: rangeLoading, error: rangeError } = useEmployeeCountRange();

  return (
    <Box sx={{ px: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Create a New Search
      </Typography>
      <SearchBar
        value={keywords || ''}
        onChange={onKeywordsChange || (() => {})}
        placeholder="keywords"
      />
      <Box>
        <MultiSelectDropdown
          title="Company categories"
          items={categories.map(cat => ({ label: cat.name, ...cat }))}
          selectedItems={selectedCategories}
          onSelectionChange={onCategoriesChange}
          placeholder="Search categories..."
          loading={loadingCategories}
        />
        <MinMaxFilter
          title="Employee Count"
          value={sizeRange}
          onChange={onSizeRangeChange}
          isOpen={isSizeOpen}
          onToggle={onSizeToggle}
          range={range || undefined}
          loading={rangeLoading}
          error={rangeError || undefined}
          minLabel="Min employees"
          maxLabel="Max employees"
        />
      </Box>
    </Box>
  );
};

export default SearchFiltersSection; 