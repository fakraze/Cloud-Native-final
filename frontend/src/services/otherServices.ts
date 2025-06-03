import api from './api';
import { Rating, CreateRatingRequest, DishRating, CreateDishRatingRequest } from '../types/rating';
import { InboxMessage } from '../types/common';
import { mockRatingService } from './mockRatingService';
import { mockInboxService } from './mockInboxService';

// Check if we should use mock API (for development without backend)
const shouldUseMock = () => {
  const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';
  const isDev = import.meta.env.VITE_NODE_ENV === 'development';
  return isDev && useMock;
};

export const ratingService = {
  getRatings: async (restaurantId: string): Promise<Rating[]> => {
    if (shouldUseMock()) {
      return mockRatingService.getRatings(restaurantId);
    }
    try {
      const response = await api.get<Rating[]>(`/rating/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockRatingService.getRatings(restaurantId);
    }
  },

  createRating: async (ratingData: CreateRatingRequest): Promise<Rating> => {
    if (shouldUseMock()) {
      return mockRatingService.createRating(ratingData);
    }
    try {
      const response = await api.post<Rating>('/rating', ratingData);
      return response.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockRatingService.createRating(ratingData);
    }
  },

  updateRating: async (ratingId: string, ratingData: Partial<CreateRatingRequest>): Promise<Rating> => {
    if (shouldUseMock()) {
      return mockRatingService.updateRating(ratingId, ratingData);
    }
    try {
      const response = await api.put<Rating>(`/rating/${ratingId}`, ratingData);
      return response.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockRatingService.updateRating(ratingId, ratingData);
    }
  },

  deleteRating: async (ratingId: string): Promise<void> => {
    if (shouldUseMock()) {
      return mockRatingService.deleteRating(ratingId);
    }
    
    try {
      await api.delete(`/rating/${ratingId}`);
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');      return mockRatingService.deleteRating(ratingId);
    }
  },
};

export const dishRatingService = {
  getDishRatings: async (dishId: string): Promise<DishRating[]> => {
    if (shouldUseMock()) {
      return mockRatingService.getDishRatings(dishId);
    }
    try {
      const response = await api.get<DishRating[]>(`/dish-rating/${dishId}`);
      return response.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockRatingService.getDishRatings(dishId);
    }
  },

  getDishAverageRating: async (dishId: string): Promise<{ rating: number; count: number }> => {
    if (shouldUseMock()) {
      return mockRatingService.getDishAverageRating(dishId);
    }
    try {
      const response = await api.get<{ rating: number; count: number }>(`/dish-rating/${dishId}/average`);
      return response.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockRatingService.getDishAverageRating(dishId);
    }
  },

  createDishRating: async (ratingData: CreateDishRatingRequest): Promise<DishRating> => {
    if (shouldUseMock()) {
      return mockRatingService.createDishRating(ratingData);
    }
    try {
      const response = await api.post<DishRating>('/dish-rating', ratingData);
      return response.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockRatingService.createDishRating(ratingData);
    }
  },
};

export const inboxService = {
  getMessages: async (userId: string): Promise<InboxMessage[]> => {
    if (shouldUseMock()) {
      return mockInboxService.getMessages(userId);
    }
    try {
      const response = await api.get<InboxMessage[]>(`/inbox/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockInboxService.getMessages(userId);
    }
  },

  markAsRead: async (messageId: string): Promise<InboxMessage> => {
    if (shouldUseMock()) {
      return mockInboxService.markAsRead(messageId);
    }
    try {
      const response = await api.put<InboxMessage>(`/inbox/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockInboxService.markAsRead(messageId);
    }
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    if (shouldUseMock()) {
      return mockInboxService.markAllAsRead(userId);
    }
    
    try {
      await api.put(`/inbox/${userId}/read-all`);
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockInboxService.markAllAsRead(userId);
    }
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    if (shouldUseMock()) {
      return mockInboxService.deleteMessage(messageId);
    }
    
    try {
      await api.delete(`/inbox/${messageId}`);
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockInboxService.deleteMessage(messageId);
    }
  },
  getUnreadCount: async (userId: string): Promise<number> => {
    if (shouldUseMock()) {
      return mockInboxService.getUnreadCount(userId);
    }
    try {
      const response = await api.get<{ count: number }>(`/inbox/${userId}/unread-count`);
      return response.data.count;
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockInboxService.getUnreadCount(userId);
    }
  },

  // Admin methods for sending notifications
  sendNotificationToAllEmployees: async (title: string, message: string, type: InboxMessage['type'] = 'info'): Promise<void> => {
    if (shouldUseMock()) {
      return mockInboxService.sendNotificationToAllEmployees(title, message, type);
    }
    
    try {
      await api.post('/inbox/send-to-all-employees', { title, message, type });
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockInboxService.sendNotificationToAllEmployees(title, message, type);
    }
  },

  sendNotificationToEmployee: async (employeeId: string, title: string, message: string, type: InboxMessage['type'] = 'info'): Promise<void> => {
    if (shouldUseMock()) {
      return mockInboxService.sendNotificationToEmployee(employeeId, title, message, type);
    }
    
    try {
      await api.post(`/inbox/send-to-employee/${employeeId}`, { title, message, type });
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockInboxService.sendNotificationToEmployee(employeeId, title, message, type);
    }
  },
};

export const paymentService = {  processPayment: async (orderId: string, paymentMethod: string): Promise<{ success: boolean; transactionId: string }> => {
    const response = await api.post<{ success: boolean; transactionId: string }>('/payment', {
      orderId,
      paymentMethod,
    });
    return response.data;
  },
};
