import { useState } from 'react';
import { LinkedInSearchService } from '../utils/linkedInSearchService';

interface UseLinkedInSearchParams {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useLinkedInSearch = (params?: UseLinkedInSearchParams) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const performSearch = async (businessModels: string[], keywords: string) => {
    // Validate parameters
    const validationError = LinkedInSearchService.validateSearchParams(businessModels);
    
    if (validationError) {
      const errorMessage = validationError;
      setError(errorMessage);
      params?.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    }

    try {
      setLoading(true);
      setError('');

      await LinkedInSearchService.performLinkedInSearch({
        businessModels,
        keywords
      });

      params?.onSuccess?.();
      return { success: true, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching LinkedIn IDs. Please try again.';
      console.error('Error performing LinkedIn search:', err);
      setError(errorMessage);
      params?.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  return {
    loading,
    error,
    performSearch,
    clearError
  };
}; 