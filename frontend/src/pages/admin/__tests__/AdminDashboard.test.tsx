import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../../../test/test-utils';
import { AdminDashboard } from '../AdminDashboard';

const mockUseOrderHistory = vi.hoisted(() => ({
  useOrderHistory: vi.fn()
}));

const mockUseRestaurants = vi.hoisted(() => ({
  useRestaurants: vi.fn()
}));

vi.mock('../../../hooks/useOrder', () => mockUseOrderHistory);
vi.mock('../../../hooks/useRestaurant', () => mockUseRestaurants);

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard with no data', () => {
    mockUseOrderHistory.useOrderHistory.mockReturnValue({
      data: null
    });
    mockUseRestaurants.useRestaurants.mockReturnValue({
      data: null
    });

    const { container } = render(<AdminDashboard />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render dashboard with sample data', () => {
    const sampleOrders = [
      {
        id: '1',
        status: 'completed',
        totalAmount: 25.99,
        orderDate: new Date().toISOString(),
        restaurantName: 'Italiano Restaurant'
      },
      {
        id: '2',
        status: 'pending',
        totalAmount: 18.50,
        orderDate: new Date().toISOString(),
        restaurantName: 'Burger House'
      },
      {
        id: '3',
        status: 'completed',
        totalAmount: 32.75,
        orderDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        restaurantName: 'Sushi Palace'
      }
    ];

    const sampleRestaurants = [
      {
        id: '1',
        name: 'Italiano Restaurant',
        isActive: true
      },
      {
        id: '2',
        name: 'Burger House',
        isActive: true
      },
      {
        id: '3',
        name: 'Closed Restaurant',
        isActive: false
      }
    ];

    mockUseOrderHistory.useOrderHistory.mockReturnValue({
      data: sampleOrders
    });
    mockUseRestaurants.useRestaurants.mockReturnValue({
      data: sampleRestaurants
    });

    const { container } = render(<AdminDashboard />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render dashboard with empty arrays', () => {
    mockUseOrderHistory.useOrderHistory.mockReturnValue({
      data: []
    });
    mockUseRestaurants.useRestaurants.mockReturnValue({
      data: []
    });

    const { container } = render(<AdminDashboard />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
