import { MOCK_LISTINGS } from '../constants';

/**
 * A wrapper around fetch that intercepts calls to /api/listings.
 * This avoids patching window.fetch directly which can cause errors in strict environments
 * where window.fetch is read-only.
 */
export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  // Safely extract URL string
  let urlString: string = '';
  if (typeof input === 'string') {
    urlString = input;
  } else if (input instanceof URL) {
    urlString = input.toString();
  } else if (input && typeof input === 'object' && 'url' in input) {
    urlString = input.url;
  }
  
  // Check if the request is for our mock endpoint
  // We check for both relative path and absolute path including origin
  const isMockEndpoint = urlString.includes('/api/listings');

  if (isMockEndpoint) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      // Parse URL parameters safely
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
      // Handle relative URLs by prepending the origin
      const fullUrl = urlString.startsWith('http') 
        ? urlString 
        : `${baseUrl}${urlString.startsWith('/') ? '' : '/'}${urlString}`;
        
      const url = new URL(fullUrl);
      const params = url.searchParams;

      let results = [...MOCK_LISTINGS];

      // Filter by Borough (Case insensitive)
      const borough = params.get('borough');
      if (borough && borough !== 'All') {
        results = results.filter(l => l.borough.toLowerCase() === borough.toLowerCase());
      }

      // Filter by Income Eligibility
      const income = parseInt(params.get('income') || '0');
      if (income > 0) {
        // User must make at least 70% of the minimum income requirement
        // AND user must not exceed the maximum income requirement (strict HPD rule)
        results = results.filter(l => 
          income >= (l.min_income * 0.7) && 
          income <= l.max_income
        );
      }

      // Filter by Max Rent
      const maxRent = parseInt(params.get('maxRent') || '0');
      if (maxRent > 0) {
         results = results.filter(l => l.rent_range[0] <= maxRent);
      }

      // Sort results: Put listings with 'tfc.com' applications slightly higher to highlight partners
      results.sort((a, b) => {
        const isTfcA = a.application_url?.includes('tfc.com') ? 1 : 0;
        const isTfcB = b.application_url?.includes('tfc.com') ? 1 : 0;
        return isTfcB - isTfcA; // TFC first
      });

      return new Response(JSON.stringify(results), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Mock API Error:", error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Pass through other requests to the real fetch implementation
  if (typeof window !== 'undefined' && window.fetch) {
    return window.fetch(input, init);
  }
  
  // Fallback if no fetch is available
  throw new Error("Fetch is not supported in this environment");
};