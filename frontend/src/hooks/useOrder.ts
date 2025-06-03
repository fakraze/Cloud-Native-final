import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, cartService } from '../services/orderService';
import { useCartStore } from '../store/cartStore';
import { CreateOrderRequest } from '../types/order';
import { CartItem } from '../types/restaurant';

// Order hooks
export const useOngoingOrders = () => {
  return useQuery({
    queryKey: ['orders', 'ongoing'],
    queryFn: () => orderService.getOngoingOrders(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useOrderHistory = () => {
  return useQuery({
    queryKey: ['orders', 'history'],
    queryFn: () => orderService.getOrderHistory(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) => orderService.createOrder(orderData),
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Cart hooks
export const useCart = (userId: string) => {
  const { setCart } = useCartStore();

  return useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      const cart = await cartService.getCart(userId);
      if (cart) {
        setCart(cart);
      }
      return cart;
    },
    enabled: !!userId,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: (cartItem: Omit<CartItem, 'id'>) => cartService.addToCart(cartItem),
    onSuccess: (updatedCart) => {
      setCart(updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: ({ cartItemId, updates }: { cartItemId: string; updates: Partial<CartItem> }) =>
      cartService.updateCartItem(cartItemId, updates),
    onSuccess: (updatedCart) => {
      setCart(updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: (cartItemId: string) => cartService.removeFromCart(cartItemId),
    onSuccess: (updatedCart) => {
      setCart(updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
