import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { Sidebar } from '../Sidebar';

vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      username: 'testuser',
      role: 'customer'
    }
  })
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sidebar for customer user', () => {
    const { container } = render(<Sidebar />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
