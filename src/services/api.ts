import { getApiUrl } from '../config/api';
import {
  BusinessModelsResponse,
  LinkedInIdsRequest,
  LinkedInIdsResponse,
  AllCompaniesResponse,
  EmployeeCountRangeResponse,
  CreateBoxRequest
} from '../types/api';
import {
  SearchFilters,
  SavedSearchRequest,
  SavedSearchResponse,
} from '../types/search';
import { Company } from '../types/company';
import { AdvertData } from '../types/advert';
class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private _normalizeHeaders(headers: HeadersInit | undefined): Record<string, string> {
    const normalized: Record<string, string> = {};
    if (headers) {
      if (headers instanceof Headers) {
        headers.forEach((value, key) => {
          normalized[key] = value;
        });
      } else if (Array.isArray(headers)) {
        headers.forEach(([key, value]) => {
          normalized[key] = value;
        });
      } else {
        Object.entries(headers).forEach(([key, value]) => {
          normalized[key] = String(value);
        });
      }
    }
    return normalized;
  }

  private _processRequestOptions(options: Omit<RequestInit, 'body' | 'headers'> & { body?: unknown; headers?: HeadersInit }, requestHeaders: Record<string, string>): { body: BodyInit | null | undefined; headers: Record<string, string> } {
    let requestBody: BodyInit | null | undefined = options.body as BodyInit | null | undefined;
    const updatedHeaders = { ...requestHeaders };

    if (options.body instanceof FormData) {
      // Do not set Content-Type header for FormData; browser will set it automatically
    } else if (typeof options.body === 'object' && options.body !== null) {
      updatedHeaders['Content-Type'] = 'application/json';
      requestBody = JSON.stringify(options.body);
    } else if (options.body) {
      requestBody = options.body as BodyInit;
    } else if (updatedHeaders['Content-Type']) {
      // If a custom Content-Type is already set, use it
    } else {
      updatedHeaders['Content-Type'] = 'application/json';
    }

    return { body: requestBody, headers: updatedHeaders };
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

    // Ensure headers is a plain object with string keys and values
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers
        ? Object.fromEntries(
            Object.entries(options.headers).map(([k, v]) => [k, String(v)])
          )
        : {}),
    };
    
    const defaultOptions: RequestInit = {
      headers,
      // credentials: 'include', // <-- Commented out to avoid CORS issues
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
    console.log('Making API call to:', url); // Debug log
    
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
    const baseUrl = getApiUrl('savedSearches');
    const url = `${baseUrl}/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include', // <-- Commented out to avoid CORS issues
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map the API response to Company interface and extract keywords
    const companies = data.companies?.map((company: any) => ({
      id: company.company_id, // Map company_id to id
      name: company.company_name, // Map company_name to name
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

  async processAdvert(formData: FormData): Promise<AdvertData> {
    const baseUrl = getApiUrl('advertProcess');

    const response = await fetch(baseUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createBox(pipelineKey: string, requestBody: CreateBoxRequest): Promise<{ message: string; boxId: string }> {
    const baseUrl = getApiUrl('createBox');
    const url = `${baseUrl.replace(':pipelineKey', pipelineKey)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();