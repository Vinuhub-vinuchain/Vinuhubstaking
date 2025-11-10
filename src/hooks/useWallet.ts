import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types';

const vinuChain = {
  chainId: '0xCF',
  chainទ

System: chainName: 'VinuChain',
  rpcUrls: ['https://rpc.vinuchain.org', 'https://vinuchain-rpc.com'],
  nativeCurrency: { name: 'VC', symbol: 'VC', decimals: 18 },
  blockExplorerUrls: ['https://vinuexplorer.org'],
};

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    provider: null,
    signer: null,
    address: '',
    status: 'Please connect your wallet',
    isConnected: false,
  });

  const connectWallet = async (manual: boolean) => {
    try {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error('MetaMask not detected. Install MetaMask from metamask.io.');
      }
      setWalletState((prev) => ({ ...prev, status: manual ? 'Requesting connection...' : 'Auto-detecting wallet...' }));

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let accounts: string[];
      if (manual) {
        console.log('Requesting accounts manually...');
        accounts = await provider.send('eth_requestAccounts', []);
      } else {
        console.log('Checking existing accounts...');
        accounts = await provider.send('eth_accounts', []);
      }

      if (accounts.length === 0 && !manual) {
        console.log('No accounts found');
        setWalletState((prev) => ({ ...prev, status: 'Please connect your wallet' }));
        return;
      }

      console.log('Accounts:', accounts);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      const network = await provider.getNetwork();
      console.log('Current chain ID:', network.chainId);
      if (network.chainId !== 207) {
        setWalletState((prev) => ({ ...prev, status: 'Switching to VinuChain...' }));
        console.log('Attempting to switch to VinuChain...');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xCF' }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            console.log('VinuChain not found, adding...');
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [vinuChain],
            });
          } else {
            throw switchError;
          }
        }
      }

      setWalletState({
        provider,
        signer,
        address,
        status: 'Wallet connected successfully!',
        isConnected: true,
      });
      console.log('Connection successful');
    } catch (error: any) {
      console.error('Connect error:', error);
      let userMessage = 'Connection failed: ';
      if (error.code === 4001 || error.message.includes('User rejected')) {
        userMessage += 'You rejected the request in MetaMask.';
      } else if (error.message.includes('MetaMask not detected')) {
        userMessage += 'Install MetaMask from metamask.io.';
      } else if (error.message.includes('network')) {
        userMessage += 'Network issue. Add VinuChain manually: Chain ID 207, RPC https://rpc.vinuchain.org.';
      } else {
        userMessage += error.message;
      }
      setWalletState((prev) => ({ ...prev, status: userMessage, isConnected: false }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      provider: null,
      signer: null,
      address: '',
      status: 'Wallet disconnected',
      isConnected: false,
    });
    console.log('Wallet disconnected');
  };

  useEffect(() => {
    window.ethereum?.on('accountsChanged', (accounts: string[]) => {
      console.log('Accounts changed:', accounts);
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet(false);
      }
    });

    window.ethereum?.on('chainChanged', (chainId: string) => {
      console.log('Chain changed:', chainId);
      if (parseInt(chainId, 16) !== 207) {
        disconnectWallet();
        setWalletState((prev) => ({ ...prev, status: 'Please switch to VinuChain' }));
      } else {
        connectWallet(false);
      }
    });

    return () => {
      window.ethereum?.removeAllListeners();
    };
  }, []);

  return { connectWallet, disconnectWallet, ...walletState };
};
