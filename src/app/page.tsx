import WalletConnect from '@/components/WalletConnect'
import StakingForm from '@/components/StakingForm'
import Dashboard from '@/components/Dashboard'
import Leaderboard from '@/components/Leaderboard'

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <img src="https://photos.pinksale.finance/file/pinksale-logo-upload/1759847695513-f915ce15471ce09f03d8fbf68bc0616f.png" alt="VinuHub" className="w-40 mx-auto mb-4" />
          <h1 className="text-4xl font-bold">VinuHub Staking</h1>
          <WalletConnect />
        </header>

        <section className="grid gap-8">
          <StakingForm />
          <Dashboard />
          <Leaderboard />
        </section>

        <footer className="text-center mt-16 text-gray-400">
          © 2025 VinuHub • Built on <strong>VinuChain</strong> •{' '}
          <a href="https://t.me/Vinuhub" target="_blank" className="text-blue-400">Telegram</a>
        </footer>
      </div>
    </main>
  )
}
