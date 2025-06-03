import { InboxMessage } from '../types/common';
import { getAllEmployees } from './mockAuthService';

// Mock inbox message data
const mockInboxMessages: Record<string, InboxMessage[]> = {
  '1': [ // Employee user messages
    {
      id: '1',
      userId: '1',
      title: 'Order Confirmed',
      message: 'Your order #12345 has been confirmed and is being prepared. Estimated delivery time: 30-45 minutes.',
      type: 'success',
      isRead: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    },
    {
      id: '2',
      userId: '1',
      title: 'Delivery Update',
      message: 'Your order #12344 is out for delivery! Your driver will arrive in approximately 10 minutes.',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    },
    {
      id: '3',
      userId: '1',
      title: 'Order Delivered',
      message: 'Your order #12343 has been successfully delivered. Thank you for choosing our service! Please rate your experience.',
      type: 'success',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: '4',
      userId: '1',
      title: 'Special Offer',
      message: 'Get 20% off your next order! Use code SAVE20 at checkout. Valid until tomorrow.',
      type: 'info',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: '5',
      userId: '1',
      title: 'Payment Failed',
      message: 'We were unable to process payment for order #12342. Please update your payment method and try again.',
      type: 'error',
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      id: '6',
      userId: '1',
      title: 'New Restaurant Available',
      message: 'Good news! "Sakura Sushi" is now available in your area. Check out their fresh sushi selection.',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      id: '7',
      userId: '1',
      title: 'System Maintenance',
      message: 'Our system will undergo maintenance tonight from 2 AM to 4 AM. Service may be temporarily unavailable.',
      type: 'warning',
      isRead: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    },
  ],
  '2': [ // Admin user messages
    {
      id: '8',
      userId: '2',
      title: 'Daily Report Ready',
      message: 'Your daily sales and order report is ready for review. Total orders: 150, Revenue: $2,450.',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    },
    {
      id: '9',
      userId: '2',
      title: 'Low Stock Alert',
      message: 'Several menu items are running low on ingredients. Please review inventory and restock.',
      type: 'warning',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: '10',
      userId: '2',
      title: 'New Restaurant Onboarded',
      message: 'Pizza Palace has been successfully added to the platform. All systems are operational.',
      type: 'success',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
  ],
  // Fallback for user1 (legacy)
  'user1': [
    {
      id: '11',
      userId: 'user1',
      title: 'Welcome Message',
      message: 'Welcome to our food delivery platform! Explore restaurants and place your first order.',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    },
  ],
};

// Helper function to get messages for any user (with fallback)
const getMessagesForUser = (userId: string): InboxMessage[] => {
  return mockInboxMessages[userId] || [];
};

export const mockInboxService = {
  getMessages: async (userId: string): Promise<InboxMessage[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const messages = getMessagesForUser(userId);
    // Sort by creation date (newest first)
    return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  markAsRead: async (messageId: string): Promise<InboxMessage> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Find the message across all users
    for (const userId in mockInboxMessages) {
      const messages = mockInboxMessages[userId];
      const message = messages.find(m => m.id === messageId);
      if (message) {
        message.isRead = true;
        return { ...message };
      }
    }
    
    throw new Error('Message not found');
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const messages = getMessagesForUser(userId);
    messages.forEach(message => {
      message.isRead = true;
    });
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Find and remove the message across all users
    for (const userId in mockInboxMessages) {
      const messages = mockInboxMessages[userId];
      const index = messages.findIndex(m => m.id === messageId);
      if (index !== -1) {
        messages.splice(index, 1);
        return;
      }
    }
    
    throw new Error('Message not found');
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const messages = getMessagesForUser(userId);
    return messages.filter(message => !message.isRead).length;
  },

  // Admin function to send notifications to all employees
  sendNotificationToAllEmployees: async (title: string, message: string, type: InboxMessage['type'] = 'info'): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employees = getAllEmployees();
    const timestamp = new Date().toISOString();
    
    employees.forEach(employee => {
      const newMessage: InboxMessage = {
        id: `msg-${Date.now()}-${employee.id}`,
        userId: employee.id,
        title,
        message,
        type,
        isRead: false,
        createdAt: timestamp,
      };
      
      // Initialize employee messages array if it doesn't exist
      if (!mockInboxMessages[employee.id]) {
        mockInboxMessages[employee.id] = [];
      }
      
      // Add the new message
      mockInboxMessages[employee.id].unshift(newMessage);
    });
  },

  // Admin function to send notification to specific employee
  sendNotificationToEmployee: async (employeeId: string, title: string, message: string, type: InboxMessage['type'] = 'info'): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newMessage: InboxMessage = {
      id: `msg-${Date.now()}-${employeeId}`,
      userId: employeeId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    
    // Initialize employee messages array if it doesn't exist
    if (!mockInboxMessages[employeeId]) {
      mockInboxMessages[employeeId] = [];
    }
    
    // Add the new message
    mockInboxMessages[employeeId].unshift(newMessage);
  },
};
