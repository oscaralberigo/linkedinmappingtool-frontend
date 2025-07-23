import { useState } from 'react';
import { apiService } from '../services/api';
import { SearchFilters, CompanyWithLinkedInId } from '../types/search';

export const useSearch = () => {
  const [companies, setCompanies] = useState<CompanyWithLinkedInId[]>([]);
  const [manuallyAddedCompanies, setManuallyAddedCompanies] = useState<CompanyWithLinkedInId[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCompanies = async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Search filters:', filters);
      const results = await apiService.searchCompaniesLinkedInIds(filters);
      setCompanies(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during search';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addManuallySelectedCompanies = (selectedCompanyIds: Array<string | number>, allCompanies: Array<{ id: string | number; name: string }>) => {
    // Convert selected company IDs to CompanyWithLinkedInId format
    const newManuallyAdded = selectedCompanyIds
      .map(id => {
        const company = allCompanies.find(c => c.id === id);
        if (!company) return null;
        
        // Create a CompanyWithLinkedInId object
        return {
          company_id: typeof id === 'string' ? parseInt(id) : id,
          company_name: company.name,
          linkedin_id: typeof id === 'string' ? id : id.toString()
        };
      })
      .filter((company): company is CompanyWithLinkedInId => company !== null);

    setManuallyAddedCompanies(newManuallyAdded);
  };

  const clearResults = () => {
    setCompanies([]);
    setManuallyAddedCompanies([]);
    setError(null);
  };

  // Get combined results (search results + manually added, without duplicates)
  const getCombinedResults = (): CompanyWithLinkedInId[] => {
    const searchResultIds = new Set(companies.map(c => c.company_id));
    
    // Only include manually added companies that aren't already in search results
    const uniqueManuallyAdded = manuallyAddedCompanies.filter(
      company => !searchResultIds.has(company.company_id)
    );
    
    return [...companies, ...uniqueManuallyAdded];
  };

  return {
    companies,
    manuallyAddedCompanies,
    loading,
    error,
    searchCompanies,
    addManuallySelectedCompanies,
    clearResults,
    setCompanies,
    getCombinedResults,
  };
}; 