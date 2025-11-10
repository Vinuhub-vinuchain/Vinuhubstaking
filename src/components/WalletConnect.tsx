import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';

const WalletConnect: React.FC = () => {
  const { connectWallet, disconnectWallet, address, status, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    connectWallet(false); // Auto-connect on load
  }, [connectWallet]);

  const handleConnect = async () => {
    setLoading(true);
    await connectWallet(true);
    setLoading(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  return (
    <div className="wallet-section">
      <button
        id="connectWallet"
        onClick={handleConnect}
        style={{ display: isConnected ? 'none' : 'inline-block' }}
        disabled={loading}
      >
        Connect Wallet {loading && <span className="spinner" />}
      </button>
      <button
        id="disconnectWallet"
        onClick={handleDisconnect}
        style={{ display: isConnected ? 'inline-block' : 'none' }}
      >
        Disconnect Wallet
      </button>
      {address && (
        <p id="wallet-address">
          Connected: <strong>{address.slice(0, 6)}...{address.slice(-4)}</strong>
        </p>
      )}
      <div id="status">{status}</div>
    </div>
  );
};
