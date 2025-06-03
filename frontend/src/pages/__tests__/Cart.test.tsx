import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { Cart } from '../Cart';

// Mock the hooks and stores
vi.mock('../../store/cartStore', () => ({
  useCartStore: vi.fn()
}));

vi.mock('../../hooks/useOrder', () => ({
  useUpdateCartItem: () => ({ mutate: vi.fn() }),
  useRemoveFromCart: () => ({ mutate: vi.fn() }),
  useCreateOrder: () => ({ mutate: vi.fn(), isLoading: false })
}));

const mockCartStore = vi.hoisted(() => ({
  useCartStore: vi.fn()
}));

vi.mock('../../store/cartStore', () => mockCartStore);

describe('Cart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty cart state', () => {
    mockCartStore.useCartStore.mockReturnValue({
      cart: null
    });

    const { container } = render(<Cart />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render cart with items', () => {
    mockCartStore.useCartStore.mockReturnValue({
      cart: {
        id: '1',
        items: [
          {
            id: '1',
            name: 'Pizza Margherita',
            price: 12.99,
            quantity: 2,
            restaurantId: 'rest-1',
            restaurantName: 'Italiano Restaurant',
            customizations: {},
            menuItem: {
              id: '1',
              name: 'Pizza Margherita',
              imageUrl: '/images/pizza.jpg'
            }
          },
          {
            id: '2',
            name: 'Caesar Salad',
            price: 8.50,
            quantity: 1,
            restaurantId: 'rest-1',
            restaurantName: 'Italiano Restaurant',
            customizations: { 'dressing': 'Caesar', 'croutons': 'Extra' },
            menuItem: {
              id: '2',
              name: 'Caesar Salad',
              imageUrl: '/images/salad.jpg'
            }
          }
        ],
        total: 34.48,
        totalAmount: 34.48
      }
    });

    const { container } = render(<Cart />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render cart with single item', () => {
    mockCartStore.useCartStore.mockReturnValue({
      cart: {
        id: '1',
        items: [
          {
            id: '1',
            name: 'Burger Deluxe',
            price: 15.99,
            quantity: 1,
            restaurantId: 'rest-2',
            restaurantName: 'Burger House',
            customizations: {},
            menuItem: {
              id: '1',
              name: 'Burger Deluxe',
              imageUrl: '/images/burger.jpg'
            }
          }
        ],
        total: 15.99,
        totalAmount: 15.99
      }
    });

    const { container } = render(<Cart />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
