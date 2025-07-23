// Imports
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack
} from '@mui/material';
import { SearchBar } from './ui';
import { SearchableDropdown, SavedSearchSelector } from './ui';
import EmployeeCountInputs from './ui/organisms/EmployeeCountInput';
import { Button } from './ui';
import { useBusinessModels } from '../hooks/useBusinessModels';
import { useCompanies } from '../hooks/useCompanies';
import { useEmployeeCountRange } from '../hooks';
import { SearchFilters, CompanyWithLinkedInId } from '../types/search';
import { useSavedSearches } from '../hooks';

interface SidebarProps {
  onSearch: (filters: SearchFilters) => void;
  onAddManuallySelectedCompanies: (selectedCompanyIds: Array<string | number>, allCompanies: Array<{ id: string | number; name: string }>) => void;
  onSaveSearch: () => void;
  onLoadSavedSearch: (searchId: number) => void;
  onRefreshSavedSearches?: (refreshFn: () => void) => void;
  loading: boolean;
  searchResults: CompanyWithLinkedInId[];
}

const Sidebar: React.FC<SidebarProps> = ({
  onSearch,
  onAddManuallySelectedCompanies,
  onSaveSearch,
  onLoadSavedSearch,
  onRefreshSavedSearches,
  loading,
  searchResults
}) => {
  const [keywords, setKeywords] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Array<string | number>>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Array<string | number>>([]);
  const [sizeRange, setSizeRange] = useState<[number, number]>([166, 228522]);
  const [isSizeOpen, setIsSizeOpen] = useState(false);

  const { savedSearches, loading: savedSearchesLoading, refresh } = useSavedSearches();
  const { range: employeeRange } = useEmployeeCountRange();

  // Custom hooks for data fetching
  const { categories, loading: loadingCategories } = useBusinessModels();
  const { companies, loading: loadingCompanies } = useCompanies();

  // Update size range when employee range data loads
  useEffect(() => {
    if (employeeRange) {
      setSizeRange([employeeRange.min, employeeRange.max]);
    }
  }, [employeeRange]);

  // Pass the refresh function to parent component
  useEffect(() => {
    if (onRefreshSavedSearches) {
      onRefreshSavedSearches(refresh);
    }
  }, [onRefreshSavedSearches, refresh]);

  // Filter companies dropdown to exclude those already in search results
  const filteredCompanies = companies.filter(company => {
    // If no search has been performed yet, show all companies
    if (searchResults.length === 0) {
      return true;
    }
    
    // Filter out companies that are already in search results
    return !searchResults.some(searchResult => 
      searchResult.company_id.toString() === company.id.toString() ||
      searchResult.linkedin_id === company.linkedin_id.toString()
    );
  });

  const handleGenerateSearch = () => {
    const businessModels = selectedCategories.map(id => 
      categories.find((cat: { id: string | number; name: string }) => cat.id === id)?.name || ''
    ).filter(Boolean).join(',');
    
    // Use the actual employee count values from the text inputs
    const sizeFrom = sizeRange[0];
    const sizeTo = sizeRange[1];
    
    const filters: SearchFilters = {
      businessModels: businessModels || undefined, // Only include if not empty
      sizeFrom: sizeFrom,
      sizeTo: sizeTo,
    };

    console.log('Search filters:', filters); // Debug log
    onSearch(filters);
  };

  const handleSaveSearch = () => {
    onSaveSearch();
  };

  const handleSavedSearchSelect = (searchId: number) => {
    onLoadSavedSearch(searchId);
  };

  const handleManuallySelectedCompaniesChange = (selectedIds: Array<string | number>) => {
    setSelectedCompanies(selectedIds);
    onAddManuallySelectedCompanies(selectedIds, companies);
  };

  return (
    <Box
      sx={{
        width: '50%',
        backgroundColor: 'white',
        borderRight: '1px solid',
        borderColor: 'grey.200',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <img 
          src="/ls-logo-black.png" 
          alt="Logan Sinclair" 
          style={{ 
            maxWidth: '200px', 
            height: 'auto',
            display: 'block'
          }} 
        />
      </Box>

      {/* Search Bar */}
      <Box sx={{ p: 3 }}>
        <SearchBar
          value={keywords}
          onChange={setKeywords}
          placeholder="keywords"
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="primary"
            onClick={handleGenerateSearch}
            disabled={loading}
            fullWidth
          >
            Generate Search
          </Button>
          <Button
            variant="success"
            onClick={handleSaveSearch}
            disabled={loading}
            fullWidth
          >
            Save Search
          </Button>
        </Stack>
      </Box>

      {/* User Saved Searches Selector */}
      <Box sx={{ px: 3, mb: 2 }}>
        <SavedSearchSelector
          title="Choose from existing custom searches..."
          savedSearches={savedSearches}
          onSelect={handleSavedSearchSelect}
          placeholder="Search saved searches..."
          loading={savedSearchesLoading}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
        <Box sx={{ flex: 1, height: 1, borderBottom: '1px solid', borderColor: 'grey.300', mr: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Or, create a new search
        </Typography>
        <Box sx={{ flex: 1, height: 1, borderBottom: '1px solid', borderColor: 'grey.300', ml: 2 }} />
      </Box>

      {/* Filters */}
      <Box>
        <SearchableDropdown
          title="Company categories"
          items={categories}
          selectedItems={selectedCategories}
          onSelectionChange={setSelectedCategories}
          placeholder="Search categories..."
          loading={loadingCategories}
        />

        <EmployeeCountInputs
          value={sizeRange}
          onChange={setSizeRange}
          isOpen={isSizeOpen}
          onToggle={() => setIsSizeOpen(!isSizeOpen)}
        />

        <SearchableDropdown
          title="Add companies manually"
          items={filteredCompanies}
          selectedItems={selectedCompanies}
          onSelectionChange={handleManuallySelectedCompaniesChange}
          placeholder="Search companies..."
          loading={loadingCompanies}
        />
      </Box>
    </Box>
  );
};

export default Sidebar;