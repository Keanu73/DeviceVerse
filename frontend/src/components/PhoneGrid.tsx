
import React from 'react';
import PhoneCard from './PhoneCard';
import { Phone } from '@/contracts/PhoneMarketplace';

interface PhoneGridProps {
  phones: Phone[];
  loading?: boolean;
  emptyMessage?: string;
}

const PhoneGrid: React.FC<PhoneGridProps> = ({ 
  phones, 
  loading = false,
  emptyMessage = "No phones available" 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-80 bg-gray-100 rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!phones.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {phones.map((phone) => (
        <PhoneCard key={phone.id} phone={phone} />
      ))}
    </div>
  );
};

export default PhoneGrid;
