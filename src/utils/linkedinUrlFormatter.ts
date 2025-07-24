import { apiService } from '../services/api';
import { LinkedInIdsRequest } from '../types/api';

interface LinkedInSearchParams {
  linkedInIds: string[];
  keywords: string;
}

interface LinkedInPeopleSearchParams {
  companyIds: string[];
  keywords: string;
}

export class LinkedInUrlFormatter {
  private static baseUrl = 'https://www.linkedin.com/search/results/people/';
  private static linkedInTab: Window | null = null;

  /**
   * Format LinkedIn IDs and keywords into a LinkedIn search URL
   */
  static formatSearchUrl(params: LinkedInSearchParams): string {
    const { linkedInIds, keywords } = params;

    // Format LinkedIn IDs as JSON array and encode properly for LinkedIn
    const currentCompanyJson = JSON.stringify(linkedInIds);
    
    // Encode keywords (empty string is fine)
    const keywordsParam = encodeURIComponent(keywords || '');

    // Build URL manually to ensure proper encoding
    const baseUrl = this.baseUrl;
    const currentCompanyParam = encodeURIComponent(currentCompanyJson);
    
    const finalUrl = `${baseUrl}?currentCompany=${currentCompanyParam}&keywords=${keywordsParam}&origin=FACETED_SEARCH`;
    
    return finalUrl;
  }

  /**
   * Format LinkedIn people search URL with company IDs and keywords
   */
  static formatLinkedInPeopleSearchUrl(params: LinkedInPeopleSearchParams): string {
    const { companyIds, keywords } = params;
    
    if (companyIds.length === 0) {
      throw new Error('At least one company ID is required');
    }

    // Format company IDs as JSON array and encode for URL
    const companyIdsJson = JSON.stringify(companyIds);
    const encodedCompanyIds = encodeURIComponent(companyIdsJson);
    
    // Encode keywords
    const encodedKeywords = encodeURIComponent(keywords.trim() || '');

    // Build the LinkedIn people search URL
    const url = `${this.baseUrl}?currentCompany=${encodedCompanyIds}&keywords=${encodedKeywords}&origin=FACETED_SEARCH`;

    return url;
  }

  /**
   * Open LinkedIn search in a new tab or reuse existing tab
   */
  static openLinkedInSearch(params: LinkedInSearchParams): void {
    const url = this.formatSearchUrl(params);
    
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

  /**
   * Close the LinkedIn tab if it exists
   */
  static closeLinkedInTab(): void {
    if (this.linkedInTab && !this.linkedInTab.closed) {
      this.linkedInTab.close();
      this.linkedInTab = null;
    }
  }

  /**
   * Check if LinkedIn tab is currently open
   */
  static isLinkedInTabOpen(): boolean {
    return !!(this.linkedInTab && !this.linkedInTab.closed);
  }
} 