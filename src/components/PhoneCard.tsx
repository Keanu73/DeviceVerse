
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone } from '@/contracts/PhoneMarketplace';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface PhoneCardProps {
  phone: Phone;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ phone }) => {
  const navigate = useNavigate();

  const getImageForPhone = (manufacturer: string) => {
    // In a real app, you'd have actual images for each phone
    // For now, we'll determine a placeholder based on the manufacturer
    const brand = manufacturer.toLowerCase();
    if (brand.includes('apple') || brand.includes('iphone')) {
      return 'https://placehold.co/300x200/e0e0e0/333333?text=iPhone';
    } else if (brand.includes('samsung') || brand.includes('galaxy')) {
      return 'https://placehold.co/300x200/e0e0e0/333333?text=Samsung';
    } else if (brand.includes('google') || brand.includes('pixel')) {
      return 'https://placehold.co/300x200/e0e0e0/333333?text=Pixel';
    } else {
      return 'https://placehold.co/300x200/e0e0e0/333333?text=Smartphone';
    }
  };
  
  const viewDetails = () => {
    navigate(`/phone/${phone.id}`);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative overflow-hidden">
        <img 
          src={getImageForPhone(phone.manufacturer)} 
          alt={`${phone.manufacturer} ${phone.modelName}`}
          className="w-full h-48 object-cover"
        />
        
        {phone.isVerified && (
          <div className="absolute top-2 right-2">
            <Badge className="verified-badge">
              <Check size={12} className="mr-1" />
              Verified
            </Badge>
          </div>
        )}
        
        {phone.isSold && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-xl">SOLD</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="font-medium text-lg mb-1">{phone.manufacturer} {phone.modelName}</div>
        <div className="text-sm text-gray-500 mb-3">Model: {phone.modelCode}</div>
        <div className="font-bold text-brand-purple">
          {phone.price} DOT
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={viewDetails}
          className="w-full bg-gradient-to-r from-brand-purple to-brand-cyan hover:opacity-90 transition-opacity"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PhoneCard;
