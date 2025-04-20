import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/components/ui/use-toast';

interface WalletContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Chain configuration via environment variables
  const TARGET_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 420420421;
  const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://westend-asset-hub-eth-rpc.polkadot.io';
  const EXPLORER_URL = import.meta.env.VITE_EXPLORER_URL || 'https://assethub-westend.subscan.io';
  const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || 'WND';

  const isNetworkSupported = (chainId: number) => {
    return chainId === TARGET_CHAIN_ID;
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const network = await provider.getNetwork();
          setProvider(provider);
          setSigner(signer);
          setAccount(accounts[0]);
          setChainId(network.chainId);
        }
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setSigner(null);
          setProvider(null);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Error",
        description: "MetaMask or compatible wallet not found. Please install MetaMask.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (!isNetworkSupported(network.chainId)) {
        // Attempt to add and switch to Polkadot Westend Asset Hub Testnet
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x' + TARGET_CHAIN_ID.toString(16),
            chainName: 'Westend Asset Hub Testnet',
            rpcUrls: [RPC_URL],
            blockExplorerUrls: [EXPLORER_URL],
            nativeCurrency: { name: 'Westend Native Token', symbol: CURRENCY_SYMBOL, decimals: 18 },
          }],
        });
        toast({
          title: "Network Error",
          description: "Switched to Westend Asset Hub Testnet. Please reconnect your wallet.",
          variant: "destructive",
        });
        setIsConnecting(false);
        return;
      }
      
      const signer = provider.getSigner();
      
      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(network.chainId);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to account ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        isConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
