
import React from 'react';
import Layout from '@/components/Layout';
import PhoneGrid from '@/components/PhoneGrid';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { phones, loadingPhones } = useMarketplace();
  const navigate = useNavigate();
  
  // Filter only unsold phones for the marketplace
  const availablePhones = phones.filter(phone => !phone.isSold);

  return (
    <Layout>
      <section className="mb-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-cyan">
            PhoneVerse Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Buy and sell phones securely on the blockchain
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => navigate('/sell')}
              className="bg-gradient-to-r from-brand-purple to-brand-cyan hover:opacity-90 transition-opacity"
              size="lg"
            >
              Sell Your Phone
            </Button>
            <Button 
              onClick={() => navigate('/verify')}
              variant="outline" 
              size="lg"
            >
              Verify a Phone
            </Button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Available Phones</h2>
        </div>
        
        <PhoneGrid 
          phones={availablePhones} 
          loading={loadingPhones}
          emptyMessage="No phones are currently available for sale"
        />
      </section>
    </Layout>
  );
};

export default Index;
