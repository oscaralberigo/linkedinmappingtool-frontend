// API Request Interfaces

export interface LinkedInIdsRequest {
  businessModels: string;
}


export interface BusinessModelsResponse {
  businessModels: string[];
  count: number;
}

export interface LinkedInIdsResponse {
  businessModel: string; // Single string like "Bank, Asset Manager"
  linkedInIds: string[];
  count: number;
}

// Business Model Interface
export interface BusinessModel {
  id: string;
  name: string;
}

// Company Interface
export interface Company {
  company_name: string;
  linkedin_id: string;
}

export interface AllCompaniesResponse {
  companies: Company[];
  count: number;
} 