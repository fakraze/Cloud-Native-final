export interface Rating {
  id: string;
  userId: string;
  restaurantId: string;
  orderId: string;
  tasteRating: number;
  valueRating: number;
  overallRating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateRatingRequest {
  orderId: string;
  restaurantId: string;
  tasteRating: number;
  valueRating: number;
  comment?: string;
}
