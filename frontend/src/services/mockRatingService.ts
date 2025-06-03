import { RestaurantRating, DishRating, CreateRestaurantRatingRequest, CreateDishRatingRequest } from '../types/rating';

// Mock restaurant rating data
const mockRestaurantRatings: Record<string, RestaurantRating[]> = {
  '1': [
    {
      id: '1',
      type: 'restaurant',
      userId: 'user1',
      restaurantId: '1',
      orderId: 'order1',
      tasteRating: 5,
      valueRating: 4,
      overallRating: 4.5,
      comment: 'Amazing pizza! The crust was perfectly crispy and the toppings were fresh. Definitely ordering again!',
      createdAt: '2024-12-01T10:30:00Z',
    },
    {
      id: '2',
      type: 'restaurant',
      userId: 'user2',
      restaurantId: '1',
      orderId: 'order2',
      tasteRating: 4,
      valueRating: 5,
      overallRating: 4.5,
      comment: 'Great value for money. The pasta was delicious and the portion size was generous.',
      createdAt: '2024-12-02T14:15:00Z',
    },
    {
      id: '3',
      type: 'restaurant',
      userId: 'user3',
      restaurantId: '1',
      orderId: 'order3',
      tasteRating: 5,
      valueRating: 3,
      overallRating: 4,
      comment: 'Excellent taste but a bit pricey. The service was quick and food was hot.',
      createdAt: '2024-12-03T18:45:00Z',
    },
    {
      id: '4',
      type: 'restaurant',
      userId: 'user4',
      restaurantId: '1',
      orderId: 'order4',
      tasteRating: 3,
      valueRating: 4,
      overallRating: 3.5,
      comment: 'Good food overall. The salad was fresh but the main course could use more seasoning.',
      createdAt: '2024-12-04T12:20:00Z',
    },
    {
      id: '5',
      type: 'restaurant',
      userId: 'user5',
      restaurantId: '1',
      orderId: 'order5',
      tasteRating: 5,
      valueRating: 5,
      overallRating: 5,
      comment: 'Outstanding! Best Italian restaurant in town. Every dish was perfect and the delivery was super fast.',
      createdAt: '2024-12-05T19:30:00Z',
    },
    {
      id: '6',
      type: 'restaurant',
      userId: 'user6',
      restaurantId: '1',
      orderId: 'order6',
      tasteRating: 2,
      valueRating: 3,
      overallRating: 2.5,
      comment: 'Not impressed. The food was cold when it arrived and took too long.',
      createdAt: '2024-12-06T15:10:00Z',
    },
    {
      id: '7',
      type: 'restaurant',
      userId: 'user7',
      restaurantId: '1',
      orderId: 'order7',
      tasteRating: 4,
      valueRating: 4,
      overallRating: 4,
      comment: 'Solid choice for Italian food. The atmosphere was nice and staff was friendly.',
      createdAt: '2024-12-07T20:00:00Z',
    },
    {
      id: '8',
      type: 'restaurant',
      userId: 'user8',
      restaurantId: '1',
      orderId: 'order8',
      tasteRating: 5,
      valueRating: 2,
      overallRating: 3.5,
      comment: 'Incredible taste and quality but very expensive. Special occasion only.',
      createdAt: '2024-12-08T13:30:00Z',
    },
  ],
  '2': [
    {
      id: '9',
      type: 'restaurant',
      userId: 'user9',
      restaurantId: '2',
      orderId: 'order9',
      tasteRating: 4,
      valueRating: 4,
      overallRating: 4,
      comment: 'Delicious burgers! The meat was juicy and the fries were crispy. Great fast food option.',
      createdAt: '2024-12-01T16:00:00Z',
    },
    {
      id: '10',
      type: 'restaurant',
      userId: 'user10',
      restaurantId: '2',
      orderId: 'order10',
      tasteRating: 5,
      valueRating: 3,
      overallRating: 4,
      comment: 'Amazing taste but quite expensive for a burger place. Worth it for special occasions.',
      createdAt: '2024-12-02T20:30:00Z',
    },
  ],
  '3': [
    {
      id: '11',
      type: 'restaurant',
      userId: 'user11',
      restaurantId: '3',
      orderId: 'order11',
      tasteRating: 5,
      valueRating: 5,
      overallRating: 5,
      comment: 'Authentic sushi! Fresh fish and perfectly seasoned rice. The presentation was beautiful too.',
      createdAt: '2024-12-01T13:45:00Z',
    },
  ],
};

