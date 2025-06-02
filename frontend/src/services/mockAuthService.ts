// Mock authentication service for frontend testing
import { LoginRequest, LoginResponse, User } from '../types/auth';

// Mock users for testing
const MOCK_USERS = {
  'employee@test.com': {
    id: '1',
    email: 'employee@test.com',
    name: 'John Employee',
    role: 'employee' as const,
    phone: '+1234567890',
    createdAt: '2024-01-01T00:00:00Z'
  },
  'admin@test.com': {
    id: '2',
    email: 'admin@test.com',
    name: 'Jane Admin',
    role: 'admin' as const,
    phone: '+1234567891',
    createdAt: '2024-01-01T00:00:00Z'
  }
};

const MOCK_PASSWORD = 'password123';

export const mockAuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS[credentials.email as keyof typeof MOCK_USERS];
    
    if (!user || credentials.password !== MOCK_PASSWORD) {
      throw new Error('Invalid credentials');
    }
    
    return {
      user,
      token: `mock-token-${user.id}-${Date.now()}`,
      refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`
    };
  },

  logout: async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('auth');
  },

  // getCurrentUser: async (): Promise<User> => {
  //   // Simulate API delay
  //   await new Promise(resolve => setTimeout(resolve, 500));
    
  //   const authData = localStorage.getItem('auth');
  //   if (!authData) {
  //     throw new Error('Not authenticated');
  //   }
    
  //   const { user } = JSON.parse(authData);
  //   return user;
  // },

  // refreshToken: async (): Promise<LoginResponse> => {
  //   // Simulate API delay
  //   await new Promise(resolve => setTimeout(resolve, 500));
    
  //   const authData = localStorage.getItem('auth');
  //   if (!authData) {
  //     throw new Error('Not authenticated');
  //   }
    
  //   const { user } = JSON.parse(authData);
  //   return {
  //     user,
  //     token: `mock-token-${user.id}-${Date.now()}`,
  //     refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`
  //   };
  // },
};
