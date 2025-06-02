import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '../services/restaurantService';
import { Restaurant, MenuItem } from '../types/restaurant';

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantService.getRestaurants(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRestaurant = (id: string) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantService.getRestaurant(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useMenu = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => restaurantService.getMenu(restaurantId),
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMenuItem = (restaurantId: string, menuItemId: string) => {
  return useQuery({
    queryKey: ['menuItem', restaurantId, menuItemId],
    queryFn: () => restaurantService.getMenuItem(restaurantId, menuItemId),
    enabled: !!(restaurantId && menuItemId),
    staleTime: 5 * 60 * 1000,
  });
};

// Admin hooks
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (restaurant: Omit<Restaurant, 'id'>) =>
      restaurantService.createRestaurant(restaurant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Restaurant> }) =>
      restaurantService.updateRestaurant(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
    },
  });
};

export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restaurantService.deleteRestaurant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      menuItem,
    }: {
      restaurantId: string;
      menuItem: Omit<MenuItem, 'id' | 'restaurantId'>;
    }) => restaurantService.createMenuItem(restaurantId, menuItem),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      menuItemId,
      data,
    }: {
      restaurantId: string;
      menuItemId: string;
      data: Partial<MenuItem>;
    }) => restaurantService.updateMenuItem(restaurantId, menuItemId, data),
    onSuccess: (_, { restaurantId, menuItemId }) => {
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['menuItem', restaurantId, menuItemId] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, menuItemId }: { restaurantId: string; menuItemId: string }) =>
      restaurantService.deleteMenuItem(restaurantId, menuItemId),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
    },
  });
};
