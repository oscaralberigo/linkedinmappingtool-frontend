import { getApiUrl } from '../config';
import {
  BusinessModelsResponse,
  LinkedInIdsRequest,
  LinkedInIdsResponse,
  AllCompaniesResponse
} from '../types/api';

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
}

export const apiService = new ApiService(); 