import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { ContractState } from '../types';
import { contractABI, tokenABI } from '../utils/contractABI';

const contractAddress = '0x3d0Be68690c09264Bd249927e7638F504eC46B6b';
const vinTokenAddress = '0x6109835364EdA2c43CaA8981681e75782C13566C';

export const useContract = () => {
  const { signer } = useWallet();
  const [contractState, setContractState] = useState<ContractState>({
    contract: null,
    tokenContract: null,
  });

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tokenContract = new ethers.Contract(vinTokenAddress, tokenABI, signer);
      setContractState({ contract, tokenContract });
    } else {
      setContractState({ contract: null, tokenContract: null });
    }
  }, [signer]);

  return contractState;
};
