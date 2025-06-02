import api from './api';
import { Order, CreateOrderRequest } from '../types/order';
import { Cart, CartItem } from '../types/restaurant';
import { ApiResponse } from '../types/common';
import { mockOrderService } from './mockOrderService';

// Check if we should use mock API
const shouldUseMock = () => {
  const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';
  const isDev = import.meta.env.VITE_NODE_ENV === 'development';
  return isDev && useMock;
};

export const orderService = {
  getOngoingOrders: async (): Promise<Order[]> => {
    if (shouldUseMock()) {
      return mockOrderService.getOngoingOrders();
    }
    
    try {
      const response = await api.get<ApiResponse<Order[]>>('/order/ongoing');
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockOrderService.getOngoingOrders();
    }
  },

  getOrderHistory: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]>>('/order/history');
    return response.data.data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/order/${orderId}`);
    return response.data.data;
  },

  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/order', orderData);
    return response.data.data;
  },

  cancelOrder: async (orderId: string): Promise<void> => {
    await api.delete(`/order/${orderId}`);
  },

  // Admin endpoints
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]>>('/order/admin/all');
    return response.data.data;
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    const response = await api.put<ApiResponse<Order>>(`/order/${orderId}/status`, { status });
    return response.data.data;
  },
};

export const cartService = {
  getCart: async (userId: string): Promise<Cart> => {
    const response = await api.get<ApiResponse<Cart>>(`/cart/${userId}`);
    return response.data.data;
  },

  addToCart: async (cartItem: Omit<CartItem, 'id'>): Promise<Cart> => {
    const response = await api.post<ApiResponse<Cart>>('/cart', cartItem);
    return response.data.data;
  },

  updateCartItem: async (cartItemId: string, updates: Partial<CartItem>): Promise<Cart> => {
    const response = await api.put<ApiResponse<Cart>>(`/cart/${cartItemId}`, updates);
    return response.data.data;
  },

  removeFromCart: async (cartItemId: string): Promise<Cart> => {
    const response = await api.delete<ApiResponse<Cart>>(`/cart/${cartItemId}`);
    return response.data.data;
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};
