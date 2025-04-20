
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { Separator } from '@/components/ui/separator';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center font-bold text-2xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-cyan">
                  DevicePlace
                </span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-brand-purple transition-colors">
                Marketplace
              </Link>
              <Link to="/sell" className="text-gray-600 hover:text-brand-purple transition-colors">
                Sell Phone
              </Link>
              <Link to="/my-phones" className="text-gray-600 hover:text-brand-purple transition-colors">
                My Phones
              </Link>
              <Link to="/verify" className="text-gray-600 hover:text-brand-purple transition-colors">
                Verify
              </Link>
            </nav>
            
            <div>
              {account ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                    {account.substring(0, 6)}...{account.substring(38)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnectWallet}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-brand-purple to-brand-cyan hover:opacity-90 transition-opacity"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <Separator className="mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">
                © 2025 DevicePlace Marketplace. Built on Polkadot.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="text-gray-500 hover:text-brand-purple text-sm">
                Terms
              </Link>
              <Link to="/" className="text-gray-500 hover:text-brand-purple text-sm">
                Privacy
              </Link>
              <Link to="/" className="text-gray-500 hover:text-brand-purple text-sm">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
