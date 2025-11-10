import { ethers } from 'ethers';

export interface WalletState {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  address: string;
  status: string;
  isConnected: boolean;
}

export interface ContractState {
  contract: ethers.Contract | null;
  tokenContract: ethers.Contract | null;
}
