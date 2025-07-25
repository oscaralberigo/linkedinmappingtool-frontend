import React from 'react';
import { SavedSearchSection } from '../templates';
import { useSavedSearches } from '../../../hooks';

interface LoadSavedSearchProps {
  onLoadSearch: (searchId: number) => void;
  onRefreshSavedSearches?: (refreshFn: () => void) => void;
}

const LoadSavedSearch: React.FC<LoadSavedSearchProps> = ({
  onLoadSearch,
  onRefreshSavedSearches
}) => {
  const { savedSearches, loading, refresh } = useSavedSearches();

  React.useEffect(() => {
    if (onRefreshSavedSearches) {
      onRefreshSavedSearches(refresh);
    }
  }, [onRefreshSavedSearches, refresh]);

  return (
    <SavedSearchSection
      savedSearches={savedSearches}
      onLoadSearch={onLoadSearch}
      loading={loading}
    />
  );
};

export default LoadSavedSearch; 