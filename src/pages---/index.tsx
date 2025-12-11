import type { NextPage } from 'next';
import WalletConnect from '../components/WalletConnect';
import StakingForm from '../components/StakingForm';
import Dashboard from '../components/Dashboard';
import Leaderboard from '../components/Leaderboard';

const Home: NextPage = () => {
  return (
    <div className="container">
      <header>
        <img
          src="https://photos.pinksale.finance/file/pinksale-logo-upload/1759847695513-f915ce15471ce09f03d8fbf68bc0616f.png"
          alt="VinuHub Logo"
          className="logo"
        />
        <h1>VinuHub Staking</h1>
        <WalletConnect />
      </header>
      <section id="staking">
        <h2>Stake Your VIN</h2>
        <StakingForm />
      </section>
      <section id="dashboard">
        <h2>Your Dashboard</h2>
        <Dashboard />
      </section>
      <section id="leaderboard">
        <h2>Top Stakers</h2>
        <Leaderboard />
      </section>
      <footer>
        &copy; 2025 VinuHub. Built on VinuChain.{' '}
        <a href="https://t.me/Vinuhub" target="_blank" rel="noopener noreferrer">
          Join our Telegram
        </a>
      </footer>
    </div>
  );
};

export default Home;
