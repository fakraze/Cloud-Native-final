import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { Layout } from '../Layout';

// Mock all the dependencies
vi.mock('../Header', () => ({
  Header: () => <div data-testid="header">Header Component</div>
}));

vi.mock('../Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar Component</div>
}));

vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      username: 'testuser',
      role: 'customer'
    }
  })
}));

vi.mock('../../hooks/useOrder', () => ({
  useCart: vi.fn()
}));

describe('Layout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render layout with header and sidebar', () => {
    const { container } = render(<Layout />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should have proper CSS structure', () => {
    const { container } = render(<Layout />);
    const layoutRoot = container.firstChild as HTMLElement;
    expect(layoutRoot.className).toContain('flex h-screen bg-gray-50');
    expect(layoutRoot).toMatchSnapshot();
  });
});
