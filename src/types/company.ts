// Company-related types
export interface Company {
  id: string;
  name: string;
  industry?: string;
  size?: number;
  location?: string;
  description?: string;
  linkedInId?: string;
  website?: string;
  founded?: number;
  revenue?: string;
  employees?: number;
}

export interface CompanyCategory {
  id: string;
  name: string;
  description?: string;
}

export interface CompanySearchResult {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
}

export interface CompanyDetails {
  id: string;
  name: string;
  industry: string;
  size: number;
  location: string;
  description: string;
  linkedInId: string;
  website: string;
  founded: number;
  revenue: string;
  employees: number;
  linkedInUrl: string;
  lastUpdated: string;
} 