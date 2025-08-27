// Core API response types
export interface BusinessModelsResponse {
  businessModels: string[];
}

// For transformed business models with id and name
export interface BusinessModel {
  id: string;
  name: string;
}

export interface BusinessModelsList {
  businessModels: BusinessModel[];
}

export interface LinkedInIdsRequest {
  businessModels: string;
}

export interface LinkedInIdsResponse {
  linkedInIds: string[];
}

export interface AllCompaniesResponse {
  companies: Array<{
    id: string;
    company_name: string;
    linkedin_id: string;
    linkedin_page: string;
  }>;
}

export interface EmployeeCountRangeResponse {
  min: number;
  max: number;
}

// Generic API error response
export interface ApiErrorResponse {
  message: string;
  status: number;
  timestamp: string;
}

export interface CreateBoxRequest {
  name: string;
  notes: string;
  stageKey: string;
  fields: Record<string, any>; // Assuming fields can be any key-value pairs
} 