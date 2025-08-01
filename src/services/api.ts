import { getApiUrl } from '../config';
import {
  BusinessModelsResponse,
  LinkedInIdsRequest,
  LinkedInIdsResponse,
  AllCompaniesResponse,
  EmployeeCountRangeResponse
} from '../types/api';
import {
  SearchFilters,
  SavedSearchRequest,
  SavedSearchResponse,
} from '../types/search';
import { Company } from '../types/company';

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    let url: string;
        
    // Check if endpoint is a full URL or just a key
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      // It's already a full URL
      url = endpoint;
    } else {
      // Handle query parameters in the endpoint string
      const [endpointKey, queryString] = endpoint.split('?');
      
      const baseUrl = getApiUrl(endpointKey as any);
      
      url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    }
    
    
    // Get auth token
    const token = this.getAuthToken();
    
    // Ensure headers is a plain object with string keys and values
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers
        ? Object.fromEntries(
            Object.entries(options.headers).map(([k, v]) => [k, String(v)])
          )
        : {}),
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const defaultOptions: RequestInit = {
      headers,
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // Redirect to login
        window.location.href = '/';
      }
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

  async getEmployeeCountRange(): Promise<EmployeeCountRangeResponse> {
    return this.makeRequest<EmployeeCountRangeResponse>('employeeCountRange', {
      method: 'GET',
    });
  }

  async getLocations(): Promise<Array<{ id: number; location_name: string; location_code: string }>> {
    return this.makeRequest<Array<{ id: number; location_name: string; location_code: string }>>('locations', {
      method: 'GET',
    });
  }

  // New dynamic search method
  async searchCompaniesLinkedInIds(filters: SearchFilters): Promise<Company[]> {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    const url = `searchLinkedinIds?${queryParams}`;
    
    const data = await this.makeRequest<any[]>(url, {
      method: 'GET',
    });
    
    // Map the API response to Company interface
    return data.map((company: any) => ({
      id: company.id,
      name: company.company_name || company.name,
      linkedin_id: company.linkedin_id,
      linkedin_page: company.linkedin_page,
      added_manually: false
    }));
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

  async getSavedSearchById(id: number): Promise<{ companies: Company[]; keywords: string }> {
    
    // Get the base URL for savedSearches
    const baseUrl = getApiUrl('savedSearches');
    const url = `${baseUrl}/${id}`;
        
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/';
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map the API response to Company interface and extract keywords
    const companies = data.companies?.map((company: any) => ({
      id: company.company_id,
      name: company.company_name,
      linkedin_id: company.linkedin_id,
      linkedin_page: company.linkedin_page,
      added_manually: false
    })) || [];
    
    return {
      companies,
      keywords: data.keywords || ''
    };
  }

  async deleteSavedSearch(id: number): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`savedSearches/${id}`, {
      method: 'DELETE',
    });
  }

  // Auth methods
  async validateToken(): Promise<{ valid: boolean; user?: any }> {
    return this.makeRequest<{ valid: boolean; user?: any }>('validateToken', {
      method: 'GET',
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('logout', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();