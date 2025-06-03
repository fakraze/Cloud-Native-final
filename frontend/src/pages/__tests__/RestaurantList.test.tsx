import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { RestaurantList } from '../RestaurantList';

// Mock the hooks
vi.mock('../../hooks/useRestaurant', () => ({
  useRestaurants: vi.fn()
}));

const mockUseRestaurants = vi.hoisted(() => ({
  useRestaurants: vi.fn()
}));

vi.mock('../../hooks/useRestaurant', () => mockUseRestaurants);

describe('RestaurantList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseRestaurants.useRestaurants.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });

    const { container } = render(<RestaurantList />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render error state', () => {
    mockUseRestaurants.useRestaurants.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch')
    });

    const { container } = render(<RestaurantList />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render restaurant list with data', () => {
    mockUseRestaurants.useRestaurants.mockReturnValue({
      data: [
        {
          id: '1',
          name: 'Italiano Restaurant',
          description: 'Authentic Italian cuisine',
          cuisine: 'Italian',
          rating: 4.5,
          imageUrl: '/images/italian.jpg',
          address: '123 Main St',
          deliveryTime: '30-40 min'
        },
        {
          id: '2',
          name: 'Burger House',
          description: 'Best burgers in town',
          cuisine: 'American',
          rating: 4.2,
          imageUrl: '/images/burger.jpg',
          address: '456 Oak Ave',
          deliveryTime: '20-30 min'
        },
        {
          id: '3',
          name: 'Sushi Palace',
          description: 'Fresh sushi and Japanese dishes',
          cuisine: 'Japanese',
          rating: 4.8,
          imageUrl: '/images/sushi.jpg',
          address: '789 Pine St',
          deliveryTime: '25-35 min'
        }
      ],
      isLoading: false,
      error: null
    });

    const { container } = render(<RestaurantList />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render empty restaurant list', () => {
    mockUseRestaurants.useRestaurants.mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });

    const { container } = render(<RestaurantList />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
