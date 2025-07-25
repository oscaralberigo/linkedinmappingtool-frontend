import { Company } from "./company";

// Search-related types
export interface SearchFilters {
  businessModels?: string;
  sizeFrom?: number;
  sizeTo?: number;
  aumFrom?: number;
  aumTo?: number;
  location?: string;
  keywords?: string;
  [key: string]: any; // Allow any other dynamic filters
}

export interface SavedSearchRequest {
  search_name: string;
  company_ids: number[];
  keywords: string;
}

export interface SavedSearchResponse {
  id: number;
  search_name: string;
  company_ids: number[];
  keywords: string;
  created_at: string;
}

export interface SearchResult {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
}


