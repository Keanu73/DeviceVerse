
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PhoneDetail from "./pages/PhoneDetail";
import SellPhone from "./pages/SellPhone";
import MyPhones from "./pages/MyPhones";
import Verify from "./pages/Verify";
import { WalletProvider } from "./contexts/WalletContext";
import { MarketplaceProvider } from "./contexts/MarketplaceContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <MarketplaceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/phone/:id" element={<PhoneDetail />} />
              <Route path="/sell" element={<SellPhone />} />
              <Route path="/my-phones" element={<MyPhones />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MarketplaceProvider>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
