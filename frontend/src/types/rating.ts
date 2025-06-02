// Base rating interface
export interface BaseRating {
  id: string;
  userId: string;
  orderId: string;
  createdAt: string;
}

// Restaurant rating - contains taste, value (cost-performance), and text
export interface RestaurantRating extends BaseRating {
  type: 'restaurant';
  restaurantId: string;
  tasteRating: number;
  valueRating: number; // Cost-performance value
  overallRating: number;
  comment?: string;
}

// Dish rating - only contains 1-5 value
export interface DishRating extends BaseRating {
  type: 'dish';
  dishId: string;
  restaurantId: string;
  rating: number; // 1-5 simple rating
}

// Union type for all ratings
export type Rating = RestaurantRating | DishRating;

export interface CreateRestaurantRatingRequest {
  orderId: string;
  restaurantId: string;
  tasteRating: number;
  valueRating: number;
  comment?: string;
}

export interface CreateDishRatingRequest {
  orderId: string;
  dishId: string;
  restaurantId: string;
  rating: number;
}

// Legacy interface for backward compatibility
export interface CreateRatingRequest extends CreateRestaurantRatingRequest {}
