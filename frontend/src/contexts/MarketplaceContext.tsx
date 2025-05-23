import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract, Phone } from '@/contracts/PhoneMarketplace';
import { useWallet } from './WalletContext';
import { useToast } from '@/components/ui/use-toast';

// Move mock data outside component to keep identity stable
const mockPhones: Phone[] = [
  {
    id: 1,
    seller: "0x123...abc",
    manufacturer: "Apple",
    modelName: "iPhone 15 Pro",
    modelCode: "A2650",
    imei: "353915102643841",
    price: ethers.utils.parseEther("1.2").toString(),
    isSold: false,
    isVerified: false
  },
  {
    id: 2,
    seller: "0x456...def",
    manufacturer: "Samsung",
    modelName: "Galaxy S23 Ultra",
    modelCode: "SM-S918B",
    imei: "354026119462057",
    price: ethers.utils.parseEther("1.1").toString(),
    isSold: true,
    isVerified: true
  },
  {
    id: 3,
    seller: "0x789...ghi",
    manufacturer: "Google",
    modelName: "Pixel 8 Pro",
    modelCode: "GP-387",
    imei: "352475112219416",
    price: ethers.utils.parseEther("0.9").toString(),
    isSold: false,
    isVerified: false
  }
];

interface MarketplaceContextType {
  phones: Phone[];
  myPhones: Phone[];
  loadingPhones: boolean;
  refreshPhones: () => Promise<void>;
  listPhone: (
    manufacturer: string,
    modelName: string,
    modelCode: string,
    imei: string,
    price: string
  ) => Promise<boolean>;
  buyPhone: (phoneId: number, price: string) => Promise<boolean>;
  verifyPhone: (phoneId: number, imei: string) => Promise<boolean>;
}

const MarketplaceContext = createContext<MarketplaceContextType>({
  phones: [],
  myPhones: [],
  loadingPhones: false,
  refreshPhones: async () => {},
  listPhone: async () => false,
  buyPhone: async () => false,
  verifyPhone: async () => false,
});

export function useMarketplace() {
  return useContext(MarketplaceContext);
}

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [myPhones, setMyPhones] = useState<Phone[]>([]);
  const [loadingPhones, setLoadingPhones] = useState(false);
  const { provider, account } = useWallet();
  const { toast } = useToast();

  const refreshPhones = useCallback(async () => {
    setLoadingPhones(true);
    if (!provider) {
      // Use mock data when not connected to blockchain
      setPhones([]);
      setMyPhones([]);
      setLoadingPhones(false);
      return;
    }
    try {
      const contract = getContract(provider);
      const phoneCount = await contract.getPhoneCount();
      
      const phonePromises: Promise<Phone>[] = [];
      // Fetch phones by 0-based index to match contract storage
      for (let i = 0; i < phoneCount.toNumber(); i++) {
        phonePromises.push(contract.getPhone(i));
      }
      
      const phonesData = await Promise.all(phonePromises);
      
      const formattedPhones: Phone[] = phonesData.map((phone, index) => ({
        id: index,
        seller: phone.seller,
        manufacturer: phone.manufacturer,
        modelName: phone.modelName,
        modelCode: phone.modelCode,
        imei: phone.imei,
        price: ethers.utils.formatEther(phone.price),
        isSold: phone.isSold,
        isVerified: phone.isVerified,
        buyer: phone.buyer,
      }));
      
      setPhones(formattedPhones);
      
      // Get my phones
      if (account) {
        const myPhoneIdsRaw = await contract.getMyPhones();
        const myPhoneIds = myPhoneIdsRaw.map(id => id.toNumber());
        const myFilteredPhones = formattedPhones.filter(phone => 
          myPhoneIds.includes(phone.id) || phone.seller.toLowerCase() === account.toLowerCase()
        );
        setMyPhones(myFilteredPhones);
      }
    } catch (error) {
      console.error("Error fetching phones:", error);
      toast({
        title: "Error",
        description: error.reason,
        variant: "destructive",
      });
    } finally {
      setLoadingPhones(false);
    }
  }, [provider, account, toast]);

  useEffect(() => {
    refreshPhones();
  }, [refreshPhones]);

  // Refresh on relevant contract events
  useEffect(() => {
    if (!provider) return;
    const contract = getContract(provider);
    const update = () => refreshPhones();
    contract.on('PhoneListed', update);
    contract.on('PhoneSold', update);
    contract.on('PhoneVerified', update);
    contract.on('PhoneDispatched', update);
    contract.on('PhoneReceived', update);
    return () => {
      contract.off('PhoneListed', update);
      contract.off('PhoneSold', update);
      contract.off('PhoneVerified', update);
      contract.off('PhoneDispatched', update);
      contract.off('PhoneReceived', update);
    };
  }, [provider, refreshPhones]);

  const listPhone = async (
    manufacturer: string,
    modelName: string,
    modelCode: string,
    imei: string,
    price: string
  ) => {
    if (!provider) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }

    try {
      const contract = getContract(provider);
      const priceInWei = ethers.utils.parseEther(price);
      // Use basic gas limit override to avoid RPC issues
      const tx = await contract.listPhone(
        manufacturer,
        modelName,
        modelCode,
        imei,
        priceInWei,
        //{ gasLimit: 3000n * 1000000n }
      );
      
      toast({
        title: "Transaction Submitted",
        description: "Your phone is being listed...",
      });
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: `Your phone (${manufacturer} ${modelName}) has been listed!`,
      });
      
      refreshPhones();
      return true;
    } catch (error) {
      console.error("Error listing phone:", error);
      console.error("Full RPC error:", error)
      console.error("error.data:", error.data)
      toast({
        title: "Error",
        description: error.reason,
        variant: "destructive",
      });
      return false;
    }
  };

  const buyPhone = async (phoneId: number, price: string) => {
    if (!provider) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }

    try {
      const contract = getContract(provider);
      const priceInWei = ethers.utils.parseEther(price);
      // Use basic overrides for value and gas
      const tx = await contract.buyPhone(phoneId, {
        value: priceInWei,
        //gasLimit: 3000n * 1000000n
      });
      
      toast({
        title: "Transaction Submitted",
        description: "Your purchase is being processed...",
      });
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "You've successfully purchased the phone! Please give some time for the transaction to be confirmed on the blockchain.",
      });
      
      refreshPhones();
      return true;
    } catch (error) {
      console.error("Error buying phone:", error);
      toast({
        title: "Error",
        description: error.reason,
        variant: "destructive",
      });
      return false;
    }
  };

  const verifyPhone = async (phoneId: number, imei: string) => {
    if (!provider) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }

    try {
      const contract = getContract(provider);
      const tx = await contract.verifyPhone(phoneId, imei, {
        //gasLimit: 300000n * 1000000n
      });
      
      toast({
        title: "Verification Submitted",
        description: "Your verification is being processed...",
      });
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Phone verified successfully!",
      });
      
      refreshPhones();
      return true;
    } catch (error) {
      console.error("Error verifying phone:", error);
      toast({
        title: "Error",
        description: error.reason,
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        phones,
        myPhones,
        loadingPhones,
        refreshPhones,
        listPhone,
        buyPhone,
        verifyPhone,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
