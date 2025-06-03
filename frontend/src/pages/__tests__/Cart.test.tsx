import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { Cart } from '../Cart';
import { useNavigate } from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock the hooks and stores
const mockCartStore = vi.hoisted(() => ({
  useCartStore: vi.fn()
}));

vi.mock('../../store/cartStore', () => mockCartStore);

describe('Cart Component', () => {
  const mockNavigate = vi.fn();
  const mockUpdateCart = vi.fn();
  const mockRemoveFromCart = vi.fn();
  const mockCreateOrder = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    
    vi.mocked(require('../../hooks/useOrder').useUpdateCartItem).mockReturnValue({
      mutate: mockUpdateCart
    });
    
    vi.mocked(require('../../hooks/useOrder').useRemoveFromCart).mockReturnValue({
      mutate: mockRemoveFromCart
    });
    
    vi.mocked(require('../../hooks/useOrder').useCreateOrder).mockReturnValue({
      mutate: mockCreateOrder,
      isLoading: false
    });
  });

  describe('Empty Cart State', () => {
    it('should render empty cart when cart is null', () => {
      mockCartStore.useCartStore.mockReturnValue({
        cart: null
      });

      render(<Cart />);
      
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(screen.getByText('Add some delicious items to get started!')).toBeInTheDocument();
      expect(screen.getByText('Browse Restaurants')).toBeInTheDocument();
    });

    it('should render empty cart when cart has no items', () => {
      mockCartStore.useCartStore.mockReturnValue({
        cart: { id: '1', items: [], restaurantId: 'rest-1' }
      });

      render(<Cart />);
      
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should navigate to restaurants when browse button is clicked', async () => {
      const user = userEvent.setup();
      mockCartStore.useCartStore.mockReturnValue({
        cart: null
      });

      render(<Cart />);
      
      const browseButton = screen.getByText('Browse Restaurants');
      await user.click(browseButton);
      
      // Since it's a Link, it won't call navigate directly
      expect(browseButton).toHaveAttribute('href', '/restaurant');
    });
  });

  describe('Cart with Items', () => {
    const mockCartWithItems = {
      id: '1',
      restaurantId: 'rest-1',
      items: [
        {
          id: 'item-1',
          quantity: 2,
          customizations: {},
          menuItem: {
            id: 'menu-1',
            name: 'Pizza Margherita',
            price: 12.99,
            imageUrl: 'pizza.jpg',
            restaurantId: 'rest-1'
          }
        },
        {
          id: 'item-2',
          quantity: 1,
          customizations: {},
          menuItem: {
            id: 'menu-2',
            name: 'Caesar Salad',
            price: 8.99,
            imageUrl: 'salad.jpg',
            restaurantId: 'rest-1'
          }
        }
      ]
    };

    beforeEach(() => {
      mockCartStore.useCartStore.mockReturnValue({
        cart: mockCartWithItems
      });
    });

    it('should render cart items correctly', () => {
      render(<Cart />);
      
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
      expect(screen.getByText('$12.99')).toBeInTheDocument();
      expect(screen.getByText('$8.99')).toBeInTheDocument();
    });

    it('should display correct quantities', () => {
      render(<Cart />);
      
      const quantityInputs = screen.getAllByRole('spinbutton');
      expect(quantityInputs[0]).toHaveValue(2);
      expect(quantityInputs[1]).toHaveValue(1);
    });

    it('should calculate total correctly', () => {
      render(<Cart />);
      
      // Total should be (12.99 * 2) + (8.99 * 1) = 34.97
      expect(screen.getByText('$34.97')).toBeInTheDocument();
    });

    it('should update quantity when plus button is clicked', async () => {
      const user = userEvent.setup();
      render(<Cart />);
      
      const plusButtons = screen.getAllByLabelText(/increase quantity/i);
      await user.click(plusButtons[0]);
      
      expect(mockUpdateCart).toHaveBeenCalledWith({
        cartItemId: 'item-1',
        updates: { quantity: 3 }
      });
    });

    it('should update quantity when minus button is clicked', async () => {
      const user = userEvent.setup();
      render(<Cart />);
      
      const minusButtons = screen.getAllByLabelText(/decrease quantity/i);
      await user.click(minusButtons[0]);
      
      expect(mockUpdateCart).toHaveBeenCalledWith({
        cartItemId: 'item-1',
        updates: { quantity: 1 }
      });
    });

    it('should remove item when quantity becomes 0', async () => {
      const user = userEvent.setup();
      
      // Set up cart with item having quantity 1
      const cartWithOneItem = {
        ...mockCartWithItems,
        items: [{
          ...mockCartWithItems.items[0],
          quantity: 1
        }]
      };
      
      mockCartStore.useCartStore.mockReturnValue({
        cart: cartWithOneItem
      });
      
      render(<Cart />);
      
      const minusButton = screen.getByLabelText(/decrease quantity/i);
      await user.click(minusButton);
      
      expect(mockRemoveFromCart).toHaveBeenCalledWith('item-1');
    });

    it('should remove item when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<Cart />);
      
      const deleteButtons = screen.getAllByLabelText(/remove item/i);
      await user.click(deleteButtons[0]);
      
      expect(mockRemoveFromCart).toHaveBeenCalledWith('item-1');
    });

    it('should handle checkout process', async () => {
      const user = userEvent.setup();
      render(<Cart />);
      
      const checkoutButton = screen.getByText(/proceed to checkout/i);
      await user.click(checkoutButton);
      
      expect(mockCreateOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          restaurantId: 'rest-1',
          items: expect.arrayContaining([
            expect.objectContaining({
              menuItemId: 'menu-1',
              quantity: 2
            })
          ])
        })
      );
    });

    it('should show loading state during checkout', () => {
      vi.mocked(require('../../hooks/useOrder').useCreateOrder).mockReturnValue({
        mutate: mockCreateOrder,
        isLoading: true
      });

      render(<Cart />);
      
      const checkoutButton = screen.getByRole('button', { name: /processing/i });
      expect(checkoutButton).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    it('should have back to restaurant button', () => {
      mockCartStore.useCartStore.mockReturnValue({
        cart: null
      });

      render(<Cart />);
      
      const backButton = screen.getByLabelText(/back to restaurants/i);
      expect(backButton).toBeInTheDocument();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for empty cart', () => {
      mockCartStore.useCartStore.mockReturnValue({
        cart: null
      });

      const { container } = render(<Cart />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for cart with items', () => {
      mockCartStore.useCartStore.mockReturnValue({
        cart: {
          id: '1',
          restaurantId: 'rest-1',
          items: [
            {
              id: 'item-1',
              quantity: 2,
              customizations: {},
              menuItem: {
                id: 'menu-1',
                name: 'Pizza Margherita',
                price: 12.99,
                imageUrl: 'pizza.jpg',
                restaurantId: 'rest-1'
              }
            }
          ]
        }
      });

      const { container } = render(<Cart />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for loading state', () => {
      vi.mocked(require('../../hooks/useOrder').useCreateOrder).mockReturnValue({
        mutate: mockCreateOrder,
        isLoading: true
      });

      mockCartStore.useCartStore.mockReturnValue({
        cart: {
          id: '1',
          restaurantId: 'rest-1',
          items: [
            {
              id: 'item-1',
              quantity: 1,
              customizations: {},
              menuItem: {
                id: 'menu-1',
                name: 'Test Item',
                price: 10.99,
                imageUrl: 'test.jpg',
                restaurantId: 'rest-1'
              }
            }
          ]
        }
      });

      const { container } = render(<Cart />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
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
