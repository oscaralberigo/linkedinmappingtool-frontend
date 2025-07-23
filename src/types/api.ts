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
    company_id: number;
    company_name: string;
    linkedin_id: string;
  }>;
}

// Generic API error response
export interface ApiErrorResponse {
  message: string;
  status: number;
  timestamp: string;
} 