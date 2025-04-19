
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PhoneDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { phones, buyPhone, verifyPhone } = useMarketplace();
  const { account } = useWallet();
  
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [imeiInput, setImeiInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const phoneId = parseInt(id || '0');
  const phone = phones.find(p => p.id === phoneId);
  
  if (!phone) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Phone Not Found</h2>
          <p className="text-gray-500 mb-8">The phone you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Back to Marketplace</Button>
        </div>
      </Layout>
    );
  }
  
  const isOwner = account && account.toLowerCase() === phone.seller.toLowerCase();
  const canVerify = phone.isSold && !phone.isVerified;
  const canBuy = !phone.isSold;
  
  const handleBuy = async () => {
    setIsProcessing(true);
    try {
      const success = await buyPhone(phone.id, phone.price);
      if (success) {
        navigate('/my-phones');
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleVerify = async () => {
    if (imeiInput.trim() === '') return;
    
    setIsProcessing(true);
    try {
      const success = await verifyPhone(phone.id, imeiInput);
      if (success) {
        setVerifyDialogOpen(false);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden relative">
              <img
                src={`https://placehold.co/600x400/e0e0e0/333333?text=${phone.manufacturer}`}
                alt={`${phone.manufacturer} ${phone.modelName}`}
                className="w-full object-cover"
              />
              
              {phone.isVerified && (
                <div className="absolute top-4 right-4">
                  <Badge className="verified-badge">
                    <Check size={12} className="mr-1" />
                    Verified
                  </Badge>
                </div>
              )}
              
              {phone.isSold && !phone.isVerified && (
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white">
                    Awaiting Verification
                  </Badge>
                </div>
              )}
              
              {phone.isSold && (
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive">
                    SOLD
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {phone.manufacturer} {phone.modelName}
            </h1>
            <p className="text-brand-purple text-2xl font-bold mb-6">
              {phone.price} DOT
            </p>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Phone Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-gray-500">Manufacturer:</span>
                    <span className="col-span-2">{phone.manufacturer}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-gray-500">Model Name:</span>
                    <span className="col-span-2">{phone.modelName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-gray-500">Model Code:</span>
                    <span className="col-span-2">{phone.modelCode}</span>
                  </div>
                  {(isOwner || phone.isVerified) && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-500">IMEI:</span>
                      <span className="col-span-2">{phone.imei}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-gray-500">Seller:</span>
                    <span className="col-span-2">
                      {phone.seller.substring(0, 6)}...{phone.seller.substring(38)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              {canBuy && (
                <Button 
                  onClick={handleBuy} 
                  className="w-full bg-gradient-to-r from-brand-purple to-brand-cyan hover:opacity-90 transition-opacity"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Buy Now (${phone.price} DOT)`}
                </Button>
              )}
              
              {canVerify && (
                <Button 
                  onClick={() => setVerifyDialogOpen(true)}
                  variant="outline" 
                  className="w-full"
                >
                  Verify This Phone
                </Button>
              )}
              
              {!account && (
                <p className="text-sm text-gray-500 text-center">
                  Connect your wallet to buy or verify this phone
                </p>
              )}
            </div>
          </div>
        </div>
        
        <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Phone Ownership</DialogTitle>
              <DialogDescription>
                Enter the IMEI number found on the physical phone to verify its authenticity
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="imei">IMEI Number</Label>
                <Input
                  id="imei"
                  placeholder="Enter the 15-digit IMEI number"
                  value={imeiInput}
                  onChange={(e) => setImeiInput(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  You can usually find the IMEI number in Settings &gt; About Phone, 
                  or by dialing *#06# on the phone.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setVerifyDialogOpen(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button 
                onClick={handleVerify} 
                className="bg-gradient-to-r from-brand-purple to-brand-cyan"
                disabled={isProcessing || imeiInput.trim() === ''}
              >
                {isProcessing ? 'Verifying...' : 'Verify Phone'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default PhoneDetail;
