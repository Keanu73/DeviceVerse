
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useNavigate } from 'react-router-dom';

const Verify = () => {
  const { account } = useWallet();
  const { phones } = useMarketplace();
  const navigate = useNavigate();
  
  const [phoneId, setPhoneId] = useState('');
  const [searchResult, setSearchResult] = useState<{ 
    found: boolean; 
    phone?: typeof phones[0]; 
  } | null>(null);
  
  const handleSearch = () => {
    const id = parseInt(phoneId);
    if (isNaN(id)) {
      setSearchResult({ found: false });
      return;
    }
    
    const phone = phones.find(p => p.id === id);
    if (phone) {
      setSearchResult({ found: true, phone });
    } else {
      setSearchResult({ found: false });
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-cyan">
          Verify Phone
        </h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Phone Verification</CardTitle>
            <CardDescription>
              Enter a phone ID to check its details and verification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-grow">
                  <Label htmlFor="phoneId" className="sr-only">Phone ID</Label>
                  <Input
                    id="phoneId"
                    type="number"
                    placeholder="Enter Phone ID"
                    value={phoneId}
                    onChange={(e) => setPhoneId(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-brand-purple to-brand-cyan hover:opacity-90 transition-opacity"
                >
                  Search
                </Button>
              </div>
              
              {account ? (
                <p className="text-xs text-gray-500">
                  After purchase, you'll need to verify the phone using its IMEI number to complete the transaction.
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Connect your wallet to verify phones that you've purchased.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {searchResult && (
          <div>
            {searchResult.found && searchResult.phone ? (
              <Card>
                <CardHeader>
                  <CardTitle>Phone Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-500">Phone ID:</span>
                      <span className="col-span-2">{searchResult.phone.id}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-500">Manufacturer:</span>
                      <span className="col-span-2">{searchResult.phone.manufacturer}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-500">Model Name:</span>
                      <span className="col-span-2">{searchResult.phone.modelName}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-500">Model Code:</span>
                      <span className="col-span-2">{searchResult.phone.modelCode}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-500">Status:</span>
                      <span className="col-span-2">
                        {searchResult.phone.isSold ? (
                          searchResult.phone.isVerified ? 
                            "Sold & Verified" : 
                            "Sold (Awaiting Verification)"
                        ) : (
                          "For Sale"
                        )}
                      </span>
                    </div>
                    
                    <div className="pt-4 flex justify-center">
                      <Button 
                        onClick={() => navigate(`/phone/${searchResult.phone?.id}`)}
                        className="bg-gradient-to-r from-brand-purple to-brand-cyan hover:opacity-90 transition-opacity"
                      >
                        View Full Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No phone found with this ID. Please check the ID and try again.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Verify;
