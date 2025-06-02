import api from './api';
import { Rating, CreateRatingRequest } from '../types/rating';
import { InboxMessage } from '../types/common';
import { ApiResponse } from '../types/common';

export const ratingService = {
  getRatings: async (restaurantId: string): Promise<Rating[]> => {
    const response = await api.get<ApiResponse<Rating[]>>(`/rating/${restaurantId}`);
    return response.data.data;
  },

  createRating: async (ratingData: CreateRatingRequest): Promise<Rating> => {
    const response = await api.post<ApiResponse<Rating>>('/rating', ratingData);
    return response.data.data;
  },

  updateRating: async (ratingId: string, ratingData: Partial<CreateRatingRequest>): Promise<Rating> => {
    const response = await api.put<ApiResponse<Rating>>(`/rating/${ratingId}`, ratingData);
    return response.data.data;
  },

  deleteRating: async (ratingId: string): Promise<void> => {
    await api.delete(`/rating/${ratingId}`);
  },
};

export const inboxService = {
  getMessages: async (userId: string): Promise<InboxMessage[]> => {
    const response = await api.get<ApiResponse<InboxMessage[]>>(`/inbox/${userId}`);
    return response.data.data;
  },

  markAsRead: async (messageId: string): Promise<InboxMessage> => {
    const response = await api.put<ApiResponse<InboxMessage>>(`/inbox/${messageId}/read`);
    return response.data.data;
  },
};

export const paymentService = {
  processPayment: async (orderId: string, paymentMethod: string): Promise<{ success: boolean; transactionId: string }> => {
    const response = await api.post<ApiResponse<{ success: boolean; transactionId: string }>>('/payment', {
      orderId,
      paymentMethod,
    });
    return response.data.data;
  },
};
