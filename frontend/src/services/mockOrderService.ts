// Mock order service for frontend testing
import { Order, OrderStatus, CreateOrderRequest } from '../types/order';

// Mock orders data
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    userId: '1',
    restaurantId: '1',
    restaurantName: 'Pizza Palace',
    items: [
      {
        menuItemId: '1',
        name: 'Margherita Pizza',
        price: 18.99,
        quantity: 2,
        specialInstructions: 'Extra basil please'
      }
    ],
    totalAmount: 37.98,
    status: 'delivered' as OrderStatus,
    orderDate: '2024-03-20T18:30:00Z',
    estimatedDeliveryTime: '2024-03-20T19:05:00Z',
    actualDeliveryTime: '2024-03-20T19:02:00Z',
    deliveryAddress: '789 User St, City',
    paymentMethod: 'credit_card',
    notes: 'Please ring doorbell',
    createdAt: '2024-03-20T18:30:00Z',
    updatedAt: '2024-03-20T19:02:00Z'
  },
  {
    id: '2',
    userId: '1',
    restaurantId: '2',
    restaurantName: 'Burger Barn',
    items: [
      {
        menuItemId: '3',
        name: 'Classic Cheeseburger',
        price: 14.99,
        quantity: 1,
        specialInstructions: ''
      },
      {
        menuItemId: '4',
        name: 'Crispy Fries',
        price: 6.99,
        quantity: 1,
        specialInstructions: ''
      }
    ],
    totalAmount: 21.98,
    status: 'preparing' as OrderStatus,
    orderDate: '2024-03-22T12:15:00Z',
    estimatedDeliveryTime: '2024-03-22T12:45:00Z',
    deliveryAddress: '789 User St, City',
    paymentMethod: 'credit_card',
    notes: '',
    createdAt: '2024-03-22T12:15:00Z',
    updatedAt: '2024-03-22T12:20:00Z'
  },
  {
    id: '3',
    userId: '1',
    restaurantId: '3',
    restaurantName: 'Sushi Zen',
    items: [
      {
        menuItemId: '5',
        name: 'Salmon Sashimi',
        price: 24.99,
        quantity: 1,
        specialInstructions: 'Fresh wasabi on the side'
      }
    ],
    totalAmount: 24.99,
    status: 'confirmed' as OrderStatus,
    orderDate: '2024-03-22T19:00:00Z',
    estimatedDeliveryTime: '2024-03-22T19:40:00Z',
    deliveryAddress: '789 User St, City',
    paymentMethod: 'credit_card',
    notes: 'Call when arrived',
    createdAt: '2024-03-22T19:00:00Z',
    updatedAt: '2024-03-22T19:05:00Z'
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
    
    const newOrder: Order = {
      id: Date.now().toString(),
      userId: orderData.userId || '1', // Default to current user
      restaurantId: orderData.restaurantId,
      restaurantName: orderData.restaurantName || 'Unknown Restaurant',
      items: itemsWithIds,
      totalAmount: orderData.totalAmount || 0,
      status: 'pending' as OrderStatus,
      orderDate: new Date().toISOString(),
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod,
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

  // Get ongoing orders (not delivered/cancelled)
  getOngoingOrders: async (userId?: string): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return MOCK_ORDERS.filter(order => 
      (!userId || order.userId === userId) &&
      !['delivered', 'cancelled'].includes(order.status)
    );
  },

  // Get order history (delivered/cancelled)
  getOrderHistory: async (userId?: string): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return MOCK_ORDERS.filter(order => 
      (!userId || order.userId === userId) &&
      ['delivered', 'cancelled'].includes(order.status)
    ).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }
};
