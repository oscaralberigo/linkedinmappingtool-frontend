interface ApiConfig {
  baseUrl: string;
  endpoints: {
    businessModels: string;
    linkedInIds: string;
    allCompaniesLinkedinIds: string;
    searchLinkedinIds: string;
    savedSearches: string;
    employeeCountRange: string;
    locations: string;
  };
}
const getApiConfig = (): ApiConfig => {
  const environment = process.env.REACT_APP_ENV || 'development';
  // Shared endpoints across all environments
  const endpoints = {
    businessModels: '/api/business-models',
    linkedInIds: '/api/linkedin-ids',
    allCompaniesLinkedinIds: '/api/all-companies-linkedin-ids',
    searchLinkedinIds: '/api/search-linkedin-ids',
    savedSearches: '/api/saved-searches',
    employeeCountRange: '/api/employee-count-range',
    locations: '/api/locations',
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
    throw new Error(`Endpoint ${String(endpoint)} is not configured`);
  }
  
  const url = `${apiConfig.baseUrl}${endpointPath}`;
  return url;
}; 