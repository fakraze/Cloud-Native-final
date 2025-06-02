import api from './api';
import { Order, CreateOrderRequest } from '../types/order';
import { Cart, CartItem } from '../types/restaurant';
import { ApiResponse } from '../types/common';
import { mockOrderService } from './mockOrderService';
import { mockCartService } from './mockCartService';

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
    if (shouldUseMock()) {
      return mockOrderService.getOrderHistory();
    }
    
    try {
      const response = await api.get<ApiResponse<Order[]>>('/order/history');
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockOrderService.getOrderHistory();
    }
  },
  getOrder: async (orderId: string): Promise<Order> => {
    if (shouldUseMock()) {
      return mockOrderService.getOrderById(orderId);
    }
    
    try {
      const response = await api.get<ApiResponse<Order>>(`/order/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockOrderService.getOrderById(orderId);
    }
  },
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    if (shouldUseMock()) {
      return mockOrderService.createOrder(orderData);
    }
    
    try {
      const response = await api.post<ApiResponse<Order>>('/order', orderData);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockOrderService.createOrder(orderData);
    }
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

  updatePaymentStatus: async (orderId: string, paymentStatus: 'pending' | 'paid' | 'failed', paymentMethod?: string): Promise<Order> => {
    if (shouldUseMock()) {
      return mockOrderService.updatePaymentStatus(orderId, paymentStatus, paymentMethod);
    }
    
    try {
      const response = await api.put<ApiResponse<Order>>(`/order/${orderId}/payment`, { 
        paymentStatus, 
        paymentMethod 
      });
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockOrderService.updatePaymentStatus(orderId, paymentStatus, paymentMethod);
    }
  },
};

export const cartService = {
  getCart: async (userId: string): Promise<Cart | null> => {
    if (shouldUseMock()) {
      return mockCartService.getCart(userId);
    }
    
    try {
      const response = await api.get<ApiResponse<Cart>>(`/cart/${userId}`);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockCartService.getCart(userId);
    }
  },

  addToCart: async (cartItem: Omit<CartItem, 'id'>): Promise<Cart> => {
    if (shouldUseMock()) {
      return mockCartService.addToCart(cartItem);
    }
    
    try {
      const response = await api.post<ApiResponse<Cart>>('/cart', cartItem);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockCartService.addToCart(cartItem);
    }
  },

  updateCartItem: async (cartItemId: string, updates: Partial<CartItem>): Promise<Cart> => {
    if (shouldUseMock()) {
      return mockCartService.updateCartItem(cartItemId, updates);
    }
    
    try {
      const response = await api.put<ApiResponse<Cart>>(`/cart/${cartItemId}`, updates);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockCartService.updateCartItem(cartItemId, updates);
    }
  },

  removeFromCart: async (cartItemId: string): Promise<Cart> => {
    if (shouldUseMock()) {
      return mockCartService.removeFromCart(cartItemId);
    }
    
    try {
      const response = await api.delete<ApiResponse<Cart>>(`/cart/${cartItemId}`);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockCartService.removeFromCart(cartItemId);
    }
  },

  clearCart: async (): Promise<void> => {
    if (shouldUseMock()) {
      return mockCartService.clearCart();
    }
    
    try {
      await api.delete('/cart');
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockCartService.clearCart();
    }
  },
};
