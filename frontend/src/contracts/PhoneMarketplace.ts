import { ethers } from "ethers";

// ABI for the Phone Marketplace contract
export const PhoneMarketplaceABI = [
  // ERC-20 Token functions (for marketplace token operations)
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Phone Marketplace specific functions
  "function listPhone(string manufacturer, string modelName, string modelCode, string imei, uint256 price) returns (uint256)",
  "function buyPhone(uint256 phoneId) payable",
  "function verifyPhone(uint256 phoneId, string imei) returns (bool)",
  "function getPhone(uint256 phoneId) view returns (address seller, string manufacturer, string modelName, string modelCode, string imei, uint256 price, bool isSold, bool isVerified, bool isDispatched, bool isReceived, address buyer)",
  "function getPhoneCount() view returns (uint256)",
  "function getMyPhones() view returns (uint256[])",
  
  // Events
  "event PhoneListed(uint256 indexed phoneId, address indexed seller, uint256 price)",
  "event PhoneSold(uint256 indexed phoneId, address indexed seller, address indexed buyer, uint256 price)",
  "event PhoneVerified(uint256 indexed phoneId, address indexed verifier)",
  "event PhoneDispatched(uint256 indexed phoneId, address indexed seller)",
  "event PhoneReceived(uint256 indexed phoneId, address indexed buyer)"
];

// Update with actual contract address after deployment
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x04099c92D8AeccE0094F66836Fcb144De0e139Ec";

export interface Phone {
  id: number;
  seller: string;
  manufacturer: string;
  modelName: string;
  modelCode: string;
  imei: string;
  price: string;
  isSold: boolean;
  isVerified: boolean;
  buyer: string;
}

export function getContract(provider: ethers.providers.Web3Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, PhoneMarketplaceABI, provider.getSigner());
}
