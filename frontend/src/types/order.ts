export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'delivered';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  orderDate: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  notes?: string;
  deliveryType?: 'pickup' | 'dine-in';
  deliveryAddress?: string;
  paymentMethod?: string;
  updatedAt?: string;
  createdAt?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'delivered';

export interface OrderItem {
  id?: string;
  menuItemId: string;
  menuItemName?: string;
  name?: string; // Alternative name field for compatibility
  quantity: number;
  price: number;
  customizations?: Record<string, string | string[]>;
  specialInstructions?: string;
  notes?: string;
}

export interface CreateOrderRequest {
  restaurantId: string;
  restaurantName?: string;
  userId?: string;
  items: OrderItem[];
  totalAmount?: number;
  deliveryAddress?: string;
  paymentMethod?: string;
  notes?: string;
  deliveryType?: 'pickup' | 'dine-in';
}
