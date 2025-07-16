import { useState, useEffect, useCallback } from 'react';
import { Company } from '../types/api';
import { apiService } from '../services/api';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load all companies on mount
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllCompanies();
      console.log('Companies API response:', response);
      console.log('Companies array:', response.companies);
      
      // Validate the response structure
      if (!response.companies || !Array.isArray(response.companies)) {
        throw new Error('Invalid response format: companies array not found');
      }
      
      setCompanies(response.companies);
      setFilteredCompanies(response.companies);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter(company =>
      company.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [companies]);

  return {
    companies,
    filteredCompanies,
    loading,
    error,
    filterCompanies,
    reloadCompanies: loadCompanies
  };
}; 