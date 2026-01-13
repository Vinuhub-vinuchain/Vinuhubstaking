// src/hooks/useWallet.ts
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile
    const mobileCheck = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
    console.log("Device is mobile:", mobileCheck);
  }, []);

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

      // Add longer timeout for mobile (30s)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout - check MetaMask app or try manual connect")), isMobile ? 30000 : 15000)
      );

      if (manual || isMobile) {
        console.log("Manual/mobile connect: requesting accounts...");
        accounts = await Promise.race([
          window.ethereum.request({ method: "eth_requestAccounts" }),
          timeoutPromise,
        ]) as string[];
      } else {
        console.log("Desktop auto-detect: checking accounts...");
        accounts = await window.ethereum.request({ method: "eth_accounts" });
      }

      if (accounts.length === 0 && manual && isMobile) {
        throw new Error("Mobile connect failed. Open MetaMask app, switch to browser tab, and try again.");
      }

      if (accounts.length === 0) {
        console.log("No accounts found");
        setWalletState((prev) => ({ ...prev, status: "Please connect your wallet" }));
        return;
      }

      console.log("Accounts received:", accounts);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Chain check & switch with timeout
      const network = await Promise.race([
        provider.getNetwork(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Network timeout")), 10000)),
      ]) as ethers.Network;

      console.log("Detected chain ID:", Number(network.chainId));

      if (Number(network.chainId) !== 207) {
        setWalletState((prev) => ({ ...prev, status: "Switching to VinuChain..." }));
        console.log("Switching chain...");

        try {
          await Promise.race([
            window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xCF" }],
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Switch timeout")), 10000)),
          ]);
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
      if (error.message.includes("timeout")) {
        msg += "Connection timed out. On mobile? Open MetaMask app, then return to browser and try manual connect.";
      } else if (error.code === 4001) {
        msg += "You rejected the request in MetaMask.";
      } else if (error.code === -32002) {
        msg += "MetaMask is busy — check your wallet and try again.";
      } else if (isMobile) {
        msg += "Mobile issue. Close browser, open MetaMask app, then try again.";
      } else {
        msg += error.message || "Unknown error";
      }

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
