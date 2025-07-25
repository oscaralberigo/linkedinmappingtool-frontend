import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { SavedSearchResponse } from '../types/search';

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearchResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedSearches = async () => {
    setLoading(true);
    try {
      const results = await apiService.getAllSavedSearches();
      setSavedSearches(results);
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