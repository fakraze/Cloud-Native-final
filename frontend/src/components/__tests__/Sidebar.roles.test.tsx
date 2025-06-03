import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { Sidebar } from '../Sidebar';

const mockAuthStore = vi.hoisted(() => ({
  useAuthStore: vi.fn()
}));

vi.mock('../../store/authStore', () => mockAuthStore);

describe('Sidebar Component - Different Roles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render admin sidebar navigation', () => {
    mockAuthStore.useAuthStore.mockReturnValue({
      user: {
        id: '1',
        username: 'admin',
        role: 'admin'
      }
    });

    const { container } = render(<Sidebar />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render staff sidebar navigation', () => {
    mockAuthStore.useAuthStore.mockReturnValue({
      user: {
        id: '1',
        username: 'staff',
        role: 'staff'
      }
    });

    const { container } = render(<Sidebar />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render customer sidebar navigation', () => {
    mockAuthStore.useAuthStore.mockReturnValue({
      user: {
        id: '1',
        username: 'customer',
        role: 'customer'
      }
    });

    const { container } = render(<Sidebar />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
