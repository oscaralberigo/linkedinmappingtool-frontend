import { getApiUrl } from '../config';
import {
  BusinessModelsResponse,
  LinkedInIdsRequest,
  LinkedInIdsResponse,
  AllCompaniesResponse
} from '../types/api';
import {
  SearchFilters,
  SavedSearchRequest,
  SavedSearchResponse,
  CompanyWithLinkedInId
} from '../types/search';

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Handle query parameters in the endpoint string
    const [endpointKey, queryString] = endpoint.split('?');
    const baseUrl = getApiUrl(endpointKey as any);
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    
    // Get API key from environment
    const apiKey = process.env.REACT_APP_API_KEY;

    // Ensure headers is a plain object with string keys and values
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers
        ? Object.fromEntries(
            Object.entries(options.headers).map(([k, v]) => [k, String(v)])
          )
        : {}),
    };
    // Add API key header if available
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }
    const defaultOptions: RequestInit = {
      headers,
      credentials: 'include', // <-- This ensures cookies are sent!
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  // Existing methods
  async getBusinessModels(): Promise<BusinessModelsResponse> {
    return this.makeRequest<BusinessModelsResponse>('businessModels', {
      method: 'GET',
    });
  }

  async getLinkedInIds(request: LinkedInIdsRequest): Promise<LinkedInIdsResponse> {
    const queryParams = new URLSearchParams({
      businessModels: request.businessModels
    });
    
    return this.makeRequest<LinkedInIdsResponse>(`linkedInIds?${queryParams}`, {
      method: 'GET',
    });
  }

  async getAllCompanies(): Promise<AllCompaniesResponse> {
    return this.makeRequest<AllCompaniesResponse>('allCompaniesLinkedinIds', {
      method: 'GET',
    });
  }

  // New dynamic search method
  async searchCompaniesLinkedInIds(filters: SearchFilters): Promise<CompanyWithLinkedInId[]> {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    return this.makeRequest<CompanyWithLinkedInId[]>(`searchLinkedinIds?${queryParams}`, {
      method: 'GET',
    });
  }

  // Saved search methods
  async saveSearch(request: SavedSearchRequest): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('savedSearches', {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  async getAllSavedSearches(): Promise<SavedSearchResponse[]> {
    return this.makeRequest<SavedSearchResponse[]>('savedSearches', {
      method: 'GET',
    });
  }

  async getSavedSearchById(id: number): Promise<CompanyWithLinkedInId[]> {
    return this.makeRequest<CompanyWithLinkedInId[]>(`savedSearches/${id}`, {
      method: 'GET',
    });
  }

  async deleteSavedSearch(id: number): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`savedSearches/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();