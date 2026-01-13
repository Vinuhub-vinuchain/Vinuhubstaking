import { ethers } from 'ethers';

export interface WalletState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  address: string;
  status: string;
  isConnected: boolean;
}

export interface ContractState {
  contract: ethers.Contract | null;
  tokenContract: ethers.Contract | null;
}
