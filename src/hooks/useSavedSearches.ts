import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<{ id: number; search_name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedSearches = async () => {
    setLoading(true);
    try {
      const results = await apiService.getAllSavedSearches();
      setSavedSearches(results.map(s => ({ id: s.id, search_name: s.search_name })));
    } catch (err) {
      setSavedSearches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedSearches();
  }, []);

  return { 
    savedSearches, 
    loading, 
    refresh: fetchSavedSearches 
  };
} 