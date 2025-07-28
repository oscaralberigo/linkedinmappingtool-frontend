interface LinkedInPeopleSearchParams {
  companyIds: string[];
  keywords: string;
  locationCodes?: string[];
}

export class LinkedInUrlFormatter {
  private static baseUrl = 'https://www.linkedin.com/search/results/people/';
  private static linkedInTab: Window | null = null;

  /**
   * Format LinkedIn people search URL with company IDs, keywords, and location codes
   */
  static formatLinkedInPeopleSearchUrl(params: LinkedInPeopleSearchParams): string {
    const { companyIds, keywords, locationCodes } = params;
    
    if (companyIds.length === 0) {
      throw new Error('At least one company ID is required');
    }

    // Format company IDs as JSON array and encode for URL
    const companyIdsJson = JSON.stringify(companyIds);
    const encodedCompanyIds = encodeURIComponent(companyIdsJson);
    
    // Encode keywords
    const encodedKeywords = encodeURIComponent(keywords.trim() || '');

    // Build the LinkedIn people search URL
    let url = `${this.baseUrl}?currentCompany=${encodedCompanyIds}&keywords=${encodedKeywords}&origin=FACETED_SEARCH`;

    // Add location codes as geoUrn if provided
    if (locationCodes && locationCodes.length > 0) {
      // Split combined location codes and flatten into individual codes
      const individualCodes = locationCodes.reduce((acc: string[], code: string) => {
        // Check if the code contains %2C (encoded comma) separators
        if (code.includes('%2C')) {
          // Split by %2C and add each individual code
          const splitCodes = code.split('%2C');
          acc.push(...splitCodes);
        } else {
          // Single code, add as is
          acc.push(code);
        }
        return acc;
      }, []);
      const locationCodesJson = JSON.stringify(individualCodes);
      const encodedLocationCodes = encodeURIComponent(locationCodesJson);
      url += `&geoUrn=${encodedLocationCodes}`;
    }

    return url;
  }

  /**
   * Open LinkedIn people search in a new tab
   */
  static openLinkedInPeopleSearch(params: LinkedInPeopleSearchParams): void {
    const url = this.formatLinkedInPeopleSearchUrl(params);
    
    // Check if we have an existing tab and it's still open
    if (this.linkedInTab && !this.linkedInTab.closed) {
      // Navigate existing tab to new URL
      this.linkedInTab.location.href = url;
      this.linkedInTab.focus();
    } else {
      // Open new tab and store reference
      this.linkedInTab = window.open(url, '_blank');
    }
  }
} 