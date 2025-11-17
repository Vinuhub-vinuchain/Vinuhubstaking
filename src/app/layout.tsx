import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VinuHub Staking',
  description: 'Official VIN staking platform on VinuChain',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">{children}</body>
    </html>
  )
}
