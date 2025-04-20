import React from 'react';
import Layout from '@/components/Layout';
import PhoneGrid from '@/components/PhoneGrid';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MyPhones = () => {
  const { myPhones, loadingPhones } = useMarketplace();
  const { account } = useWallet();
  const navigate = useNavigate();
  
  // Filter phones by status
  const sellingPhones = myPhones.filter(phone => phone.seller.toLowerCase() === account.toLowerCase() && !phone.isSold);
  const soldPhones = myPhones.filter(phone => phone.isSold && phone.isVerified);
  const pendingPhones = myPhones.filter(phone => phone.isSold && !phone.isVerified && phone.buyer.toLowerCase() === account.toLowerCase());
  
  if (!account) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-500 mb-8">Please connect your wallet to view your phones.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-cyan">
          My Phones
        </h1>
        <Button 
          onClick={() => navigate('/sell')}
          className="bg-gradient-to-r from-brand-purple to-brand-cyan hover:opacity-90 transition-opacity"
        >
          List New Phone
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="selling">Selling</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <PhoneGrid 
            phones={myPhones} 
            loading={loadingPhones} 
            emptyMessage="You don't have any phones yet"
          />
        </TabsContent>
        
        <TabsContent value="selling" className="mt-6">
          <PhoneGrid 
            phones={sellingPhones} 
            loading={loadingPhones} 
            emptyMessage="You don't have any phones for sale"
          />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <PhoneGrid 
            phones={pendingPhones} 
            loading={loadingPhones} 
            emptyMessage="You don't have any pending verification phones"
          />
        </TabsContent>
        
        <TabsContent value="sold" className="mt-6">
          <PhoneGrid 
            phones={soldPhones} 
            loading={loadingPhones} 
            emptyMessage="You haven't sold any phones yet"
          />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default MyPhones;
