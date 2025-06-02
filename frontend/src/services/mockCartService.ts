import { Cart, CartItem } from '../types/restaurant';

// Mock cart data - in a real app this would be stored in localStorage or session storage
let mockCart: Cart | null = null;

export const mockCartService = {
  getCart: async (_userId: string): Promise<Cart | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return existing cart or null if no cart exists
    return mockCart;
  },

  addToCart: async (cartItem: Omit<CartItem, 'id'>): Promise<Cart> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Create cart if it doesn't exist
    if (!mockCart) {
      mockCart = {
        id: `cart_${Date.now()}`,
        userId: '1', // Default user
        restaurantId: cartItem.menuItem.restaurantId,
        items: [],
        totalAmount: 0
      };
    }
    
    // Check if item with same customizations already exists
    const existingItemIndex = mockCart.items.findIndex(
      item => 
        item.menuItem.id === cartItem.menuItem.id &&
        JSON.stringify(item.customizations) === JSON.stringify(cartItem.customizations)
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      mockCart.items[existingItemIndex].quantity += cartItem.quantity;
    } else {
      // Add new item
      const newCartItem: CartItem = {
        id: `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...cartItem
      };
      mockCart.items.push(newCartItem);
    }
    
    // Recalculate total
    mockCart.totalAmount = mockCart.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    
    return { ...mockCart };
  },

  updateCartItem: async (cartItemId: string, updates: Partial<CartItem>): Promise<Cart> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!mockCart) {
      throw new Error('Cart not found');
    }
    
    const itemIndex = mockCart.items.findIndex(item => item.id === cartItemId);
    if (itemIndex === -1) {
      throw new Error('Cart item not found');
    }
    
    // Update the item
    mockCart.items[itemIndex] = {
      ...mockCart.items[itemIndex],
      ...updates
    };
    
    // Recalculate total
    mockCart.totalAmount = mockCart.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    
    return { ...mockCart };
  },

  removeFromCart: async (cartItemId: string): Promise<Cart> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!mockCart) {
      throw new Error('Cart not found');
    }
    
    // Remove the item
    mockCart.items = mockCart.items.filter(item => item.id !== cartItemId);
    
    // Recalculate total
    mockCart.totalAmount = mockCart.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    
    return { ...mockCart };
  },

  clearCart: async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    mockCart = null;
  },

  // Helper method to initialize cart with sample data for testing
  initializeWithSampleData: () => {
    mockCart = {
      id: 'sample_cart',
      userId: '1',
      restaurantId: '1',
      items: [
        {
          id: 'cart_item_1',
          menuItem: {
            id: '1',
            restaurantId: '1',
            name: 'Margherita Pizza',
            description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce',
            price: 18.99,
            category: 'pizza',
            isAvailable: true,
            preparationTime: 15,
            imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400',
            allergens: ['gluten', 'dairy'],
            nutritionInfo: {
              calories: 320,
              protein: 12,
              carbs: 35,
              fat: 14
            },
            customizations: []
          },
          quantity: 2,
          customizations: { size: 'Large (14")', crust: 'Thin Crust' },
          notes: 'Extra basil please'
        }
      ],
      totalAmount: 37.98
    };
  }
};
