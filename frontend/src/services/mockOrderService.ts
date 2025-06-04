// Mock order service for frontend testing
import { Order, OrderStatus, CreateOrderRequest } from '../types/order';

// Mock orders data with recent dates
const MOCK_ORDERS: any[] = [
  {
    id: '1',
    userId: '1',
    restaurantId: '1',
    restaurantName: 'Pizza Palace',
    items: [
      {
        id: '1',
        menuItemId: '1',
        menuItemName: 'Margherita Pizza',
        price: 18.99,
        quantity: 2,
        notes: 'Extra basil please'
      }
    ],
    totalAmount: 37.98,
    status: 'preparing' as OrderStatus,
    paymentStatus: 'paid',
    orderDate: '2025-06-03T18:30:00Z',
    estimatedDeliveryTime: '2025-06-03T19:05:00Z',
    deliveryType: 'pickup',
    deliveryAddress: '789 User St, City',
    paymentMethod: 'credit_card',
    notes: 'Please ring doorbell',
    createdAt: '2025-06-03T18:30:00Z',
    updatedAt: '2025-06-03T18:45:00Z'
  },
  {
    id: '2',
    userId: '2',
    restaurantId: '2',
    restaurantName: 'Burger Barn',
    items: [
      {
        id: '2',
        menuItemId: '3',
        menuItemName: 'Classic Cheeseburger',
        price: 14.99,
        quantity: 1,
        notes: ''
      },
      {
        id: '3',
        menuItemId: '4',
        menuItemName: 'Crispy Fries',
        price: 6.99,
        quantity: 1,
        notes: ''
      }
    ],
    totalAmount: 21.98,
    status: 'pending' as OrderStatus,
    paymentStatus: 'pending',
    orderDate: '2025-06-03T12:15:00Z',
    estimatedDeliveryTime: '2025-06-03T12:45:00Z',
    deliveryType: 'pickup',
    deliveryAddress: '789 User St, City',
    paymentMethod: 'credit_card',
    notes: '',
    createdAt: '2025-06-03T12:15:00Z',
    updatedAt: '2025-06-03T12:20:00Z'
  },
  {
    id: '3',
    userId: '3',
    restaurantId: '3',
    restaurantName: 'Sushi Zen',
    items: [
      {
        id: '4',
        menuItemId: '5',
        menuItemName: 'Salmon Sashimi',
        price: 24.99,
        quantity: 1,
        notes: 'Fresh wasabi on the side'
      }
    ],
    totalAmount: 24.99,
    status: 'confirmed' as OrderStatus,
    paymentStatus: 'paid',
    orderDate: '2025-06-03T08:00:00Z',
    estimatedDeliveryTime: '2025-06-03T08:40:00Z',
    deliveryType: 'dine-in',
    deliveryAddress: '789 User St, City',
    paymentMethod: 'credit_card',
    notes: 'Call when arrived',
    createdAt: '2025-06-03T08:00:00Z',
    updatedAt: '2025-06-03T08:05:00Z'
  },
  {
    id: '4',
    userId: '1',
    restaurantId: '1',
    restaurantName: 'Pizza Palace',
    items: [
      {
        id: '5',
        menuItemId: '2',
        menuItemName: 'Pepperoni Pizza',
        price: 21.99,
        quantity: 1,
        notes: 'Extra cheese'
      }
    ],
    totalAmount: 21.99,
    status: 'ready' as OrderStatus,
    paymentStatus: 'paid',
    orderDate: '2025-06-02T19:30:00Z',
    estimatedDeliveryTime: '2025-06-02T20:05:00Z',
    actualDeliveryTime: '2025-06-02T20:00:00Z',
    deliveryType: 'pickup',
    deliveryAddress: '789 User St, City',
    paymentMethod: 'debit_card',
    notes: '',
    createdAt: '2025-06-02T19:30:00Z',
    updatedAt: '2025-06-02T20:00:00Z'
  },
  {
    id: '5',
    userId: '2',
    restaurantId: '2',
    restaurantName: 'Burger Barn',
    items: [
      {
        id: '6',
        menuItemId: '6',
        menuItemName: 'Veggie Burger',
        price: 13.99,
        quantity: 1,
        notes: 'No mayo'
      }
    ],
    totalAmount: 13.99,
    status: 'completed' as OrderStatus,
    paymentStatus: 'paid',
    orderDate: '2025-06-01T16:20:00Z',
    estimatedDeliveryTime: '2025-06-01T16:50:00Z',
    actualDeliveryTime: '2025-06-01T16:45:00Z',
    deliveryType: 'pickup',
    deliveryAddress: '456 Customer Ave, City',
    paymentMethod: 'credit_card',
    notes: 'Leave at door',
    createdAt: '2025-06-01T16:20:00Z',
    updatedAt: '2025-06-01T16:45:00Z'
  },
  {
    id: '6',
    userId: '3',
    restaurantId: '3',
    restaurantName: 'Sushi Zen',
    items: [
      {
        id: '7',
        menuItemId: '7',
        menuItemName: 'California Roll',
        price: 12.99,
        quantity: 2,
        notes: ''
      }
    ],
    totalAmount: 25.98,
    status: 'cancelled' as OrderStatus,
    paymentStatus: 'failed',
    orderDate: '2025-05-31T14:10:00Z',
    estimatedDeliveryTime: '2025-05-31T14:40:00Z',
    deliveryType: 'pickup',
    deliveryAddress: '123 Main St, City',
    paymentMethod: 'credit_card',
    notes: 'Customer requested cancellation',
    createdAt: '2025-05-31T14:10:00Z',
    updatedAt: '2025-05-31T14:15:00Z'
  }
];

