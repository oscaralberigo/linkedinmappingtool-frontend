import { apiService } from '../services/api';
import { LinkedInIdsRequest } from '../types/api';
import { LinkedInUrlFormatter } from './linkedinUrlFormatter';

interface LinkedInSearchParams {
  businessModels: string[];
  keywords: string;
  additionalCompanyIds?: string[]; // New parameter for additional company IDs
}

export class LinkedInSearchService {
  /**
   * Perform LinkedIn search by fetching IDs and opening search results
   */
  static async performLinkedInSearch(params: LinkedInSearchParams): Promise<void> {
    const { businessModels, keywords, additionalCompanyIds = [] } = params;

    if (businessModels.length === 0 && additionalCompanyIds.length === 0) {
      throw new Error('Please select at least one business model or company');
    }

    let allLinkedInIds: string[] = [];

    // Fetch LinkedIn IDs from business models if any are selected
    if (businessModels.length > 0) {
      // Prepare API request
      const businessModelNames = businessModels.join(', ');
      const request: LinkedInIdsRequest = {
        businessModels: businessModelNames
      };

      console.log('Fetching LinkedIn IDs for business models:', businessModelNames);
      
      // Fetch LinkedIn IDs from API
      const response = await apiService.getLinkedInIds(request);
      
      allLinkedInIds = [...response.linkedInIds];
    }

    // Add additional company IDs
    if (additionalCompanyIds.length > 0) {
      console.log('Adding additional company LinkedIn IDs:', additionalCompanyIds);
      allLinkedInIds = [...allLinkedInIds, ...additionalCompanyIds];
    }

    console.log('Combined LinkedIn IDs:', allLinkedInIds);

    // Format and open LinkedIn search
    const searchParams = {
      linkedInIds: allLinkedInIds,
      keywords: keywords.trim() || '' // Use empty string if no keywords
    };

    console.log('Opening LinkedIn search with params:', searchParams);
    LinkedInUrlFormatter.openLinkedInSearch(searchParams);
  }

  /**
   * Validate search parameters
   */
  static validateSearchParams(businessModels: string[], additionalCompanyIds: string[] = []): string | null {
    if (businessModels.length === 0 && additionalCompanyIds.length === 0) {
      return 'Please select at least one business model or company';
    }
    return null;
  }
} 