import { render, screen, fireEvent } from '@testing-library/react';
import WalletConnect from '../../src/components/WalletConnect';
import { useWallet } from '../../src/hooks/useWallet';

jest.mock('../../src/hooks/useWallet');

describe('WalletConnect', () => {
  const mockConnectWallet = jest.fn();
  const mockDisconnectWallet = jest.fn();

  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({
      connectWallet: mockConnectWallet,
      disconnectWallet: mockDisconnectWallet,
      address: '',
      status: 'Please connect your wallet',
      isConnected: false,
    });
  });

  it('renders connect button initially', () => {
    render(<WalletConnect />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    expect(screen.queryByText('Disconnect Wallet')).not.toBeInTheDocument();
  });

  it('calls connectWallet on button click', () => {
    render(<WalletConnect />);
    fireEvent.click(screen.getByText('Connect Wallet'));
    expect(mockConnectWallet).toHaveBeenCalledWith(true);
  });
});
