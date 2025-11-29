import { MOCK_LISTINGS } from '../constants';

export const startMockApi = () => {
  // Store the original fetch function
  // We bind it to window to ensure it has the correct context when called later
  const originalFetch = window.fetch ? window.fetch.bind(window) : null;

  const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    
    // Check if the request is for our mock endpoint
    // We check for both relative path and absolute path including origin
    const isMockEndpoint = urlString.includes('/api/listings');

    if (isMockEndpoint) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));

      try {
        // Parse URL parameters safely
        // specific handling for relative URLs which URL() constructor doesn't like
        const baseUrl = window.location.origin;
        const fullUrl = urlString.startsWith('http') ? urlString : `${baseUrl}${urlString.startsWith('/') ? '' : '/'}${urlString}`;
        const url = new URL(fullUrl);
        const params = url.searchParams;

        let results = [...MOCK_LISTINGS];

        // Filter by Borough
        const borough = params.get('borough');
        if (borough && borough !== 'All') {
          results = results.filter(l => l.borough === borough);
        }

        // Filter by Income Eligibility
        const income = parseInt(params.get('income') || '0');
        if (income > 0) {
          // Simple rule: User must make at least 70% of the minimum income requirement
          results = results.filter(l => income >= (l.min_income * 0.7));
        }

        // Filter by Max Rent
        const maxRent = parseInt(params.get('maxRent') || '0');
        if (maxRent > 0) {
           results = results.filter(l => l.rent_range[0] <= maxRent);
        }

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

    // Pass through other requests (like Google GenAI) if original fetch exists
    if (originalFetch) {
      return originalFetch(input, init);
    }
    
    throw new Error("Fetch is not supported in this environment");
  };

  // Safely override window.fetch
  try {
    window.fetch = mockFetch;
  } catch (err) {
    // If direct assignment fails (e.g. read-only property), try defineProperty
    try {
      Object.defineProperty(window, 'fetch', {
        value: mockFetch,
        writable: true,
        configurable: true
      });
    } catch (err2) {
      console.error("Failed to mock fetch API:", err2);
    }
  }
};