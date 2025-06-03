import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { Header } from '../Header';

// Mock the hooks and stores
vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      username: 'testuser',
      role: 'customer',
      email: 'test@example.com'
    }
  })
}));

vi.mock('../../store/cartStore', () => ({
  useCartStore: () => ({
    cart: {
      items: [
        { id: '1', name: 'Test Item', price: 10.99, quantity: 2 }
      ]
    }
  })
}));

vi.mock('../../hooks/useAuth', () => ({
  useLogout: () => ({
    mutate: vi.fn()
  })
}));

vi.mock('../../hooks/useInbox', () => ({
  useUnreadCount: () => ({
    unreadCount: 3
  }),
  useInbox: () => ({
    messages: [
      { id: '1', title: 'Test Message', content: 'Test content', isRead: false }
    ],
    markAsRead: vi.fn()
  })
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render header with user authenticated', () => {
    const { container } = render(<Header />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render cart icon with item count', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('[data-testid="cart-count"]')).toMatchSnapshot();
  });

  it('should render notification bell with unread count', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('[data-testid="notification-bell"]')).toMatchSnapshot();
  });
});
