import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { Login } from '../Login';
import { Navigate } from 'react-router-dom';

// Mock React Router Navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: vi.fn(() => null),
  };
});

describe('Login Component', () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mocks to default state
    vi.mocked(require('../../hooks/useAuth').useLogin).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      error: null
    });

    vi.mocked(require('../../store/authStore').useAuthStore).mockReturnValue({
      isAuthenticated: false,
      user: null
    });
  });

  describe('Rendering', () => {
    it('should render login form when not authenticated', () => {
      render(<Login />);
      
      expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render password toggle button', () => {
      render(<Login />);
      
      const toggleButton = screen.getByLabelText(/toggle password visibility/i);
      expect(toggleButton).toBeInTheDocument();
    });

    it('should render loading state', () => {
      vi.mocked(require('../../hooks/useAuth').useLogin).mockReturnValue({
        mutate: mockMutate,
        isLoading: true,
        error: null
      });

      render(<Login />);
      
      const submitButton = screen.getByRole('button', { name: /signing in/i });
      expect(submitButton).toBeDisabled();
    });

    it('should render error message when login fails', () => {
      vi.mocked(require('../../hooks/useAuth').useLogin).mockReturnValue({
        mutate: mockMutate,
        isLoading: false,
        error: { message: 'Invalid credentials' }
      });

      render(<Login />);
      
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should handle email input changes', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email address');
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should handle password input changes', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      await user.type(passwordInput, 'password123');
      
      expect(passwordInput).toHaveValue('password123');
    });

    it('should toggle password visibility', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const toggleButton = screen.getByLabelText(/toggle password visibility/i);
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    it('should submit form with email and password', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email address');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should not submit form when fields are empty', async () => {
      const user = userEvent.setup();
      render(<Login />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('Authentication Redirects', () => {
    it('should redirect admin users to admin dashboard', () => {
      vi.mocked(require('../../store/authStore').useAuthStore).mockReturnValue({
        isAuthenticated: true,
        user: { role: 'admin', id: '1', email: 'admin@test.com' }
      });

      render(<Login />);
      
      expect(Navigate).toHaveBeenCalledWith({ to: '/admin', replace: true }, {});
    });

    it('should redirect staff users to staff dashboard', () => {
      vi.mocked(require('../../store/authStore').useAuthStore).mockReturnValue({
        isAuthenticated: true,
        user: { role: 'staff', id: '2', email: 'staff@test.com' }
      });

      render(<Login />);
      
      expect(Navigate).toHaveBeenCalledWith({ to: '/staff', replace: true }, {});
    });

    it('should redirect customer users to restaurant list', () => {
      vi.mocked(require('../../store/authStore').useAuthStore).mockReturnValue({
        isAuthenticated: true,
        user: { role: 'customer', id: '3', email: 'customer@test.com' }
      });

      render(<Login />);
      
      expect(Navigate).toHaveBeenCalledWith({ to: '/restaurant', replace: true }, {});
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels and attributes', () => {
      render(<Login />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email address');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(emailInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('required');
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot in default state', () => {
      const { container } = render(<Login />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot in loading state', () => {
      vi.mocked(require('../../hooks/useAuth').useLogin).mockReturnValue({
        mutate: mockMutate,
        isLoading: true,
        error: null
      });

      const { container } = render(<Login />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with error', () => {
      vi.mocked(require('../../hooks/useAuth').useLogin).mockReturnValue({
        mutate: mockMutate,
        isLoading: false,
        error: { message: 'Login failed' }
      });

      const { container } = render(<Login />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
