"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { WalletState } from "../types";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const vinuChain = {
  chainId: "0xCF",
  chainName: "VinuChain",
  rpcUrls: ["https://rpc.vinuchain.org", "https://vinuchain-rpc.com"],
  nativeCurrency: { name: "VC", symbol: "VC", decimals: 18 },
  blockExplorerUrls: ["https://vinuexplorer.org"],
};

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    provider: null,
    signer: null,
    address: "",
    status: "Please connect your wallet",
    isConnected: false,
  });

  const connectWallet = async (manual = false) => {
    if (typeof window === "undefined") return; // Skip on server

    try {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error("MetaMask not detected. Install from metamask.io");
      }

      setWalletState((prev) => ({
        ...prev,
        status: manual ? "Requesting connection..." : "Auto-detecting wallet...",
      }));

      // Use BrowserProvider (ethers v6)
      const provider = new ethers.BrowserProvider(window.ethereum);

      let accounts: string[] = [];

      if (manual) {
        console.log("Manual connect: requesting accounts...");
        accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      } else {
        console.log("Auto-detect: checking accounts...");
        accounts = await window.ethereum.request({ method: "eth_accounts" });
      }

      if (accounts.length === 0 && !manual) {
        console.log("No accounts found yet");
        setWalletState((prev) => ({ ...prev, status: "Please connect your wallet" }));
        return;
      }

      console.log("Accounts:", accounts);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Check/switch chain
      const network = await provider.getNetwork();
      console.log("Detected chain ID:", Number(network.chainId));

      if (Number(network.chainId) !== 207) {
        setWalletState((prev) => ({ ...prev, status: "Switching to VinuChain..." }));
        console.log("Switching chain...");

        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xCF" }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            console.log("Adding VinuChain...");
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
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
        status: "Wallet connected successfully!",
        isConnected: true,
      });

      console.log("Wallet fully connected!");
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      let msg = "Connection failed: ";
      if (error.code === 4001) msg += "You rejected in MetaMask.";
      else if (error.code === -32002) msg += "MetaMask is already processing a request — check your wallet.";
      else if (error.message.includes("User rejected")) msg += "You rejected the request.";
      else msg += error.message || "Unknown error";

      setWalletState((prev) => ({
        ...prev,
        status: msg,
        isConnected: false,
      }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      provider: null,
      signer: null,
      address: "",
      status: "Wallet disconnected",
      isConnected: false,
    });
    console.log("Wallet disconnected");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log("Accounts changed:", accounts);
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet(false);
      }
    };

    const handleChainChanged = (chainId: string) => {
      console.log("Chain changed to:", chainId);
      if (parseInt(chainId, 16) !== 207) {
        disconnectWallet();
        setWalletState((prev) => ({ ...prev, status: "Please switch to VinuChain" }));
      } else {
        connectWallet(false);
      }
    };

    window.ethereum?.on("accountsChanged", handleAccountsChanged);
    window.ethereum?.on("chainChanged", handleChainChanged);

    // Initial auto-connect
    connectWallet(false);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return { connectWallet, disconnectWallet, ...walletState };
};
