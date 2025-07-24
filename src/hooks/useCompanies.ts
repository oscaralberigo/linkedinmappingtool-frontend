import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Company } from '../types/company';



export const useCompanies = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all companies from API (for dropdown filtering)
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getAllCompanies();
        if (!response.companies || !Array.isArray(response.companies)) {
          setError('Invalid response format from API');
          return;
        }
        const all = response.companies.map((company) => ({
          id: company.id,
          name: company.company_name,
          linkedin_id: company.linkedin_id,
          linkedin_page: company.linkedin_page,
          added_manually: false,
        }));
        setAllCompanies(all);
      } catch (err) {
        setError('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };
    loadCompanies();
  }, []);

  return {
    allCompanies,
    setAllCompanies,
    loading,
    error
  };
}; 