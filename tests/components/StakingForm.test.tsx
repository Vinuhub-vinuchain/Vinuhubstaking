import { render, screen, fireEvent } from '@testing-library/react';
import StakingForm from '../../src/components/StakingForm';
import { useWallet } from '../../src/hooks/useWallet';
import { useContract } from '../../src/hooks/useContract';

jest.mock('../../src/hooks/useWallet');
jest.mock('../../src/hooks/useContract');

describe('StakingForm', () => {
  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({ signer: {} });
    (useContract as jest.Mock).mockReturnValue({ contract: {}, tokenContract: {} });
  });

  it('renders staking form', () => {
    render(<StakingForm />);
    expect(screen.getByText('Minimum Stake: 10 VIN')).toBeInTheDocument();
    expect(screen.getByText('Approve VIN')).toBeInTheDocument();
    expect(screen.getByText('Stake Now')).toBeInTheDocument();
  });

  it('shows error for invalid amount', () => {
    render(<StakingForm />);
    fireEvent.change(screen.getByPlaceholderText('Enter amount (min 10 VIN)'), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByText('Approve VIN'));
    expect(screen.getByText('Enter at least 10 VIN')).toBeInTheDocument();
  });
});
