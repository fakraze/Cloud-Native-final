// Mock authentication service for frontend testing
import { LoginRequest, LoginResponse} from '../types/auth';

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
  },
  'staff@test.com': {
    id: '3',
    email: 'staff@test.com',
    name: 'Mike Staff',
    role: 'staff' as const,
    phone: '+1234567892',
    createdAt: '2024-01-01T00:00:00Z'
  },
  'employee2@test.com': {
    id: '4',
    email: 'employee2@test.com',
    name: 'Alice Smith',
    role: 'employee' as const,
    phone: '+1234567893',
    createdAt: '2024-01-02T00:00:00Z'
  },
  'employee3@test.com': {
    id: '5',
    email: 'employee3@test.com',
    name: 'Bob Johnson',
    role: 'employee' as const,
    phone: '+1234567894',
    createdAt: '2024-01-03T00:00:00Z'
  },
  'employee4@test.com': {
    id: '6',
    email: 'employee4@test.com',
    name: 'Carol Davis',
    role: 'employee' as const,
    phone: '+1234567895',
    createdAt: '2024-01-04T00:00:00Z'
  }
};

// Get all employees function
export const getAllEmployees = () => {
  return Object.values(MOCK_USERS).filter(user => user.role === 'employee');
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
