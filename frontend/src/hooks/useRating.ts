import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingService, dishRatingService } from '../services/otherServices';
import { CreateRatingRequest, CreateDishRatingRequest } from '../types/rating';

export const useRatings = (restaurantId: string) => {
  return useQuery({
    queryKey: ['ratings', restaurantId],
    queryFn: () => ratingService.getRatings(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRatingRequest) => ratingService.createRating(data),
    onSuccess: (data) => {
      // Invalidate ratings for the restaurant
      queryClient.invalidateQueries({ queryKey: ['ratings', data.restaurantId] });
      // Also invalidate the restaurant query to update average rating
      queryClient.invalidateQueries({ queryKey: ['restaurant', data.restaurantId] });
    },
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ratingId, data }: { ratingId: string; data: Partial<CreateRatingRequest> }) =>
      ratingService.updateRating(ratingId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ratings', data.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', data.restaurantId] });
    },
  });
};

export const useDeleteRating = () => {  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ratingId }: { ratingId: string; restaurantId: string }) =>
      ratingService.deleteRating(ratingId),
    onSuccess: (_, { restaurantId }) => {      queryClient.invalidateQueries({ queryKey: ['ratings', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId] });
    },
  });
};

// Dish rating hooks
export const useDishRatings = (dishId: string) => {
  return useQuery({
    queryKey: ['dishRatings', dishId],
    queryFn: () => dishRatingService.getDishRatings(dishId),
    enabled: !!dishId,
  });
};

export const useDishAverageRating = (dishId: string) => {
  return useQuery({
    queryKey: ['dishAverageRating', dishId],
    queryFn: () => dishRatingService.getDishAverageRating(dishId),
    enabled: !!dishId,
  });
};

export const useCreateDishRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDishRatingRequest) => dishRatingService.createDishRating(data),
    onSuccess: (data) => {
      // Invalidate dish ratings
      queryClient.invalidateQueries({ queryKey: ['dishRatings', data.dishId] });
      queryClient.invalidateQueries({ queryKey: ['dishAverageRating', data.dishId] });
      // Also invalidate restaurant ratings as dish ratings might affect overall ratings
      queryClient.invalidateQueries({ queryKey: ['ratings', data.restaurantId] });
    },
  });
};
