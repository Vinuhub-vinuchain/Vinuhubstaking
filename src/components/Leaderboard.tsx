import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';

const Leaderboard: React.FC = () => {
  const { contract } = useContract();
  const [leaderboard, setLeaderboard] = useState<{ user: string; amount: string }[]>([]);
  const [error, setError] = useState('');

  const updateLeaderboard = async () => {
    if (!contract) return;
    try {
      const [users, amounts] = await contract.getLeaderboard();
      const formatted = users.map((user: string, i: number) => ({
        user: `${user.slice(0, 6)}...${user.slice(-4)}`,
        amount: ethers.utils.formatUnits(amounts[i], 18),
      }));
      setLeaderboard(formatted);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error('Leaderboard error:', err);
    }
  };

  useEffect(() => {
    updateLeaderboard();
    const interval = setInterval(updateLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [contract]);

  return (
    <div className="leaderboard">
      {leaderboard.length === 0 ? (
        <p>No stakers yet.</p>
      ) : (
        leaderboard.map((entry, i) => (
          <div key={i} className="card">
            <h3>Rank {i + 1}</h3>
            <p>{entry.user}</p>
            <p>{entry.amount} VIN</p>
          </div>
        ))
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};
