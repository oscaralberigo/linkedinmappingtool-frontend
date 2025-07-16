import React, { useState } from 'react';
import { BusinessModel, Company } from '../types/api';
import { useBusinessModels } from '../hooks/useBusinessModels';
import { useCompanies } from '../hooks/useCompanies';
import { useLinkedInSearch } from '../hooks/useLinkedInSearch';

const SearchComponent: React.FC = () => {
  const [keywords, setKeywords] = useState<string>('');
  const [selectedBusinessModels, setSelectedBusinessModels] = useState<BusinessModel[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [showBusinessModelDropdown, setShowBusinessModelDropdown] = useState<boolean>(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState<boolean>(false);
  const [businessModelSearchTerm, setBusinessModelSearchTerm] = useState<string>('');
  const [companySearchTerm, setCompanySearchTerm] = useState<string>('');

  // Use custom hooks
  const {
    businessModels,
    filteredModels,
    loading: businessModelsLoading,
    error: businessModelsError,
    filterBusinessModels
  } = useBusinessModels();

  const {
    companies,
    filteredCompanies,
    loading: companiesLoading,
    error: companiesError,
    filterCompanies
  } = useCompanies();

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
    setBusinessModelSearchTerm(searchTerm);

    filterBusinessModels(searchTerm);
    setShowBusinessModelDropdown(true);
  };

  const handleCompanySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setCompanySearchTerm(searchTerm);

    filterCompanies(searchTerm);
    setShowCompanyDropdown(true);
  };

  const handleBusinessModelSelect = (model: BusinessModel) => {
    setSelectedBusinessModels(prev => [...prev, model]);
    setBusinessModelSearchTerm('');
    setShowBusinessModelDropdown(false);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompanies(prev => [...prev, company]);
    setCompanySearchTerm('');
    setShowCompanyDropdown(false);
  };

  const handleRemoveBusinessModel = (modelId: string) => {
    setSelectedBusinessModels(prev => prev.filter(model => model.id !== modelId));
  };

  const handleRemoveCompany = (companyId: string) => {
    setSelectedCompanies(prev => prev.filter(company => company.linkedin_id !== companyId));
  };

  const handleLinkedInSearch = async () => {
    const businessModelNames = selectedBusinessModels.map(model => model.name);
    const companyLinkedInIds = selectedCompanies.map(company => company.linkedin_id);
    
    await performSearch(
      businessModelNames,
      keywords,
      companyLinkedInIds
    );
  };

  const hasSelections = selectedBusinessModels.length > 0 || selectedCompanies.length > 0;
  const error = businessModelsError || companiesError || linkedInError;

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
          value={businessModelSearchTerm}
          onChange={handleBusinessModelSearch}
          onFocus={() => setShowBusinessModelDropdown(true)}
          placeholder={businessModelsLoading ? "Loading business models..." : "Search business models..."}
          disabled={businessModelsLoading}
        />
        
        {businessModelsLoading && (
          <div style={{ color: 'blue', marginTop: '5px' }}>
            Loading business models...
          </div>
        )}
        
        {showBusinessModelDropdown && filteredModels.length > 0 && (
          <div style={{ border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto' }}>
            {filteredModels.map((model) => (
              <div
                key={model.id}
                onClick={() => handleBusinessModelSelect(model)}
                style={{ cursor: 'pointer', padding: '8px', borderBottom: '1px solid #eee' }}
              >
                {model.name}
              </div>
            ))}
          </div>
        )}
        
        {!businessModelsLoading && businessModels.length === 0 && (
          <div style={{ color: 'orange', marginTop: '5px' }}>
            No business models available
          </div>
        )}

        {/* Selected Business Models Tags */}
        {selectedBusinessModels.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ marginBottom: '5px', fontSize: '14px' }}>Selected Business Models:</div>
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

      <div>
        <label htmlFor="company">Additional Custom Companies:</label>
        <input
          type="text"
          id="company"
          value={companySearchTerm}
          onChange={handleCompanySearch}
          onFocus={() => setShowCompanyDropdown(true)}
          placeholder={companiesLoading ? "Loading companies..." : "Search companies..."}
          disabled={companiesLoading}
        />
        
        {companiesLoading && (
          <div style={{ color: 'blue', marginTop: '5px' }}>
            Loading companies...
          </div>
        )}
        
        {showCompanyDropdown && filteredCompanies.length > 0 && (
          <div style={{ border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto' }}>
            {filteredCompanies.map((company) => (
              <div
                key={company.linkedin_id}
                onClick={() => handleCompanySelect(company)}
                style={{ cursor: 'pointer', padding: '8px', borderBottom: '1px solid #eee' }}
              >
                {company.company_name || 'Unnamed Company'}
              </div>
            ))}
          </div>
        )}
        
        {!companiesLoading && companies.length === 0 && (
          <div style={{ color: 'orange', marginTop: '5px' }}>
            No companies available
          </div>
        )}

        {/* Selected Companies Tags */}
        {selectedCompanies.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ marginBottom: '5px', fontSize: '14px' }}>Selected Companies:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {selectedCompanies.map((company) => (
                <div
                  key={company.linkedin_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #4caf50',
                    borderRadius: '16px',
                    padding: '4px 12px',
                    fontSize: '14px'
                  }}
                >
                  <span>{company.company_name || 'Unnamed Company'}</span>
                  <button
                    onClick={() => handleRemoveCompany(company.linkedin_id)}
                    style={{
                      marginLeft: '8px',
                      background: 'none',
                      border: 'none',
                      color: '#4caf50',
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

      {hasSelections && (
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleLinkedInSearch}
            disabled={businessModelsLoading || companiesLoading || linkedInLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (businessModelsLoading || companiesLoading || linkedInLoading) ? 'not-allowed' : 'pointer'
            }}
          >
            {(businessModelsLoading || companiesLoading || linkedInLoading) ? 'Fetching...' : 'Search LinkedIn People'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchComponent; 