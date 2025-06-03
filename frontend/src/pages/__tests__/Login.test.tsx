import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { Login } from '../Login';

// Mock the hooks and stores
vi.mock('../../hooks/useAuth', () => ({
  useLogin: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null
  })
}));

vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    user: null
  })
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    const { container } = render(<Login />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render login form with proper styling and structure', () => {
    const { container, getByPlaceholderText } = render(<Login />);
    
    // Check form elements exist by placeholder text instead of role
    expect(container.querySelector('form')).toMatchSnapshot();
    expect(getByPlaceholderText('Enter your email address')).toMatchSnapshot();
    expect(getByPlaceholderText('Enter your password')).toMatchSnapshot();
  });

  it('should render submit button', () => {
    const { getByRole } = render(<Login />);
    const submitButton = getByRole('button', { name: /sign in/i });
    expect(submitButton).toMatchSnapshot();
  });
});
