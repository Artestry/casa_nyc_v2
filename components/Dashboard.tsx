import React, { useState, useEffect } from 'react';
import { UserPreferences, Borough, Listing } from '../types';
import { AMI_DATA_2024 } from '../constants';
import { ListingCard } from './ListingCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Filter, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface DashboardProps {
  user: UserPreferences;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [filterBorough, setFilterBorough] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  
  // Data State
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch Listings on mount or when filters/user change
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Construct API URL with query parameters
        const params = new URLSearchParams();
        
        if (filterBorough !== 'All') {
          params.append('borough', filterBorough);
        }
        
        // Pass user context for server-side filtering
        params.append('income', user.annualIncome.toString());
        params.append('maxRent', user.maxRent.toString());
        params.append('householdSize', user.householdSize.toString());

        const response = await fetch(`/api/listings?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        
        if (isMounted) {
          setListings(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Fetch error:", err);
          setError('We are having trouble connecting to the listing service. Please check your internet connection and try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, [user, filterBorough, retryCount]);

  // Prepare chart data (synchronous)
  const chartData = AMI_DATA_2024.map(d => ({
    ...d,
    userIncome: user.annualIncome
  }));

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.fullName.split(' ')[0]}</h1>
        <p className="text-gray-600 mt-2">Based on your household size of {user.householdSize} and income of ${user.annualIncome.toLocaleString()}, here are your matches.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Analytics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Your Income Position</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" fill="#E2E8F0" radius={[0, 4, 4, 0]} name="AMI Limit" />
                  <ReferenceLine x={user.annualIncome} stroke="#FF6600" label="You" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Comparison against NYC 2024 AMI limits for your household size.
            </p>
          </div>

          <div className="bg-nyc-blue text-white p-6 rounded-xl shadow-md">
            <h3 className="font-bold mb-2">Did you know?</h3>
            <p className="text-sm text-blue-100 mb-4">
              Since you selected "{user.boroughs.join(', ')}" as preferred boroughs, you may have priority for 50% of units in new developments within those Community Boards.
            </p>
            <button className="text-xs bg-white text-nyc-blue px-3 py-1.5 rounded font-bold hover:bg-gray-100">
              Learn about Community Preference
            </button>
          </div>
        </div>

        {/* Right Col: Listings */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              Top Matches 
              {!isLoading && !error && <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{listings.length}</span>}
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} className="mr-2" /> Filter
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex gap-4 animate-fade-in-down">
               <select 
                value={filterBorough}
                onChange={(e) => setFilterBorough(e.target.value)}
                className="p-2 border rounded text-sm focus:ring-2 focus:ring-nyc-blue focus:outline-none"
               >
                 <option value="All">All Boroughs</option>
                 {Object.values(Borough).map(b => <option key={b} value={b}>{b}</option>)}
               </select>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
              <Loader2 className="h-8 w-8 text-nyc-blue animate-spin mb-4" />
              <p className="text-gray-500 text-sm">Finding the best matches for you...</p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto mt-4">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to Load Listings</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={handleRetry} 
                className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <RefreshCw size={16} className="mr-2" /> 
                Retry Connection
              </button>
            </div>
          )}

          {/* Listings Grid */}
          {!isLoading && !error && (
            <div className="grid md:grid-cols-2 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!isLoading && !error && listings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No listings match your current filters.</p>
              <button 
                onClick={() => setFilterBorough('All')}
                className="mt-2 text-nyc-blue font-medium text-sm hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};