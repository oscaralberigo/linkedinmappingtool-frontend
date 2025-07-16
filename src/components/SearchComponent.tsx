import React, { useState } from 'react';
import { BusinessModel } from '../types/api';
import { useBusinessModels } from '../hooks/useBusinessModels';
import { useLinkedInSearch } from '../hooks/useLinkedInSearch';

const SearchComponent: React.FC = () => {
  const [keywords, setKeywords] = useState<string>('');
  const [selectedBusinessModels, setSelectedBusinessModels] = useState<BusinessModel[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Use custom hooks
  const {
    businessModels,
    filteredModels,
    loading,
    error,
    filterBusinessModels
  } = useBusinessModels();

  const {
    loading: linkedInLoading,
    error: linkedInError,
    performSearch,
    clearError
  } = useLinkedInSearch({
    onError: (error) => alert(error)
  });

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  const handleBusinessModelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    filterBusinessModels(searchTerm);
    setShowDropdown(true);
  };

  const handleModelSelect = (model: BusinessModel) => {
    setSelectedBusinessModels(prev => [...prev, model]);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemoveBusinessModel = (modelId: string) => {
    setSelectedBusinessModels(prev => prev.filter(model => model.id !== modelId));
  };

  const handleLinkedInSearch = async () => {
    await performSearch(
      selectedBusinessModels.map(model => model.name),
      keywords
    );
  };

  return (
    <div>
      <div>
        <label htmlFor="keywords">Keywords:</label>
        <input
          type="text"
          id="keywords"
          value={keywords}
          onChange={handleKeywordChange}
          placeholder="Enter keywords..."
        />
      </div>

      <div>
        <label htmlFor="businessModel">Business Models:</label>
        <input
          type="text"
          id="businessModel"
          value={searchTerm}
          onChange={handleBusinessModelSearch}
          onFocus={() => setShowDropdown(true)}
          placeholder={loading ? "Loading business models..." : "Search business models..."}
          disabled={loading}
        />
        
        {loading && (
          <div style={{ color: 'blue', marginTop: '5px' }}>
            Loading business models...
          </div>
        )}
        
        {showDropdown && filteredModels.length > 0 && (
          <div style={{ border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto' }}>
            {filteredModels.map((model) => (
              <div
                key={model.id}
                onClick={() => handleModelSelect(model)}
                style={{ cursor: 'pointer', padding: '8px', borderBottom: '1px solid #eee' }}
              >
                {model.name}
              </div>
            ))}
          </div>
        )}
        
        {!loading && businessModels.length === 0 && (
          <div style={{ color: 'orange', marginTop: '5px' }}>
            No business models available
          </div>
        )}

        {/* Selected Business Models Tags */}
        {selectedBusinessModels.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ marginBottom: '5px', fontSize: '14px' }}>Selected:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {selectedBusinessModels.map((model) => (
                <div
                  key={model.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #2196f3',
                    borderRadius: '16px',
                    padding: '4px 12px',
                    fontSize: '14px'
                  }}
                >
                  <span>{model.name}</span>
                  <button
                    onClick={() => handleRemoveBusinessModel(model.id)}
                    style={{
                      marginLeft: '8px',
                      background: 'none',
                      border: 'none',
                      color: '#2196f3',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

      {selectedBusinessModels.length > 0 && (
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleLinkedInSearch}
            disabled={loading || linkedInLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (loading || linkedInLoading) ? 'not-allowed' : 'pointer'
            }}
          >
            {(loading || linkedInLoading) ? 'Fetching...' : 'Search LinkedIn People'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchComponent; 