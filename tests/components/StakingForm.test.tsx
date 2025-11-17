import { render, screen, fireEvent } from '@testing-library/react';
import StakingForm from '@/components/StakingForm';

jest.mock('@/hooks/useWallet');
jest.mock('@/hooks/useContract');

describe('StakingForm', () => {
  it('disables buttons when not connected', () => {
    render(<StakingForm />);
    expect(screen.getByText('Approve VIN')).toBeDisabled();
    expect(screen.getByText('Stake Now')).toBeDisabled();
  });

  it('shows error for amount less than 10', () => {
    render(<StakingForm />);
    fireEvent.change(screen.getByPlaceholderText('Enter amount (min 10 VIN)'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Approve VIN'));
    expect(screen.getByText('Enter at least 10 VIN')).toBeInTheDocument();
  });
});
