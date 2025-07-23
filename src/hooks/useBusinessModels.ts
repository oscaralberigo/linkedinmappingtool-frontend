import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface BusinessModel {
  id: string | number;
  name: string;
}

export const useBusinessModels = () => {
  const [categories, setCategories] = useState<BusinessModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiService.getBusinessModels();
        const categoryItems = response.businessModels.map((model, index) => ({
          id: index,
          name: model
        }));
        setCategories(categoryItems);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load categories';
        setError(errorMessage);
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: () => {
      setCategories([]);
      setError(null);
      setLoading(true);
    }
  };
}; 