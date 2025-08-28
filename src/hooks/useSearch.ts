import { useState } from 'react';
import { apiService } from '../services/api';
import { SearchFilters } from '../types/search';
import { Company } from '../types/company';

export const useSearch = (companyList: Company[]) => {
  const [returnedCompanies, setReturnedCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCompanies = async (filters: SearchFilters) => {
    console.log("Running search");
    setLoading(true);
    setError(null);
    try {
      console.log('filters', filters);
      const results = await apiService.searchCompaniesLinkedInIds(filters);
      // Simple merge logic: keep existing manually added companies, add new search results
      console.log('results', results);
      const manual = companyList.filter(c => c.added_manually);
      const upgraded = results.map(result => {
        const manualMatch = manual.find(m => m.id === result.id);
        return manualMatch
          ? { ...result, added_manually: false }
          : { ...result, added_manually: false };
      });
      const stillManual = manual.filter(m => !upgraded.some(u => u.id === m.id));
      const merged = [...upgraded, ...stillManual];
      setReturnedCompanies(merged);
      return merged;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during search';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearCompanies = () => {
    setReturnedCompanies([]);
  };

  return {
    returnedCompanies,
    setReturnedCompanies,
    loading,
    error,
    searchCompanies,
    clearCompanies,
  };
}; 