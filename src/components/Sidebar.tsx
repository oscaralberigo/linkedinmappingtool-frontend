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
import { useEmployeeCountRange } from '../hooks';
import { SearchFilters } from '../types/search';
import { useSavedSearches } from '../hooks';
import { Company } from '../types/company';

interface SidebarProps {
  onGetCompanies: (filters: SearchFilters, keywords?: string) => void;
  onAddManuallySelectedCompany: (companyId: string | number) => void;
  onRemoveManuallySelectedCompany: (companyId: string | number) => void;
  onSaveSearch: () => void;
  onLoadSavedSearch: (searchId: number) => void;
  onRefreshSavedSearches?: (refreshFn: () => void) => void;
  loading: boolean;
  companies: Company[];
  availableForManualSelection: Company[];
}

const Sidebar: React.FC<SidebarProps> = ({
  onGetCompanies,
  onAddManuallySelectedCompany,
  onRemoveManuallySelectedCompany,
  onSaveSearch,
  onLoadSavedSearch,
  onRefreshSavedSearches,
  loading,
  companies,
  availableForManualSelection
}) => {
  const [keywords, setKeywords] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Array<string | number>>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Array<string | number>>([]);
  const [sizeRange, setSizeRange] = useState<[number, number]>([166, 228522]);
  const [isSizeOpen, setIsSizeOpen] = useState(false);

  const { savedSearches, loading: savedSearchesLoading, refresh } = useSavedSearches();
  const { range: employeeRange } = useEmployeeCountRange();
  const { categories, loading: loadingCategories } = useBusinessModels();

  useEffect(() => {
    if (employeeRange) {
      setSizeRange([employeeRange.min, employeeRange.max]);
    }
  }, [employeeRange]);

  useEffect(() => {
    if (onRefreshSavedSearches) {
      onRefreshSavedSearches(refresh);
    }
  }, [onRefreshSavedSearches, refresh]);

  // Update selectedCompanies to reflect manually added companies in the current list
  useEffect(() => {
    const manuallyAddedIds = companies
      .filter(company => company.added_manually)
      .map(company => company.id);
    setSelectedCompanies(manuallyAddedIds);
  }, [companies]);

  // Calculate available count for manual dropdown
  const availableCount = availableForManualSelection.length;

  const handleGetCompanies = () => {
    const businessModels = selectedCategories.map(id => 
      categories.find((cat: { id: string | number; name: string }) => cat.id === id)?.name || ''
    ).filter(Boolean).join(',');
    const sizeFrom = sizeRange[0];
    const sizeTo = sizeRange[1];
    const filters: SearchFilters = {
      businessModels: businessModels || undefined,
      sizeFrom: sizeFrom,
      sizeTo: sizeTo,
    };
    onGetCompanies(filters, keywords.trim());
  };

  const handleSaveSearch = () => {
    onSaveSearch();
  };

  const handleSavedSearchSelect = (searchId: number) => {
    onLoadSavedSearch(searchId);
  };

  const handleManuallySelectedCompanyChange = (selectedIds: (string | number)[]) => {
    // Find newly added companies (in selectedIds but not in current selectedCompanies)
    const newlyAdded = selectedIds.filter(id => !selectedCompanies.includes(id));
    
    // Find newly removed companies (in current selectedCompanies but not in selectedIds)
    const newlyRemoved = selectedCompanies.filter(id => !selectedIds.includes(id));
    
    // Add newly selected companies to the main list
    newlyAdded.forEach(id => {
      onAddManuallySelectedCompany(id);
    });
    
    // Remove newly deselected companies from the main list
    newlyRemoved.forEach(id => {
      onRemoveManuallySelectedCompany(id);
    });
    
    // Note: selectedCompanies will be automatically updated by the useEffect above
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

      {/* Saved Search Section */}
      <Box sx={{ px: 3, mb: 4, mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Load a Saved Search
        </Typography>
        <SavedSearchSelector
          title="Choose from an existing search..."
          savedSearches={savedSearches}
          onSelect={handleSavedSearchSelect}
          placeholder="Saved searches..."
          loading={savedSearchesLoading}
        />
      </Box>

      {/* OR Divider */}
      <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
        <Box sx={{ flex: 1, borderBottom: '2px solid', borderColor: 'grey.300' }} />
        <Typography variant="body1" color="text.secondary" sx={{ mx: 2, fontWeight: 700 }}>
          OR
        </Typography>
        <Box sx={{ flex: 1, borderBottom: '2px solid', borderColor: 'grey.300' }} />
      </Box>

      {/* New Search Section */}
      <Box sx={{ px: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Create a New Search
        </Typography>
        <SearchBar
          value={keywords}
          onChange={setKeywords}
          placeholder="keywords"
        />
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
            items={availableForManualSelection}
            selectedItems={selectedCompanies}
            onSelectionChange={handleManuallySelectedCompanyChange}
            placeholder="Search companies..."
            loading={loading}
            availableCount={availableCount}
            showSelectedOutOfAvailable={true}
          />
        </Box>
        <Box sx={{ mt: 4 }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="primary"
              onClick={handleGetCompanies}
              disabled={loading}
              fullWidth
            >
              Load Companies
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
      </Box>
    </Box>
  );
};

export default Sidebar;