export const mockOrderService = {
  getOrders: async (params?: any): Promise<{ orders: Order[]; total: number }> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    let filteredOrders = [...MOCK_ORDERS];
    
    // Filter by status if provided
    if (params?.status && params.status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === params.status);
    }
    
    // Filter by user if provided
    if (params?.userId) {
      filteredOrders = filteredOrders.filter(order => order.userId === params.userId);
    }
    
    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    
    return {
      orders: filteredOrders,
      total: filteredOrders.length
    };
  },

  getOrder: async (id: string): Promise<Order> => {
    return mockOrderService.getOrderById(id);
  },

  getOrderById: async (id: string): Promise<Order> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const order = MOCK_ORDERS.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  },
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate IDs for items if they don't have them
    const itemsWithIds = orderData.items.map((item, index) => ({
      ...item,
      id: item.id || (Date.now() + index).toString(),
      customizations: item.customizations || {}
    }));
    
    const newOrder: any = {
      id: Date.now().toString(),
      userId: orderData.userId || '1', // Default to current user
      restaurantId: orderData.restaurantId,
      //restaurantName: orderData.restaurantName || 'Unknown Restaurant',
      items: itemsWithIds,      totalAmount: orderData.totalAmount || 0,
      status: 'pending' as OrderStatus,
      paymentStatus: 'pending', // Default to pending payment for employee orders
      orderDate: new Date().toISOString(),
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
      //deliveryAddress: orderData.deliveryAddress,
      //paymentMethod: orderData.paymentMethod,
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    MOCK_ORDERS.push(newOrder);
    return newOrder;
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const orderIndex = MOCK_ORDERS.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
      MOCK_ORDERS[orderIndex] = {
      ...MOCK_ORDERS[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
      // Set delivery time if delivered
      ...(status === 'delivered' && { actualDeliveryTime: new Date().toISOString() })
    };
    
    return MOCK_ORDERS[orderIndex];
  },

  cancelOrder: async (id: string): Promise<Order> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orderIndex = MOCK_ORDERS.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    if (!['pending', 'confirmed'].includes(MOCK_ORDERS[orderIndex].status)) {
      throw new Error('Cannot cancel order in current status');
    }
    
    MOCK_ORDERS[orderIndex] = {
      ...MOCK_ORDERS[orderIndex],
      status: 'cancelled' as OrderStatus,
      updatedAt: new Date().toISOString()
    };
    
    return MOCK_ORDERS[orderIndex];
  },
  // Get ongoing orders (not completed/cancelled)
  getOngoingOrders: async (userId?: string): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return MOCK_ORDERS.filter(order => 
      (!userId || order.userId === userId) &&
      !['completed', 'cancelled'].includes(order.status)
    );
  },
  // Get order history (all orders for history)
  getOrderHistory: async (userId?: string): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return MOCK_ORDERS.filter(order => 
      (!userId || order.userId === userId)
    ).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  },

  updatePaymentStatus: async (orderId: string, paymentStatus: 'pending' | 'paid' | 'failed', paymentMethod?: string): Promise<Order> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    MOCK_ORDERS[orderIndex] = {
      ...MOCK_ORDERS[orderIndex],
      paymentStatus,
      paymentMethod: paymentMethod || MOCK_ORDERS[orderIndex].paymentMethod,
      updatedAt: new Date().toISOString()
    };
    
    return MOCK_ORDERS[orderIndex];
  },
};
