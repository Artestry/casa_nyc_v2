import React, { useState } from 'react';
import { Listing } from '../types';
import { MapPin, Users, DollarSign, Calendar, Dog, CheckCircle2, Accessibility, Car, Dumbbell, Waves, Shirt, Building2, ExternalLink } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const [imgError, setImgError] = useState(false);

  const getBadgeColor = (ami: number) => {
    if (ami <= 50) return 'bg-green-100 text-green-800 border-green-200';
    if (ami <= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-orange-100 text-orange-800 border-orange-200';
  };

  const getAmenityIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('pool')) return <Waves size={12} className="mr-1 text-blue-500" />;
    if (lower.includes('fitness') || lower.includes('gym')) return <Dumbbell size={12} className="mr-1 text-orange-500" />;
    if (lower.includes('parking')) return <Car size={12} className="mr-1 text-gray-500" />;
    if (lower.includes('laundry') || lower.includes('washer')) return <Shirt size={12} className="mr-1 text-indigo-500" />;
    return <CheckCircle2 size={12} className="mr-1 text-nyc-blue" />;
  };

  // Generate Street View URL
  // Uses 600x400 size, centered on the address
  const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodeURIComponent(`${listing.address}, ${listing.borough}, NY`)}&key=${process.env.API_KEY}`;
  
  // Use provided image_url if available, otherwise fallback to Street View
  const displayImage = !imgError ? (listing.image_url || streetViewUrl) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={listing.development_name} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
             <Building2 size={48} className="mb-2 opacity-50" />
             <span className="text-xs font-medium">Image unavailable</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 pointer-events-none"></div>
        
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(listing.ami_percentage)} shadow-sm z-10`}>
          {listing.ami_percentage}% AMI
        </div>
        
        {listing.pet_policy !== 'No Pets' && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 flex items-center shadow-sm border border-gray-100 z-10">
            <Dog size={12} className="mr-1.5 text-nyc-orange" />
            {listing.pet_policy.includes('Allowed') ? 'Pets OK' : listing.pet_policy}
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-nyc-blue transition-colors">
            {listing.development_name}
          </h3>
          <p className="text-sm text-gray-500 flex items-center">
            <MapPin size={14} className="mr-1 text-gray-400" />
            {listing.neighborhood}, {listing.borough}
          </p>
        </div>

        <div className="space-y-4 mb-6 flex-1">
          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
               <span className="text-gray-400 block text-[10px] uppercase tracking-wider font-semibold mb-0.5">Rent</span>
               <span className="font-bold text-gray-900 flex items-center text-base">
                 <DollarSign size={14} className="mr-0.5 text-gray-400"/>
                 {listing.rent_range[0]}<span className="text-gray-400 mx-1 text-xs font-normal">-</span>{listing.rent_range[1]}
               </span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
               <span className="text-gray-400 block text-[10px] uppercase tracking-wider font-semibold mb-0.5">Income</span>
               <span className="font-bold text-gray-900 flex items-center text-base">
                 <Users size={14} className="mr-0.5 text-gray-400"/>
                 {(listing.min_income/1000).toFixed(0)}k<span className="text-gray-400 mx-1 text-xs font-normal">-</span>{(listing.max_income/1000).toFixed(0)}k
               </span>
            </div>
          </div>

          {/* Amenities List */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Amenities</span>
            <div className="flex flex-wrap gap-2">
              {listing.amenities.slice(0, 4).map((amenity, i) => (
                <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-600 text-xs font-medium">
                  {getAmenityIcon(amenity)}
                  {amenity}
                </span>
              ))}
              {listing.amenities.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-gray-500 text-xs font-medium border border-gray-200">
                  +{listing.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Accessibility Info */}
          {listing.accessibility_features.length > 0 && (
             <div className="mt-2">
               <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                 <Accessibility size={12} className="mr-1" />
                 Accessibility Features
               </div>
               <div className="flex flex-wrap gap-1.5">
                 {listing.accessibility_features.map((feat, i) => (
                   <span key={i} className="inline-block px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-medium border border-indigo-100">
                     {feat}
                   </span>
                 ))}
               </div>
             </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex justify-between items-center mb-3">
             <span className="text-xs text-orange-700 font-medium flex items-center bg-orange-50 px-2 py-1 rounded border border-orange-100">
               <Calendar size={12} className="mr-1.5" />
               Deadline: {new Date(listing.application_deadline).toLocaleDateString()}
             </span>
             <span className="text-xs text-gray-500 font-medium">
               {listing.affordable_units} units available
             </span>
          </div>
          <a
            href={listing.application_url || "https://housingconnect.nyc.gov/PublicWeb/search/lotteries"}
            target="_blank"
            rel="noopener noreferrer" 
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md active:transform active:scale-[0.99] flex items-center justify-center group/btn"
          >
            View Details & Apply
            <ExternalLink size={14} className="ml-2 opacity-80 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};