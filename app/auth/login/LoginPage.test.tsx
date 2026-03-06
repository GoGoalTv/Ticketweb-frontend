import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { AuthProvider } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock API
jest.mock('@/lib/api', () => ({
  post: jest.fn(),
}));
import api from '@/lib/api';

// Mock AuthContext
const mockLogin = jest.fn().mockImplementation(() => Promise.resolve());
jest.mock('@/app/context/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin,
        user: null,
        loading: false
    })
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });
  
  // ... (render tests)

  it('calls login function with correct data on valid submission', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: { access_token: 'valid-token' } });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      // Check if API was called with FormData
      expect(api.post).toHaveBeenCalledWith('/auth/login/access-token', expect.any(FormData), expect.any(Object));
      // Check if login was called with token
      expect(mockLogin).toHaveBeenCalledWith('valid-token');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on failed login', async () => {
    (api.post as jest.Mock).mockRejectedValue({ response: { data: { detail: 'Invalid credentials' } } });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
