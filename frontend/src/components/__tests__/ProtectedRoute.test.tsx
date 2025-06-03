import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { ProtectedRoute } from '../ProtectedRoute';

const mockAuthStore = vi.hoisted(() => ({
  useAuthStore: vi.fn()
}));

vi.mock('../../store/authStore', () => mockAuthStore);

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when user is authenticated and has access', () => {
    mockAuthStore.useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: '1',
        username: 'testuser',
        role: 'customer'
      }
    });

    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with role restrictions', () => {
    mockAuthStore.useAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: '1',
        username: 'admin',
        role: 'admin'
      }
    });

    const { container } = render(
      <ProtectedRoute allowedRoles={['admin']}>
        <div>Admin Only Content</div>
      </ProtectedRoute>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle unauthenticated user', () => {
    mockAuthStore.useAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null
    });

    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
