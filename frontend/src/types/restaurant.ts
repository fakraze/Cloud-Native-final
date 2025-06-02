export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  rating: number;
  isActive: boolean;
  cuisine?: string;
  address?: string;
  phone?: string;
  email?: string;
  totalRatings?: number;
  deliveryTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MenuCategory = string;

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  image?: string; // Alternative image field for compatibility
  category: string;
  isAvailable: boolean;
  preparationTime?: number;
  allergens?: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  customizations?: MenuItemCustomization[];
}

export interface MenuItemCustomization {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'text';
  options?: string[];
  required: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: Record<string, string | string[]>;
  notes?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  restaurantId: string;
  totalAmount: number;
}
