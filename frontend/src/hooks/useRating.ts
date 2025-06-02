import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingService } from '../services/otherServices';
import { CreateRatingRequest } from '../types/rating';

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
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: ['ratings', restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId] });
    },
  });
};
