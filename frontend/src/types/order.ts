import { MenuItem, Restaurant } from "./restaurant";

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurant?: Restaurant;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'delivered';
  paymentStatus?: 'pending' | 'paid' | 'unpaid';
  notes?: string;
  deliveryType: 'pickup' | 'dine-in';
  updatedAt?: string;
  createdAt?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'delivered';

export interface OrderItem {
  id?: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  price: number;
  customizations?: Record<string, string | string[]>;
  notes?: string;
}

export interface CreateOrderRequest {
  restaurantId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
  deliveryType: 'pickup' | 'dine-in';
}
