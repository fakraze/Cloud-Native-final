// Development configuration for API services
export const isDevelopment = import.meta.env.VITE_NODE_ENV === 'development';
export const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

// API endpoints
export const API_ENDPOINTS = {
  REAL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  MOCK: 'mock://api'
};

export const shouldUseMockApi = () => {
  return isDevelopment && (useMockApi || !navigator.onLine);
};
