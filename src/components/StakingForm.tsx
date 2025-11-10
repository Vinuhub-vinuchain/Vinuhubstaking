import { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';

const StakingForm: React.FC = () => {
  const { signer } = useWallet();
  const { contract, tokenContract } = useContract();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingStake, setLoadingStake] = useState(false);

  const handleApprove = async () => {
    if (!amount || Number(amount) < 10) {
      setError('Enter at least 10 VIN');
      return;
    }
    try {
      setLoadingApprove(true);
      const tx = await tokenContract?.approve(contract?.address, ethers.utils.parseUnits(amount, 18));
      await tx?.wait();
      setError('Approved! Now stake.');
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error('Approve error:', err);
    } finally {
      setLoadingApprove(false);
    }
  };

  const handleStake = async () => {
    try {
      setLoadingStake(true);
      const tx = await contract?.stake(ethers.utils.parseUnits(amount, 18));
      await tx?.wait();
      setError('Staked successfully!');
      setAmount('');
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error('Stake error:', err);
    } finally {
      setLoadingStake(false);
    }
  };

  return (
    <div className="card">
      <p>Minimum Stake: 10 VIN</p>
      <p>Minimum Lock: 7 Days</p>
      <p>APY: ~15% (variable)</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount (min 10 VIN)"
        min="10"
      />
      <button onClick={handleApprove} disabled={!signer || loadingApprove}>
        Approve VIN {loadingApprove && <span className="spinner" />}
      </button>
      <button onClick={handleStake} disabled={!signer || loadingStake}>
        Stake Now {loadingStake && <span className="spinner" />}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
