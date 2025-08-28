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

export const pipelineKeys = {
    production: {'000 Adverts': 'agxzfm1haWxmb29nYWVyOAsSDE9yZ2FuaXphdGlvbiIRbG9nYW5zaW5jbGFpci5jb20MCxIIV29ya2Zsb3cYgIC5rqyUlwkM'},
    development: {'000 Adverts': 'agxzfm1haWxmb29nYWVyOAsSDE9yZ2FuaXphdGlvbiIRbG9nYW5zaW5jbGFpci5jb20MCxIIV29ya2Zsb3cYgIDF467PogkM'},
}

export const getPipelineKey = (pipelineName: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isStaging = process.env.REACT_APP_ENV === 'staging';
  if (isProduction || isStaging) {
    return pipelineKeys.production[pipelineName as keyof typeof pipelineKeys.production];
  }
  return pipelineKeys.development[pipelineName as keyof typeof pipelineKeys.development];
}

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
