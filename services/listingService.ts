
import { Listing, UserPreferences, Borough } from '../types';
import { MOCK_LISTINGS } from '../constants';

// Simulate network latency (e.g., 800ms)
const NETWORK_DELAY = 800;

export interface ListingFilters {
  borough?: string;
  minRent?: number;
  maxRent?: number;
}

/**
 * Simulates an API call to fetch listings.
 * Filters are applied "server-side" (inside this promise).
 */
export const fetchListings = async (
  userPrefs: UserPreferences,
  filters: ListingFilters = {}
): Promise<Listing[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let results = [...MOCK_LISTINGS];

        // 1. Filter by Borough
        // If a specific borough is selected in the UI filter, use that.
        // Otherwise, if the user has specific preferences and hasn't selected "All", 
        // we could default to their preferences, but usually "All" means everything.
        if (filters.borough && filters.borough !== 'All') {
          results = results.filter(l => l.borough === filters.borough);
        }

        // 2. Filter by Affordability (Income)
        // In a real app, the backend would strictly filter out units the user isn't eligible for.
        // Here, we'll mark them or filter them. Let's filter out units where the user
        // is significantly below the minimum income (e.g., < 80% of min_income).
        if (userPrefs.annualIncome > 0) {
           results = results.filter(l => {
             // lenient check: user makes at least 70% of min requirement
             return userPrefs.annualIncome >= (l.min_income * 0.7);
           });
        }

        resolve(results);
      } catch (error) {
        reject(new Error("Failed to fetch listings"));
      }
    }, NETWORK_DELAY);
  });
};
