import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useLogin, useLogout, useRegister } from '../useAuth';
import * as authService from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

// Mock the auth service
vi.mock('../../services/authService');
vi.mock('../../store/authStore');

// Create a wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useAuth hooks', () => {
  const mockSetUser = vi.fn();
  const mockClearUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      setUser: mockSetUser,
      clearUser: mockClearUser,
    });
  });

  describe('useLogin', () => {
    it('should login successfully', async () => {
      const mockLoginResponse = {
        user: { id: '1', email: 'test@example.com', role: 'customer' },
        token: 'mock-token'
      };

      vi.mocked(authService.login).mockResolvedValue(mockLoginResponse);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useLogin(), { wrapper });

      result.current.mutate({
        email: 'test@example.com',
        password: 'password123'
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockSetUser).toHaveBeenCalledWith(mockLoginResponse.user);
    });

    it('should handle login error', async () => {
      const mockError = new Error('Invalid credentials');
      vi.mocked(authService.login).mockRejectedValue(mockError);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useLogin(), { wrapper });

      result.current.mutate({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
      expect(mockSetUser).not.toHaveBeenCalled();
    });

    it('should set loading state during login', async () => {
      vi.mocked(authService.login).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useLogin(), { wrapper });

      result.current.mutate({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('useLogout', () => {
    it('should logout successfully', async () => {
      vi.mocked(authService.logout).mockResolvedValue(undefined);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useLogout(), { wrapper });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(mockClearUser).toHaveBeenCalled();
    });

    it('should handle logout error', async () => {
      const mockError = new Error('Logout failed');
      vi.mocked(authService.logout).mockRejectedValue(mockError);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useLogout(), { wrapper });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
      // clearUser should still be called even if logout fails
      expect(mockClearUser).toHaveBeenCalled();
    });
  });

  describe('useRegister', () => {
    it('should register successfully', async () => {
      const mockRegisterData = {
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser',
        role: 'customer' as const
      };

      const mockRegisterResponse = {
        user: { 
          id: '2', 
          email: 'newuser@example.com', 
          username: 'newuser',
          role: 'customer' 
        },
        token: 'new-mock-token'
      };

      vi.mocked(authService.register).mockResolvedValue(mockRegisterResponse);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useRegister(), { wrapper });

      result.current.mutate(mockRegisterData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(authService.register).toHaveBeenCalledWith(mockRegisterData);
      expect(mockSetUser).toHaveBeenCalledWith(mockRegisterResponse.user);
    });

    it('should handle registration error', async () => {
      const mockError = new Error('User already exists');
      vi.mocked(authService.register).mockRejectedValue(mockError);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useRegister(), { wrapper });

      result.current.mutate({
        email: 'existing@example.com',
        password: 'password123',
        username: 'existing',
        role: 'customer'
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
      expect(mockSetUser).not.toHaveBeenCalled();
    });

    it('should validate email format', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRegister(), { wrapper });

      // This test assumes the hook validates email format
      result.current.mutate({
        email: 'invalid-email',
        password: 'password123',
        username: 'testuser',
        role: 'customer'
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });

    it('should validate password strength', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRegister(), { wrapper });

      // This test assumes the hook validates password strength
      result.current.mutate({
        email: 'test@example.com',
        password: '123', // weak password
        username: 'testuser',
        role: 'customer'
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('Authentication flow integration', () => {
    it('should maintain authentication state across login/logout', async () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'customer' };
      
      vi.mocked(authService.login).mockResolvedValue({
        user: mockUser,
        token: 'mock-token'
      });
      vi.mocked(authService.logout).mockResolvedValue(undefined);

      const wrapper = createWrapper();
      
      // Test login
      const { result: loginResult } = renderHook(() => useLogin(), { wrapper });
      
      loginResult.current.mutate({
        email: 'test@example.com',
        password: 'password123'
      });

      await waitFor(() => {
        expect(loginResult.current.isSuccess).toBe(true);
      });

      expect(mockSetUser).toHaveBeenCalledWith(mockUser);

      // Test logout
      const { result: logoutResult } = renderHook(() => useLogout(), { wrapper });
      
      logoutResult.current.mutate();

      await waitFor(() => {
        expect(logoutResult.current.isSuccess).toBe(true);
      });

      expect(mockClearUser).toHaveBeenCalled();
    });
  });
});
