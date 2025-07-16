import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { BusinessModel } from '../types/api';
import { ERROR_MESSAGES } from '../config';

export const useBusinessModels = () => {
  const [businessModels, setBusinessModels] = useState<BusinessModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<BusinessModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadBusinessModels = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching business models from API...');
      const models = await apiService.getBusinessModels();
      console.log('Received business models:', models);
      
      // Transform the API response to match expected format
      const transformedModels = models.businessModels.map((name: string, index: number) => ({
        id: (index + 1).toString(),
        name: name
      }));
      
      console.log('Transformed business models:', transformedModels);
      setBusinessModels(transformedModels);
      setFilteredModels(transformedModels);
    } catch (err) {
      console.error('Failed to load business models:', err);
      setError(ERROR_MESSAGES.LOAD_BUSINESS_MODELS);
      // Fallback to mock data
      const mockBusinessModels: BusinessModel[] = [
        { id: '1', name: 'SaaS' },
        { id: '2', name: 'E-commerce' },
        { id: '3', name: 'Marketplace' },
        { id: '4', name: 'Subscription' },
        { id: '5', name: 'Freemium' },
        { id: '6', name: 'B2B' },
        { id: '7', name: 'B2C' },
        { id: '8', name: 'D2C' },
      ];
      setBusinessModels(mockBusinessModels);
      setFilteredModels(mockBusinessModels);
    } finally {
      setLoading(false);
    }
  };

  const filterBusinessModels = (searchTerm: string) => {
    const filtered = businessModels.filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredModels(filtered);
  };

  useEffect(() => {
    loadBusinessModels();
  }, []);

  return {
    businessModels,
    filteredModels,
    loading,
    error,
    filterBusinessModels,
    reloadBusinessModels: loadBusinessModels
  };
}; 