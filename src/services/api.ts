import { getApiUrl } from '../config';

interface SearchCompaniesRequest {
  keywords: string;
  businessModel: string;
}

interface SearchCompaniesResponse {
  companyIds: string[];
  // Add other response fields as needed
}

interface BusinessModel {
  id: string;
  name: string;
}

interface BusinessModelsResponse {
  businessModels: string[];
  count: number;
}

interface LinkedInIdsRequest {
  businessModels: string;
}

interface LinkedInIdsResponse {
  businessModel: string; // Single string like "Bank, Asset Manager"
  linkedInIds: string[];
  count: number;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Handle query parameters in the endpoint string
    const [endpointKey, queryString] = endpoint.split('?');
    const baseUrl = getApiUrl(endpointKey as any);
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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

  async searchCompanies(request: SearchCompaniesRequest): Promise<SearchCompaniesResponse> {
    return this.makeRequest<SearchCompaniesResponse>('searchCompanies', {
      method: 'POST',
      body: JSON.stringify(request),
    });
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
}

export const apiService = new ApiService();
export type { 
  SearchCompaniesRequest, 
  SearchCompaniesResponse, 
  BusinessModel, 
  BusinessModelsResponse,
  LinkedInIdsRequest,
  LinkedInIdsResponse
}; 