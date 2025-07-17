// Application constants
export const APP_NAME = 'LS LinkedIn Search';

// Default values
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_KEYWORDS_LENGTH = 100;

// Error messages
export const ERROR_MESSAGES = {
  LOAD_BUSINESS_MODELS: 'Failed to load business models',
  SEARCH_COMPANIES: 'Error searching companies. Please try again.',
  MISSING_INPUTS: 'Please enter keywords and select a business model',
  INVALID_TOKEN: 'API key not configured. Please set REACT_APP_API_KEY environment variable.'
} as const; 