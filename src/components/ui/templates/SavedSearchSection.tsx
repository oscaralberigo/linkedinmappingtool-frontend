import React from 'react';
import { Box, Typography } from '@mui/material';
import { GenericSearchableDropdown } from '../molecules';
import { SavedSearchResponse } from '../../../types/search';

interface SavedSearchSectionProps {
  savedSearches: SavedSearchResponse[];
  onLoadSearch: (searchId: number) => void;
  loading: boolean;
}

const SavedSearchSection: React.FC<SavedSearchSectionProps> = ({
  savedSearches,
  onLoadSearch,
  loading
}) => {
  // Transform SavedSearchResponse to DropdownItem format
  const dropdownItems = savedSearches.map(search => ({
    label: search.search_name,
    ...search // Keep all original properties including id
  }));

  return (
    <Box sx={{ px: 3, mb: 4, mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Load a Saved Search
      </Typography>
      <GenericSearchableDropdown
        title="Choose from an existing search..."
        items={dropdownItems}
        onSelect={(itemId) => onLoadSearch(Number(itemId))}
        placeholder="Saved searches..."
        loading={loading}
        emptyMessage="No saved searches found"
        loadingMessage="Loading saved searches..."
      />
    </Box>
  );
};

export default SavedSearchSection; 