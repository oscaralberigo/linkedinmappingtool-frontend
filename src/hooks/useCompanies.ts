import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Company {
    id: string;
    name: string;
    linkedin_id: string;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Loading companies...');
        const response = await apiService.getAllCompanies();
        
        if (!response.companies || !Array.isArray(response.companies)) {
          console.error('Invalid response format:', response);
          setError('Invalid response format from API');
          return;
        }
        
        const companyItems = response.companies.map((company, index) => ({
          id: company.id || index, // Use linkedin_id as the id
          name: company.company_name, // Use company_name as the name
          linkedin_id: company.linkedin_id
        }));
        
        
        // Ensure unique IDs by adding index if there are duplicates
        const uniqueCompanies = companyItems.map((company, index) => ({
          ...company,
          id: `${company.id}` // Make IDs unique by combining with index
        }));
        
        setCompanies(uniqueCompanies);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load companies';
        setError(errorMessage);
        console.error('Failed to load companies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  return {
    companies,
    loading,
    error,
    refetch: () => {
      setCompanies([]);
      setError(null);
      setLoading(true);
    }
  };
}; 