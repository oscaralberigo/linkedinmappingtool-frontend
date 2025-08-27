import { getApiUrl } from '../config/api';
import type { ApiConfig } from '../config/api';
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
    endpointKeyOrUrl: keyof ApiConfig['endpoints'] | string,
    options: Omit<RequestInit, 'body' | 'headers'> & { body?: unknown; headers?: HeadersInit } = {},
    pathParams: Record<string, string> = {}
  ): Promise<T> {
    let url: string;
        
    // If endpointKeyOrUrl is a full URL, use it directly (e.g., for external APIs)
    if (typeof endpointKeyOrUrl === 'string' && (endpointKeyOrUrl.startsWith('http://') || endpointKeyOrUrl.startsWith('https://'))) {
      url = endpointKeyOrUrl;
    } else {
      // For configured API endpoints, use getApiUrl and apply path params
      let endpointPath = getApiUrl(endpointKeyOrUrl as keyof ApiConfig['endpoints']);

      for (const key in pathParams) {
        endpointPath = endpointPath.replace(`:${key}`, pathParams[key]);
      }
      url = endpointPath;
    }
    
    const token = this.getAuthToken();

    const initialHeaders: Record<string, string> = {};

    if (token) {
      initialHeaders['Authorization'] = `Bearer ${token}`;
    }

    const normalizedOptionsHeaders = this._normalizeHeaders(options.headers);
    const mergedHeaders = { ...initialHeaders, ...normalizedOptionsHeaders };

    const { body: finalBody, headers: finalHeaders } = this._processRequestOptions(options, mergedHeaders);
    
    const finalOptions: RequestInit = {
      ...options,
      headers: finalHeaders,
      body: finalBody,
    };

    const response = await fetch(url, {
      ...finalOptions,
      method: options.method,
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

  async searchCompaniesLinkedInIds(filters: SearchFilters): Promise<Company[]> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    const url = `searchLinkedinIds?${queryParams}`;
    
    const data = await this.makeRequest<any[]>(url, {
      method: 'GET',
    });
    
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
    return this.makeRequest<{ companies: Company[]; keywords: string }>('savedSearches', {
      method: 'GET',
    }, { id: id.toString() });
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
    return this.makeRequest<AdvertData>('advertProcess', {
      method: 'POST',
      body: formData,
    });
  }

  async createBox(pipelineKey: string, requestBody: CreateBoxRequest): Promise<{ message: string; boxId: string }> {
    return this.makeRequest<{ message: string; boxId: string }>('createBox', {
      method: 'POST',
      body: requestBody,
    }, { pipelineKey });
  }
}

export const apiService = new ApiService();