import React, { useState, useEffect } from 'react';
import { 
  SearchFiltersSection
} from '../templates';
import { TwoActionButtons, MultiSelectDropdown } from '../molecules';
import { useBusinessModels } from '../../../hooks/useBusinessModels';
import { useEmployeeCountRange } from '../../../hooks';
import { SearchFilters } from '../../../types/search';
import { Company } from '../../../types/company';
import { Box } from '@mui/material';

interface CreateNewSearchProps {
  keywords?: string;
  onKeywordsChange?: (keywords: string) => void;
  searchCompanies: (filters: SearchFilters, keywords?: string) => void;
  onSaveSearch: () => void;
  loading: boolean;
  companies: Company[];
  availableForManualSelection: Company[];
  onAddManuallySelectedCompany: (companyId: string | number) => void;
  onRemoveManuallySelectedCompany: (companyId: string | number) => void;
}

const CreateNewSearch: React.FC<CreateNewSearchProps> = ({
  keywords,
  onKeywordsChange,
  searchCompanies,
  onSaveSearch,
  loading,
  companies,
  availableForManualSelection,
  onAddManuallySelectedCompany,
  onRemoveManuallySelectedCompany
}) => {
  const [selectedCategories, setSelectedCategories] = useState<Array<string | number>>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Array<string | number>>([]);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const { categories, loading: loadingCategories } = useBusinessModels();
  const { range, sizeRange, setSizeRange } = useEmployeeCountRange();

  // Update selectedCompanies to reflect manually added companies in the current list
  useEffect(() => {
    const manuallyAddedIds = companies
      .filter(company => company.added_manually)
      .map(company => company.id);
    setSelectedCompanies(manuallyAddedIds);
  }, [companies]);

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
    searchCompanies(filters, keywords?.trim());
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
  };

  return (
    <>
      {/* Search Filters Section */}
      <SearchFiltersSection
        keywords={keywords}
        onKeywordsChange={onKeywordsChange}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        sizeRange={sizeRange}
        onSizeRangeChange={setSizeRange}
        isSizeOpen={isSizeOpen}
        onSizeToggle={() => setIsSizeOpen(!isSizeOpen)}
        loadingCategories={loadingCategories}
      />

      {/* Company Selection */}
      <Box sx={{ px: 3 }}>
        <MultiSelectDropdown
          title="Add companies manually"
          items={availableForManualSelection.map(company => ({ label: company.name, ...company }))}
          selectedItems={selectedCompanies}
          onSelectionChange={handleManuallySelectedCompanyChange}
          placeholder="Search companies..."
          loading={loading}
          availableCount={availableForManualSelection.length}
          showSelectedOutOfAvailable={true}
        />

        <TwoActionButtons
          primaryAction={{
            text: 'Load Companies',
            onClick: handleGetCompanies,
            variant: 'primary'
          }}
          secondaryAction={{
            text: 'Save Search',
            onClick: onSaveSearch,
            variant: 'success'
          }}
          loading={loading}
        />
      </Box>
    </>
  );
};

export default CreateNewSearch; 