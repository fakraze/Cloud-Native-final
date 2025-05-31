import api from './api';
import { Restaurant, MenuItem } from '../types/restaurant';
import { ApiResponse } from '../types/common';
import { mockRestaurantService } from './mockRestaurantService';

// Check if we should use mock API
const shouldUseMock = () => {
  const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';
  const isDev = import.meta.env.VITE_NODE_ENV === 'development';
  return isDev && useMock;
};

export const restaurantService = {
  getRestaurants: async (): Promise<Restaurant[]> => {
    if (shouldUseMock()) {
      const result = await mockRestaurantService.getRestaurants();
      return result.restaurants;
    }
    
    try {
      const response = await api.get<ApiResponse<Restaurant[]>>('/restaurant');
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      const result = await mockRestaurantService.getRestaurants();
      return result.restaurants;
    }
  },

  getRestaurant: async (id: string): Promise<Restaurant> => {
    if (shouldUseMock()) {
      return mockRestaurantService.getRestaurantById(id);
    }
    
    try {
      const response = await api.get<ApiResponse<Restaurant>>(`/restaurant/${id}`);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockRestaurantService.getRestaurantById(id);
    }
  },

  getMenu: async (restaurantId: string): Promise<MenuItem[]> => {
    if (shouldUseMock()) {
      return mockRestaurantService.getMenuItems(restaurantId);
    }
    
    try {
      const response = await api.get<ApiResponse<MenuItem[]>>(`/restaurant/${restaurantId}/menu`);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockRestaurantService.getMenuItems(restaurantId);
    }
  },

  getMenuItem: async (restaurantId: string, menuItemId: string): Promise<MenuItem> => {
    if (shouldUseMock()) {
      return mockRestaurantService.getMenuItem(restaurantId, menuItemId);
    }
    
    try {
      const response = await api.get<ApiResponse<MenuItem>>(`/restaurant/${restaurantId}/menu/${menuItemId}`);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data');
      return mockRestaurantService.getMenuItem(restaurantId, menuItemId);
    }
  },

  // Admin endpoints
  createRestaurant: async (restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
    if (shouldUseMock()) {
      return mockRestaurantService.createRestaurant(restaurant);
    }
    
    try {
      const response = await api.post<ApiResponse<Restaurant>>('/restaurant', restaurant);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock operation');
      return mockRestaurantService.createRestaurant(restaurant);
    }
  },

  updateRestaurant: async (id: string, restaurant: Partial<Restaurant>): Promise<Restaurant> => {
    if (shouldUseMock()) {
      return mockRestaurantService.updateRestaurant(id, restaurant);
    }
    
    try {
      const response = await api.put<ApiResponse<Restaurant>>(`/restaurant/${id}`, restaurant);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock operation');
      return mockRestaurantService.updateRestaurant(id, restaurant);
    }
  },

  deleteRestaurant: async (id: string): Promise<void> => {
    if (shouldUseMock()) {
      return mockRestaurantService.deleteRestaurant(id);
    }
    
    try {
      await api.delete(`/restaurant/${id}`);
    } catch (error) {
      console.warn('API call failed, falling back to mock operation');
      return mockRestaurantService.deleteRestaurant(id);
    }
  },

  createMenuItem: async (restaurantId: string, menuItem: Omit<MenuItem, 'id' | 'restaurantId'>): Promise<MenuItem> => {
    // Mock implementation for menu item creation
    if (shouldUseMock()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newItem: MenuItem = {
        ...menuItem,
        id: Date.now().toString(),
        restaurantId
      };
      return newItem;
    }
    
    try {
      const response = await api.post<ApiResponse<MenuItem>>(`/restaurant/${restaurantId}/menu`, menuItem);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, using mock implementation');
      await new Promise(resolve => setTimeout(resolve, 800));
      const newItem: MenuItem = {
        ...menuItem,
        id: Date.now().toString(),
        restaurantId
      };
      return newItem;
    }
  },

  updateMenuItem: async (restaurantId: string, menuItemId: string, menuItem: Partial<MenuItem>): Promise<MenuItem> => {
    // Mock implementation for menu item update
    if (shouldUseMock()) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const existingItem = await mockRestaurantService.getMenuItem(restaurantId, menuItemId);
      return { ...existingItem, ...menuItem };
    }
    
    try {
      const response = await api.put<ApiResponse<MenuItem>>(`/restaurant/${restaurantId}/menu/${menuItemId}`, menuItem);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, using mock implementation');
      await new Promise(resolve => setTimeout(resolve, 600));
      const existingItem = await mockRestaurantService.getMenuItem(restaurantId, menuItemId);
      return { ...existingItem, ...menuItem };
    }
  },

  deleteMenuItem: async (restaurantId: string, menuItemId: string): Promise<void> => {
    // Mock implementation for menu item deletion
    if (shouldUseMock()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    
    try {
      await api.delete(`/restaurant/${restaurantId}/menu/${menuItemId}`);
    } catch (error) {
      console.warn('API call failed, using mock implementation');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  },
};
