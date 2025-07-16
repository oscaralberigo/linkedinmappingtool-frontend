interface ApiConfig {
  baseUrl: string;
  endpoints: {
    searchCompanies: string;
    businessModels: string;
    linkedInIds: string;
  };
}

const getApiConfig = (): ApiConfig => {
  const environment = process.env.REACT_APP_ENV || 'development';
  
  // Shared endpoints across all environments
  const endpoints = {
    searchCompanies: process.env.REACT_APP_SEARCH_COMPANIES_ENDPOINT || '/api/search-companies',
    businessModels: process.env.REACT_APP_BUSINESS_MODELS_ENDPOINT || '/api/business-models',
    linkedInIds: process.env.REACT_APP_LINKEDIN_IDS_ENDPOINT || '/api/linkedin-ids',
  };

  // Only base URL changes per environment
  const baseUrls: Record<string, string> = {
    development: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3003',
    test: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3003',
    production: process.env.REACT_APP_API_BASE_URL || 'https://your-production-api.com',
  };

  return {
    baseUrl: baseUrls[environment] || baseUrls.development,
    endpoints,
  };
};

export const apiConfig = getApiConfig();

export const getApiUrl = (endpoint: keyof ApiConfig['endpoints']): string => {
  const endpointPath = apiConfig.endpoints[endpoint];
  
  if (!endpointPath) {
    throw new Error(`Endpoint ${endpoint} is not configured`);
  }
  
  const url = `${apiConfig.baseUrl}${endpointPath}`;
  return url;
}; 