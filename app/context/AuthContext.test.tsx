import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import api from '@/lib/api';
import React from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the API module
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Test component to consume the context
const TestComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="user-email">{user?.email}</div>
      <button onClick={() => login('fake-token')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('provides initial unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-email')).toBeEmptyDOMElement();
  });

  it('handles successful login', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { access_token: 'fake-token' },
    });
    
    // Mock the user fetch that happens after login
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { id: '1', email: 'test@example.com', full_name: 'Test User' },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('handles logout', async () => {
    // Setup initial logged in state
    localStorage.setItem('token', 'fake-token');
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { email: 'test@example.com' },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial check to complete
    await waitFor(() => {
        // Just wait for the effect to run
    });

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
