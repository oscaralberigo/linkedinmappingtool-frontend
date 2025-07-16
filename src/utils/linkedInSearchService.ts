import { apiService } from '../services/api';
import { LinkedInIdsRequest } from '../types/api';
import { LinkedInUrlFormatter } from './linkedinUrlFormatter';

interface LinkedInSearchParams {
  businessModels: string[];
  keywords: string;
}

export class LinkedInSearchService {
  /**
   * Perform LinkedIn search by fetching IDs and opening search results
   */
  static async performLinkedInSearch(params: LinkedInSearchParams): Promise<void> {
    const { businessModels, keywords } = params;

    if (businessModels.length === 0) {
      throw new Error('Please select at least one business model');
    }

    // Prepare API request
    const businessModelNames = businessModels.join(', ');
    const request: LinkedInIdsRequest = {
      businessModels: businessModelNames
    };

    console.log('Fetching LinkedIn IDs for business models:', businessModelNames);
    
    // Fetch LinkedIn IDs from API
    const response = await apiService.getLinkedInIds(request);
    
    console.log('LinkedIn IDs received:', response.linkedInIds);
    console.log('Total count:', response.count);
    console.log('Business model:', response.businessModel);

    // Format and open LinkedIn search
    const searchParams = {
      linkedInIds: response.linkedInIds,
      keywords: keywords.trim() || '' // Use empty string if no keywords
    };

    console.log('Opening LinkedIn search with params:', searchParams);
    LinkedInUrlFormatter.openLinkedInSearch(searchParams);
  }

  /**
   * Validate search parameters
   */
  static validateSearchParams(businessModels: string[]): string | null {
    if (businessModels.length === 0) {
      return 'Please select at least one business model';
    }
    return null;
  }
} 