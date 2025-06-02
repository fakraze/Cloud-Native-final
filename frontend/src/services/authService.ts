import api from './api';
import { LoginRequest, LoginResponse} from '../types/auth';
import { ApiResponse } from '../types/common';
import { mockAuthService } from './mockAuthService';

// Check if we should use mock API (for development without backend)
const shouldUseMock = () => {
  const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';
  const isDev = import.meta.env.VITE_NODE_ENV === 'development';
  return isDev && useMock;
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (shouldUseMock()) {
      return mockAuthService.login(credentials);
    }
    
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, falling back to mock data for development');
      return mockAuthService.login(credentials);
    }
  },

  logout: async (): Promise<void> => {
    if (shouldUseMock()) {
      return mockAuthService.logout();
    }
    
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('auth');
    } catch (error) {
      console.warn('API call failed, falling back to mock logout');
      await mockAuthService.logout();
    }
  },

  // getCurrentUser: async (): Promise<User> => {
  //   if (shouldUseMock()) {
  //     return mockAuthService.getCurrentUser();
  //   }
    
  //   try {
  //     const response = await api.get<ApiResponse<User>>('/auth/me');
  //     return response.data.data;
  //   } catch (error) {
  //     console.warn('API call failed, falling back to mock user data');
  //     return mockAuthService.getCurrentUser();
  //   }
  // },

  // refreshToken: async (): Promise<LoginResponse> => {
  //   if (shouldUseMock()) {
  //     return mockAuthService.refreshToken();
  //   }
    
  //   try {
  //     const response = await api.post<ApiResponse<LoginResponse>>('/auth/refresh');
  //     return response.data.data;
  //   } catch (error) {
  //     console.warn('API call failed, falling back to mock refresh');
  //     return mockAuthService.refreshToken();
  //   }
  // },
};
