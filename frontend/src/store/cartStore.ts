import { create } from 'zustand';
import { Cart, CartItem } from '../types/restaurant';

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  setCart: (cart: Cart) => void;
  addItem: (item: CartItem) => void;
  updateItem: (itemId: string, updates: Partial<CartItem>) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  setCart: (cart: Cart) => {
    set({ cart, error: null });
  },

  addItem: (item: CartItem) => {
    const currentCart = get().cart;
    if (!currentCart) return;

    const existingItemIndex = currentCart.items.findIndex(
      (existingItem) => 
        existingItem.menuItem.id === item.menuItem.id &&
        JSON.stringify(existingItem.customizations) === JSON.stringify(item.customizations)
    );

    let updatedItems;
    if (existingItemIndex >= 0) {
      // Update quantity if item with same customizations exists
      updatedItems = currentCart.items.map((existingItem, index) =>
        index === existingItemIndex
          ? { ...existingItem, quantity: existingItem.quantity + item.quantity }
          : existingItem
      );
    } else {
      // Add new item
      updatedItems = [...currentCart.items, item];
    }

    const totalAmount = updatedItems.reduce(
      (sum, cartItem) => sum + cartItem.menuItem.price * cartItem.quantity,
      0
    );

    set({
      cart: {
        ...currentCart,
        items: updatedItems,
        totalAmount,
      },
    });
  },

  updateItem: (itemId: string, updates: Partial<CartItem>) => {
    const currentCart = get().cart;
    if (!currentCart) return;

    const updatedItems = currentCart.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    const totalAmount = updatedItems.reduce(
      (sum, cartItem) => sum + cartItem.menuItem.price * cartItem.quantity,
      0
    );

    set({
      cart: {
        ...currentCart,
        items: updatedItems,
        totalAmount,
      },
    });
  },

  removeItem: (itemId: string) => {
    const currentCart = get().cart;
    if (!currentCart) return;

    const updatedItems = currentCart.items.filter((item) => item.id !== itemId);
    const totalAmount = updatedItems.reduce(
      (sum, cartItem) => sum + cartItem.menuItem.price * cartItem.quantity,
      0
    );

    set({
      cart: {
        ...currentCart,
        items: updatedItems,
        totalAmount,
      },
    });
  },

  clearCart: () => {
    set({ cart: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
