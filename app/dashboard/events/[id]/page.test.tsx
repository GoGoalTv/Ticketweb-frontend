import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EventStatsPage from './page';
import { useAuth } from '@/app/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';

// Mock hooks
jest.mock('@/app/context/AuthContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe('EventStatsPage', () => {
  const mockUser = { id: 'user-1', full_name: 'Test User', email: 'test@example.com' };
  const mockEvent = {
    id: 'evt-1',
    title: 'Test Event',
    slug: 'test-event',
    banner_image_url: '/img.jpg'
  };
  const mockStats = {
    total_revenue: 50000,
    tickets_sold: 10,
    tickets_available: 90
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      loading: false,
    });
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useParams as jest.Mock).mockReturnValue({ id: 'evt-1' });

    global.fetch = jest.fn((url) => {
      if (url.includes('/stats')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockStats),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvent),
      });
    }) as jest.Mock;
  });

  it('renders event stats correctly', async () => {
    render(<EventStatsPage />);

    // Wait for data load
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });

    // Check stats
    expect(screen.getByText('$500.00')).toBeInTheDocument(); // 50000 cents
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });
});
