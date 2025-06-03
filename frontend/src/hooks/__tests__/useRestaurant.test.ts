import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { 
  useRestaurants, 
  useRestaurant, 
  useCreateRestaurant, 
  useUpdateRestaurant, 
  useDeleteRestaurant 
} from '../useRestaurant';
import * as restaurantService from '../../services/restaurantService';

// Mock the restaurant service
vi.mock('../../services/restaurantService');

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

describe('useRestaurant hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useRestaurants', () => {
    const mockRestaurants = [
      {
        id: '1',
        name: 'Pizza Palace',
        cuisine: 'Italian',
        address: '123 Main St',
        rating: 4.5,
        isOpen: true,
        imageUrl: 'pizza-palace.jpg'
      },
      {
        id: '2',
        name: 'Burger Barn',
        cuisine: 'American',
        address: '456 Oak Ave',
        rating: 4.2,
        isOpen: true,
        imageUrl: 'burger-barn.jpg'
      }
    ];

    it('should fetch restaurants successfully', async () => {
      vi.mocked(restaurantService.getRestaurants).mockResolvedValue(mockRestaurants);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useRestaurants(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockRestaurants);
      expect(restaurantService.getRestaurants).toHaveBeenCalled();
    });

    it('should handle fetch restaurants error', async () => {
      const mockError = new Error('Failed to fetch restaurants');
      vi.mocked(restaurantService.getRestaurants).mockRejectedValue(mockError);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useRestaurants(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });

    it('should show loading state while fetching', async () => {
      vi.mocked(restaurantService.getRestaurants).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockRestaurants), 100))
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useRestaurants(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('useRestaurant', () => {
    const mockRestaurant = {
      id: '1',
      name: 'Pizza Palace',
      cuisine: 'Italian',
      address: '123 Main St',
      rating: 4.5,
      isOpen: true,
      imageUrl: 'pizza-palace.jpg',
      menuItems: [
        {
          id: 'menu-1',
          name: 'Margherita Pizza',
          price: 12.99,
          description: 'Classic margherita pizza',
          category: 'pizza'
        }
      ]
    };

    it('should fetch single restaurant successfully', async () => {
      vi.mocked(restaurantService.getRestaurant).mockResolvedValue(mockRestaurant);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useRestaurant('1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockRestaurant);
      expect(restaurantService.getRestaurant).toHaveBeenCalledWith('1');
    });

    it('should handle fetch single restaurant error', async () => {
      const mockError = new Error('Restaurant not found');
      vi.mocked(restaurantService.getRestaurant).mockRejectedValue(mockError);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useRestaurant('999'), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });

    it('should not fetch when restaurant ID is not provided', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRestaurant(undefined), { wrapper });

      expect(result.current.isIdle).toBe(true);
      expect(restaurantService.getRestaurant).not.toHaveBeenCalled();
    });
  });

  describe('useCreateRestaurant', () => {
    const mockNewRestaurant = {
      name: 'New Restaurant',
      cuisine: 'Mexican',
      address: '789 Pine St',
      imageUrl: 'new-restaurant.jpg'
    };

    const mockCreatedRestaurant = {
      id: '3',
      ...mockNewRestaurant,
      rating: 0,
      isOpen: true
    };

    it('should create restaurant successfully', async () => {
      vi.mocked(restaurantService.createRestaurant).mockResolvedValue(mockCreatedRestaurant);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useCreateRestaurant(), { wrapper });

      result.current.mutate(mockNewRestaurant);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCreatedRestaurant);
      expect(restaurantService.createRestaurant).toHaveBeenCalledWith(mockNewRestaurant);
    });

    it('should handle create restaurant error', async () => {
      const mockError = new Error('Failed to create restaurant');
      vi.mocked(restaurantService.createRestaurant).mockRejectedValue(mockError);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useCreateRestaurant(), { wrapper });

      result.current.mutate(mockNewRestaurant);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('useUpdateRestaurant', () => {
    const mockUpdatedData = {
      name: 'Updated Restaurant Name',
      cuisine: 'Updated Cuisine'
    };

    const mockUpdatedRestaurant = {
      id: '1',
      name: 'Updated Restaurant Name',
      cuisine: 'Updated Cuisine',
      address: '123 Main St',
      rating: 4.5,
      isOpen: true,
      imageUrl: 'updated.jpg'
    };

    it('should update restaurant successfully', async () => {
      vi.mocked(restaurantService.updateRestaurant).mockResolvedValue(mockUpdatedRestaurant);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useUpdateRestaurant(), { wrapper });

      result.current.mutate({
        id: '1',
        updates: mockUpdatedData
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockUpdatedRestaurant);
      expect(restaurantService.updateRestaurant).toHaveBeenCalledWith('1', mockUpdatedData);
    });

    it('should handle update restaurant error', async () => {
      const mockError = new Error('Failed to update restaurant');
      vi.mocked(restaurantService.updateRestaurant).mockRejectedValue(mockError);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useUpdateRestaurant(), { wrapper });

      result.current.mutate({
        id: '1',
        updates: mockUpdatedData
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('useDeleteRestaurant', () => {
    it('should delete restaurant successfully', async () => {
      vi.mocked(restaurantService.deleteRestaurant).mockResolvedValue(undefined);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDeleteRestaurant(), { wrapper });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(restaurantService.deleteRestaurant).toHaveBeenCalledWith('1');
    });

    it('should handle delete restaurant error', async () => {
      const mockError = new Error('Failed to delete restaurant');
      vi.mocked(restaurantService.deleteRestaurant).mockRejectedValue(mockError);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDeleteRestaurant(), { wrapper });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('Query invalidation and caching', () => {
    it('should invalidate restaurants list after creating restaurant', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      vi.mocked(restaurantService.createRestaurant).mockResolvedValue({
        id: '3',
        name: 'New Restaurant',
        cuisine: 'Mexican',
        address: '789 Pine St',
        rating: 0,
        isOpen: true,
        imageUrl: 'new.jpg'
      });

      const { result } = renderHook(() => useCreateRestaurant(), { wrapper });

      result.current.mutate({
        name: 'New Restaurant',
        cuisine: 'Mexican',
        address: '789 Pine St',
        imageUrl: 'new.jpg'
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check if invalidateQueries was called (assuming it's implemented in the hook)
      expect(invalidateQueriesSpy).toHaveBeenCalled();
    });
  });
});
