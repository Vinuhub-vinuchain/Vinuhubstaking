import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WalletConnect from '@/components/WalletConnect';
import { useWallet } from '@/hooks/useWallet';

jest.mock('@/hooks/useWallet');

describe('WalletConnect', () => {
  it('shows connect button initially', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connectWallet: jest.fn(),
      address: '',
      status: '',
      isConnected: false,
    });
    render(<WalletConnect />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('shows disconnect button when connected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
      address: '0x1234...5678',
      status: 'Wallet connected successfully!',
      isConnected: true,
    });
    render(<WalletConnect />);
    expect(screen.getByText('Disconnect Wallet')).toBeInTheDocument();
    expect(screen.getByText('Connected: 0x1234...5678')).toBeInTheDocument();
  });
});