// Mock dish rating data
const mockDishRatings: Record<string, DishRating[]> = {
  '1': [ // Margherita Pizza
    {
      id: 'dish_rating_1',
      type: 'dish',
      userId: 'user1',
      dishId: '1',
      restaurantId: '1',
      orderId: 'order1',
      rating: 5,
      createdAt: '2024-12-01T10:30:00Z',
    },
    {
      id: 'dish_rating_2',
      type: 'dish',
      userId: 'user2',
      dishId: '1',
      restaurantId: '1',
      orderId: 'order2',
      rating: 4,
      createdAt: '2024-12-02T14:15:00Z',
    },
    {
      id: 'dish_rating_3',
      type: 'dish',
      userId: 'user3',
      dishId: '1',
      restaurantId: '1',
      orderId: 'order3',
      rating: 5,
      createdAt: '2024-12-03T18:45:00Z',
    },
  ],
  '2': [ // Pepperoni Pizza
    {
      id: 'dish_rating_4',
      type: 'dish',
      userId: 'user4',
      dishId: '2',
      restaurantId: '1',
      orderId: 'order4',
      rating: 4,
      createdAt: '2024-12-04T12:20:00Z',
    },
    {
      id: 'dish_rating_5',
      type: 'dish',
      userId: 'user5',
      dishId: '2',
      restaurantId: '1',
      orderId: 'order5',
      rating: 5,
      createdAt: '2024-12-05T19:30:00Z',
    },
    {
      id: 'dish_rating_11',
      type: 'dish',
      userId: 'user11',
      dishId: '2',
      restaurantId: '1',
      orderId: 'order11',
      rating: 3,
      createdAt: '2024-12-09T14:20:00Z',
    },
  ],
  '3': [ // Classic Cheeseburger
    {
      id: 'dish_rating_6',
      type: 'dish',
      userId: 'user6',
      dishId: '3',
      restaurantId: '2',
      orderId: 'order6',
      rating: 4,
      createdAt: '2024-12-06T15:10:00Z',
    },
    {
      id: 'dish_rating_7',
      type: 'dish',
      userId: 'user7',
      dishId: '3',
      restaurantId: '2',
      orderId: 'order7',
      rating: 5,
      createdAt: '2024-12-07T20:00:00Z',
    },
  ],
  '4': [ // Crispy Fries
    {
      id: 'dish_rating_8',
      type: 'dish',
      userId: 'user8',
      dishId: '4',
      restaurantId: '2',
      orderId: 'order8',
      rating: 3,
      createdAt: '2024-12-08T13:30:00Z',
    },
  ],
  '5': [ // Salmon Sashimi
    {
      id: 'dish_rating_9',
      type: 'dish',
      userId: 'user9',
      dishId: '5',
      restaurantId: '3',
      orderId: 'order9',
      rating: 5,
      createdAt: '2024-12-01T16:00:00Z',
    },
    {
      id: 'dish_rating_10',
      type: 'dish',
      userId: 'user10',
      dishId: '5',
      restaurantId: '3',
      orderId: 'order10',
      rating: 4,
      createdAt: '2024-12-02T20:30:00Z',
    },
  ],
};

export const mockRatingService = {
  getRestaurantRatings: async (restaurantId: string): Promise<RestaurantRating[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockRestaurantRatings[restaurantId] || [];
  },

  getDishRatings: async (dishId: string): Promise<DishRating[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockDishRatings[dishId] || [];
  },

  getDishAverageRating: async (dishId: string): Promise<{ rating: number; count: number }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const ratings = mockDishRatings[dishId] || [];
    if (ratings.length === 0) {
      return { rating: 0, count: 0 };
    }
    
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const average = sum / ratings.length;
    
    return { rating: Math.round(average * 10) / 10, count: ratings.length };
  },

  createDishRating: async (ratingData: CreateDishRatingRequest): Promise<DishRating> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newRating: DishRating = {
      id: `dish_rating_${Date.now()}`,
      type: 'dish',
      userId: 'current_user',
      dishId: ratingData.dishId,
      restaurantId: ratingData.restaurantId,
      orderId: ratingData.orderId,
      rating: ratingData.rating,
      createdAt: new Date().toISOString(),
    };

    // Add to mock data
    if (!mockDishRatings[ratingData.dishId]) {
      mockDishRatings[ratingData.dishId] = [];
    }
    mockDishRatings[ratingData.dishId].push(newRating);

    return newRating;
  },

  createRestaurantRating: async (ratingData: CreateRestaurantRatingRequest): Promise<RestaurantRating> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newRating: RestaurantRating = {
      id: `rating_${Date.now()}`,
      type: 'restaurant',
      userId: 'current_user',
      restaurantId: ratingData.restaurantId,
      orderId: ratingData.orderId,
      tasteRating: ratingData.tasteRating,
      valueRating: ratingData.valueRating,
      overallRating: (ratingData.tasteRating + ratingData.valueRating) / 2,
      comment: ratingData.comment,
      createdAt: new Date().toISOString(),
    };

    // Add to mock data
    if (!mockRestaurantRatings[ratingData.restaurantId]) {
      mockRestaurantRatings[ratingData.restaurantId] = [];
    }
    mockRestaurantRatings[ratingData.restaurantId].push(newRating);

    return newRating;
  },

  // Legacy methods for backward compatibility
  getRatings: async (restaurantId: string): Promise<RestaurantRating[]> => {
    return mockRatingService.getRestaurantRatings(restaurantId);
  },

  createRating: async (ratingData: CreateRestaurantRatingRequest): Promise<RestaurantRating> => {
    return mockRatingService.createRestaurantRating(ratingData);
  },

  updateRating: async (ratingId: string, ratingData: Partial<CreateRestaurantRatingRequest>): Promise<RestaurantRating> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find and update the rating
    for (const restaurantId in mockRestaurantRatings) {
      const ratings = mockRestaurantRatings[restaurantId];
      const ratingIndex = ratings.findIndex(r => r.id === ratingId);
      
      if (ratingIndex !== -1) {
        const existingRating = ratings[ratingIndex];
        const updatedRating: RestaurantRating = {
          ...existingRating,
          tasteRating: ratingData.tasteRating ?? existingRating.tasteRating,
          valueRating: ratingData.valueRating ?? existingRating.valueRating,
          comment: ratingData.comment ?? existingRating.comment,
        };
        
        // Recalculate overall rating
        updatedRating.overallRating = (updatedRating.tasteRating + updatedRating.valueRating) / 2;
        
        ratings[ratingIndex] = updatedRating;
        return updatedRating;
      }
    }
    
    throw new Error('Rating not found');
  },

  deleteRating: async (ratingId: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find and delete the rating
    for (const restaurantId in mockRestaurantRatings) {
      const ratings = mockRestaurantRatings[restaurantId];
      const ratingIndex = ratings.findIndex(r => r.id === ratingId);
      
      if (ratingIndex !== -1) {
        ratings.splice(ratingIndex, 1);
        return;
      }
    }
    
    throw new Error('Rating not found');
  },
};
