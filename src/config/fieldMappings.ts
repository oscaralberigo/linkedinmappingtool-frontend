// Field mappings for different environments
export const FIELD_MAPPINGS = {
  // Production field keys
  production: {
    ROLE_TITLE: '1004',
    DESCRIPTION: '1005',
    REQUIREMENTS: '1006',
    RESPONSIBILITIES: '1008',
    SALARY: '1011',
    LOCATION: '1012',
  },

  // Development field keys
  development: {
    ROLE_TITLE: '1001',
    DESCRIPTION: '1002',
    REQUIREMENTS: '1003',
    RESPONSIBILITIES: '1005',
    SALARY: '1008',
    LOCATION: '1009',
  },
};

// Get current environment field mapping
export const getFieldMapping = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isStaging = process.env.REACT_APP_ENV === 'staging';

  // Use production keys for production and staging
  if (isProduction || isStaging) {
    return FIELD_MAPPINGS.production;
  }

  // Use development keys for development
  return FIELD_MAPPINGS.development;
};

// Helper function to get specific field key
export const getFieldKey = (field: keyof typeof FIELD_MAPPINGS.production): string => {
  const mapping = getFieldMapping();
  return mapping[field];
};
