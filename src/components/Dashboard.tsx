import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';

const Dashboard: React.FC = () => {
  const { address } = useWallet();
  const { contract } = useContract();
  const [stakeInfo, setStakeInfo] = useState({ amount: '0', lockTime: '0', rewards: '0' });
  const [error, setError] = useState('');
  const [loadingUnstake, setLoadingUnstake] = useState(false);
  const [loadingEmergency, setLoadingEmergency] = useState(false);

  const updateDashboard = async () => {
    if (!contract || !address) return;
    try {
      const [amount, lockTimeLeft, rewards] = await contract.getStakeInfo(address);
      setStakeInfo({
        amount: ethers.utils.formatUnits(amount, 18),
        lockTime: Math.ceil(Number(lockTimeLeft) / 86400).toString(),
        rewards: ethers.utils.formatUnits(rewards, 18),
      });
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error('Dashboard error:', err);
    }
  };

  const handleUnstake = async () => {
    try {
      setLoadingUnstake(true);
      const tx = await contract?.unstake();
      await tx?.wait();
      setError('Unstaked successfully!');
      updateDashboard();
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error('Unstake error:', err);
    } finally {
      setLoadingUnstake(false);
    }
  };

  const handleEmergencyUnstake = async () => {
    try {
      setLoadingEmergency(true);
      const tx = await contract?.emergencyUnstake();
      await tx?.wait();
      setError('Emergency unstaked (10% fee applied)!');
      updateDashboard();
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error('Emergency unstake error:', err);
    } finally {
      setLoadingEmergency(false);
    }
  };

  useEffect(() => {
    updateDashboard();
    const interval = setInterval(updateDashboard, 30000);
    return () => clearInterval(interval);
  }, [contract, address]);

  return (
    <div className="dashboard">
      <div className="card">
        <h3>Staked Amount</h3>
        <p>{stakeInfo.amount} VIN</p>
      </div>
      <div className="card">
        <h3>Lock Time Left</h3>
        <p>{stakeInfo.lockTime} Days</p>
      </div>
      <div className="card">
        <h3>Accrued Rewards</h3>
        <p>{stakeInfo.rewards} VIN</p>
        <button
          onClick={handleUnstake}
          disabled={!contract || Number(stakeInfo.amount) === 0 || Number(stakeInfo.lockTime) > 0}
        >
          Unstake {loadingUnstake && <span className="spinner" />}
        </button>
        <button
          onClick={handleEmergencyUnstake}
          disabled={!contract || Number(stakeInfo.amount) === 0}
        >
          Emergency Unstake (10% Fee) {loadingEmergency && <span className="spinner" />}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
