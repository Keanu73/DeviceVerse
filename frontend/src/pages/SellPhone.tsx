
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const SellPhone = () => {
  const navigate = useNavigate();
  const { account } = useWallet();
  const { listPhone } = useMarketplace();
  
  const [manufacturer, setManufacturer] = useState('');
  const [modelName, setModelName] = useState('');
  const [modelCode, setModelCode] = useState('');
  const [imei, setImei] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      return;
    }
    
    setIsSubmitting(true);

    toast({
      title: 'Listing Phone',
      description: 'Please wait while we list your phone for sale on the blockchain.',
      duration: 5000,
    });
    
    try {
      const success = await listPhone(
        manufacturer,
        modelName,
        modelCode,
        imei,
        price
      );
      
      if (success) {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!account) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-500 mb-8">Please connect your wallet to list a phone for sale.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-cyan">
          Sell Your Phone
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Phone Details</CardTitle>
            <CardDescription>
              Fill in the details of the phone you want to sell
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  placeholder="e.g. Apple, Samsung, Google"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modelName">Model Name</Label>
                <Input
                  id="modelName"
                  placeholder="e.g. iPhone 15 Pro, Galaxy S23"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modelCode">Model Code</Label>
                <Input
                  id="modelCode"
                  placeholder="e.g. A2650, SM-S918B"
                  value={modelCode}
                  onChange={(e) => setModelCode(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imei">IMEI Number</Label>
                <Input
                  id="imei"
                  placeholder="15-digit IMEI number"
                  value={imei}
                  maxLength={15}
                  pattern="\d{15}"
                  title="IMEI must be a 15-digit number"
                  className="w-full"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  onFocus={(e) => e.target.setSelectionRange(0, 15)}
                  onChange={(e) => setImei(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  You can find the IMEI number in Settings &gt; About Phone, 
                  or by dialing *#06# on your phone.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (DOT)</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-purple to-brand-cyan hover:opacity-90 transition-opacity"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'List Phone for Sale'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SellPhone;
