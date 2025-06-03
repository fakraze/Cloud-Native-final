import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { RoleBasedRedirect } from '../RoleBasedRedirect';

const mockAuthStore = vi.hoisted(() => ({
  useAuthStore: vi.fn()
}));

vi.mock('../../store/authStore', () => mockAuthStore);

describe('RoleBasedRedirect Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to login when no user', () => {
    mockAuthStore.useAuthStore.mockReturnValue({
      user: null
    });

    const { container } = render(<RoleBasedRedirect />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should redirect admin to admin dashboard', () => {
    mockAuthStore.useAuthStore.mockReturnValue({
      user: {
        id: '1',
        username: 'admin',
        role: 'admin'
      }
    });

    const { container } = render(<RoleBasedRedirect />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should redirect staff to staff dashboard', () => {
    mockAuthStore.useAuthStore.mockReturnValue({
      user: {
        id: '2',
        username: 'staff',
        role: 'staff'
      }
    });

    const { container } = render(<RoleBasedRedirect />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should redirect customer to restaurants', () => {
    mockAuthStore.useAuthStore.mockReturnValue({
      user: {
        id: '3',
        username: 'customer',
        role: 'customer'
      }
    });

    const { container } = render(<RoleBasedRedirect />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
