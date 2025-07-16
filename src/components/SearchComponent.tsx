import React, { useState, useEffect } from 'react';
import { apiService, BusinessModel, BusinessModelsResponse, LinkedInIdsRequest } from '../services/api';
import { ERROR_MESSAGES } from '../config';
import { LinkedInUrlFormatter } from '../utils/linkedinUrlFormatter';

const SearchComponent: React.FC = () => {
  const [keywords, setKeywords] = useState<string>('');
  const [selectedBusinessModels, setSelectedBusinessModels] = useState<BusinessModel[]>([]);
  const [businessModels, setBusinessModels] = useState<BusinessModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<BusinessModel[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Load business models from API
  useEffect(() => {
    const loadBusinessModels = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Fetching business models from API...');
        const models = await apiService.getBusinessModels();
        
        // Transform the API response to match expected format
        const transformedModels = models.businessModels.map((name: string, index: number) => ({
          id: (index + 1).toString(),
          name: name
        }));
        
        setBusinessModels(transformedModels);
        setFilteredModels(transformedModels);
      } catch (err) {
        console.error('Failed to load business models:', err);
        setError(ERROR_MESSAGES.LOAD_BUSINESS_MODELS);
        // Don't set any business models if API fails
        setBusinessModels([]);
        setFilteredModels([]);
      } finally {
        setLoading(false);
      }
    };

    loadBusinessModels();
  }, []);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  const handleBusinessModelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    
    const filtered = businessModels.filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedBusinessModels.some(selected => selected.id === model.id)
    );
    setFilteredModels(filtered);
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

  const handleGetLinkedInIds = async () => {
    if (selectedBusinessModels.length === 0) {
      alert('Please select at least one business model');
      return;
    }

    // Keywords can be empty - no validation needed

    try {
      setLoading(true);
      setError('');

      const businessModelNames = selectedBusinessModels.map(model => model.name).join(', ');
      const request: LinkedInIdsRequest = {
        businessModels: businessModelNames
      };

      console.log('Fetching LinkedIn IDs for business models:', businessModelNames);
      const response = await apiService.getLinkedInIds(request);
      // Format and open LinkedIn search
      const searchParams = {
        linkedInIds: response.linkedInIds,
        keywords: keywords.trim() || '' // Use empty string if no keywords
      };

      console.log('Opening LinkedIn search with params:', searchParams);
      LinkedInUrlFormatter.openLinkedInSearch(searchParams);

    } catch (error) {
      console.error('Error fetching LinkedIn IDs:', error);
      setError('Error fetching LinkedIn IDs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchOnLinkedIn = async () => {
    if (!keywords || selectedBusinessModels.length === 0) {
      alert(ERROR_MESSAGES.MISSING_INPUTS);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await apiService.searchCompanies({
        keywords: keywords,
        businessModel: selectedBusinessModels.map(model => model.name).join(', '),
      });

      const companyIds = response.companyIds;

      // TODO: Replace with actual URL formatting logic
      const businessModelNames = selectedBusinessModels.map(model => model.name).join(', ');
      const linkedInUrl = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(keywords)}&businessModel=${encodeURIComponent(businessModelNames)}`;
      
      // Open LinkedIn URL in new tab
      window.open(linkedInUrl, '_blank');
    } catch (error) {
      console.error('Error searching companies:', error);
      setError(ERROR_MESSAGES.SEARCH_COMPANIES);
    } finally {
      setLoading(false);
    }
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
            onClick={handleGetLinkedInIds}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Fetching...' : 'Search LinkedIn People'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchComponent; 