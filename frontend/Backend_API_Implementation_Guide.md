# Backend API Implementation Guide

This document outlines all the REST API endpoints that need to be implemented in the backend to support the frontend application. The frontend is a restaurant ordering system with different user roles (admin, staff, employee/customer).

## Base Configuration

- **Base URL**: `http://localhost:3001/api`
- **Authentication**: Bearer token in Authorization header
- **Content-Type**: `application/json`
- **Request Format**: All request bodies must be in JSON format
- **Response Format**: All responses must be in JSON format

## Authentication Endpoints

### POST `/auth/login`
**Purpose**: User authentication
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "email": "string",
  "password": "string"
}
```
**Response** (JSON):
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "employee | admin | staff",
    "phone": "string (optional)",
    "createdAt": "string (optional)"
  },
  "token": "string"
}
```

### POST `/auth/logout`
**Purpose**: User logout
**Content-Type**: `application/json`
**Request Body**: Empty JSON object `{}`
**Response**: JSON with status message
```json
{
  "message": "Logged out successfully"
}
```

## Restaurant Management Endpoints

### GET `/restaurant`
**Purpose**: Get all restaurants
**Response** (JSON):
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "imageUrl": "string (optional)",
    "rating": "number",
    "isActive": "boolean",
    "cuisine": "string (optional)",
    "address": "string (optional)",
    "phone": "string (optional)",
    "email": "string (optional)",
    "totalRatings": "number (optional)",
    "deliveryTime": "string (optional)",
    "createdAt": "string (optional)",
    "updatedAt": "string (optional)"
  }
]
```

### GET `/restaurant/:id`
**Purpose**: Get restaurant by ID
**Parameters**: `id` (string)
**Response** (JSON):
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "imageUrl": "string (optional)",
  "rating": "number",
  "isActive": "boolean",
  "cuisine": "string (optional)",
  "address": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)",
  "totalRatings": "number (optional)",
  "deliveryTime": "string (optional)",
  "createdAt": "string (optional)",
  "updatedAt": "string (optional)"
}
```

### POST `/restaurant`
**Purpose**: Create new restaurant (Admin only)
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "name": "string",
  "description": "string",
  "imageUrl": "string (optional)",
  "cuisine": "string (optional)",
  "address": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)",
  "deliveryTime": "string (optional)"
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "imageUrl": "string (optional)",
  "rating": "number",
  "isActive": "boolean",
  "cuisine": "string (optional)",
  "address": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)",
  "totalRatings": "number (optional)",
  "deliveryTime": "string (optional)",
  "createdAt": "string (optional)",
  "updatedAt": "string (optional)"
}
```

### PUT `/restaurant/:id`
**Purpose**: Update restaurant (Admin only)
**Parameters**: `id` (string)
**Content-Type**: `application/json`
**Request Body** (JSON): Partial Restaurant object
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "imageUrl": "string (optional)",
  "cuisine": "string (optional)",
  "address": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)",
  "deliveryTime": "string (optional)",
  "isActive": "boolean (optional)"
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "imageUrl": "string (optional)",
  "rating": "number",
  "isActive": "boolean",
  "cuisine": "string (optional)",
  "address": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)",
  "totalRatings": "number (optional)",
  "deliveryTime": "string (optional)",
  "createdAt": "string (optional)",
  "updatedAt": "string (optional)"
}
```

### DELETE `/restaurant/:id`
**Purpose**: Delete restaurant (Admin only)
**Parameters**: `id` (string)
**Response** (JSON):
```json
{
  "message": "Restaurant deleted successfully"
}
```

## Menu Management Endpoints

### GET `/restaurant/:restaurantId/menu`
**Purpose**: Get all menu items for a restaurant
**Parameters**: `restaurantId` (string)
**Response** (JSON):
```json
[
  {
    "id": "string",
    "restaurantId": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "imageUrl": "string (optional)",
    "category": "string",
    "isAvailable": "boolean",
    "preparationTime": "number (optional)",
    "allergens": ["string"] ,
    "nutritionInfo": {
      "calories": "number",
      "protein": "number",
      "carbs": "number",
      "fat": "number"
    },
    "customizations": []
  }
]
```

### GET `/restaurant/:restaurantId/menu/:menuItemId`
**Purpose**: Get specific menu item
**Parameters**: `restaurantId` (string), `menuItemId` (string)
**Response** (JSON):
```json
{
  "id": "string",
  "restaurantId": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string (optional)",
  "category": "string",
  "isAvailable": "boolean",
  "preparationTime": "number (optional)",
  "allergens": ["string"],
  "nutritionInfo": {
    "calories": "number",
    "protein": "number",
    "carbs": "number",
    "fat": "number"
  },
  "customizations": []
}
```

### POST `/restaurant/:restaurantId/menu`
**Purpose**: Create new menu item (Admin only)
**Parameters**: `restaurantId` (string)
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string (optional)",
  "category": "string",
  "isAvailable": "boolean",
  "preparationTime": "number (optional)",
  "allergens": ["string"],
  "nutritionInfo": {
    "calories": "number",
    "protein": "number",
    "carbs": "number",
    "fat": "number"
  },
  "customizations": []
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "restaurantId": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string (optional)",
  "category": "string",
  "isAvailable": "boolean",
  "preparationTime": "number (optional)",
  "allergens": ["string"],
  "nutritionInfo": {
    "calories": "number",
    "protein": "number",
    "carbs": "number",
    "fat": "number"
  },
  "customizations": []
}
```

### PUT `/restaurant/:restaurantId/menu/:menuItemId`
**Purpose**: Update menu item (Admin only)
**Parameters**: `restaurantId` (string), `menuItemId` (string)
**Content-Type**: `application/json`
**Request Body** (JSON): Partial MenuItem object
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "price": "number (optional)",
  "imageUrl": "string (optional)",
  "category": "string (optional)",
  "isAvailable": "boolean (optional)",
  "preparationTime": "number (optional)",
  "allergens": ["string"],
  "nutritionInfo": {
    "calories": "number",
    "protein": "number",
    "carbs": "number",
    "fat": "number"
  },
  "customizations": []
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "restaurantId": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string (optional)",
  "category": "string",
  "isAvailable": "boolean",
  "preparationTime": "number (optional)",
  "allergens": ["string"],
  "nutritionInfo": {
    "calories": "number",
    "protein": "number",
    "carbs": "number",
    "fat": "number"
  },
  "customizations": []
}
```

### DELETE `/restaurant/:restaurantId/menu/:menuItemId`
**Purpose**: Delete menu item (Admin only)
**Parameters**: `restaurantId` (string), `menuItemId` (string)
**Response** (JSON):
```json
{
  "message": "Menu item deleted successfully"
}
```

## Order Management Endpoints

### GET `/order/ongoing`
**Purpose**: Get user's ongoing orders
**Response** (JSON):
```json
[
  {
    "id": "string",
    "userId": "string",
    "restaurantId": "string",
    "restaurantName": "string",
    "items": [],
    "totalAmount": "number",
    "status": "pending | confirmed | preparing | ready | completed | cancelled | delivered",
    "paymentStatus": "pending | paid | failed",
    "orderDate": "string",
    "estimatedDeliveryTime": "string (optional)",
    "actualDeliveryTime": "string (optional)",
    "notes": "string (optional)",
    "deliveryType": "pickup | dine-in",
    "deliveryAddress": "string (optional)",
    "paymentMethod": "string (optional)",
    "updatedAt": "string (optional)",
    "createdAt": "string (optional)"
  }
]
```

### GET `/order/history`
**Purpose**: Get user's order history
**Response** (JSON):
```json
[
  {
    "id": "string",
    "userId": "string",
    "restaurantId": "string",
    "restaurantName": "string",
    "items": [],
    "totalAmount": "number",
    "status": "pending | confirmed | preparing | ready | completed | cancelled | delivered",
    "paymentStatus": "pending | paid | failed",
    "orderDate": "string",
    "estimatedDeliveryTime": "string (optional)",
    "actualDeliveryTime": "string (optional)",
    "notes": "string (optional)",
    "deliveryType": "pickup | dine-in",
    "deliveryAddress": "string (optional)",
    "paymentMethod": "string (optional)",
    "updatedAt": "string (optional)",
    "createdAt": "string (optional)"
  }
]
```

### GET `/order/:orderId`
**Purpose**: Get specific order
**Parameters**: `orderId` (string)
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "restaurantId": "string",
  "restaurantName": "string",
  "items": [
    {
      "id": "string",
      "menuItemId": "string",
      "menuItemName": "string",
      "quantity": "number",
      "price": "number",
      "customizations": {},
      "specialInstructions": "string (optional)"
    }
  ],
  "totalAmount": "number",
  "status": "pending | confirmed | preparing | ready | completed | cancelled | delivered",
  "paymentStatus": "pending | paid | failed",
  "orderDate": "string",
  "estimatedDeliveryTime": "string (optional)",
  "actualDeliveryTime": "string (optional)",
  "notes": "string (optional)",
  "deliveryType": "pickup | dine-in",
  "deliveryAddress": "string (optional)",
  "paymentMethod": "string (optional)",
  "updatedAt": "string (optional)",
  "createdAt": "string (optional)"
}
```

### POST `/order`
**Purpose**: Create new order
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "restaurantId": "string",
  "items": [
    {
      "menuItemId": "string",
      "quantity": "number",
      "customizations": {},
      "specialInstructions": "string (optional)"
    }
  ],
  "totalAmount": "number",
  "deliveryType": "pickup | dine-in",
  "deliveryAddress": "string (optional)",
  "notes": "string (optional)"
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "restaurantId": "string",
  "restaurantName": "string",
  "items": [
    {
      "id": "string",
      "menuItemId": "string",
      "menuItemName": "string",
      "quantity": "number",
      "price": "number",
      "customizations": {},
      "specialInstructions": "string (optional)"
    }
  ],
  "totalAmount": "number",
  "status": "pending | confirmed | preparing | ready | completed | cancelled | delivered",
  "paymentStatus": "pending | paid | failed",
  "orderDate": "string",
  "estimatedDeliveryTime": "string (optional)",
  "actualDeliveryTime": "string (optional)",
  "notes": "string (optional)",
  "deliveryType": "pickup | dine-in",
  "deliveryAddress": "string (optional)",
  "paymentMethod": "string (optional)",
  "updatedAt": "string (optional)",
  "createdAt": "string (optional)"
}
```

### DELETE `/order/:orderId`
**Purpose**: Cancel order
**Parameters**: `orderId` (string)
**Response** (JSON):
```json
{
  "message": "Order cancelled successfully"
}
```

### PUT `/order/:orderId/status`
**Purpose**: Update order status (Admin/Staff only)
**Parameters**: `orderId` (string)
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "status": "pending | confirmed | preparing | ready | completed | cancelled | delivered"
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "restaurantId": "string",
  "restaurantName": "string",
  "items": [],
  "totalAmount": "number",
  "status": "pending | confirmed | preparing | ready | completed | cancelled | delivered",
  "paymentStatus": "pending | paid | failed",
  "orderDate": "string",
  "estimatedDeliveryTime": "string (optional)",
  "actualDeliveryTime": "string (optional)",
  "notes": "string (optional)",
  "deliveryType": "pickup | dine-in",
  "deliveryAddress": "string (optional)",
  "paymentMethod": "string (optional)",
  "updatedAt": "string (optional)",
  "createdAt": "string (optional)"
}
```

### PUT `/order/:orderId/payment`
**Purpose**: Update payment status
**Parameters**: `orderId` (string)
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "paymentStatus": "pending | paid | failed",
  "paymentMethod": "string (optional)"
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "restaurantId": "string",
  "restaurantName": "string",
  "items": [],
  "totalAmount": "number",
  "status": "pending | confirmed | preparing | ready | completed | cancelled | delivered",
  "paymentStatus": "pending | paid | failed",
  "orderDate": "string",
  "estimatedDeliveryTime": "string (optional)",
  "actualDeliveryTime": "string (optional)",
  "notes": "string (optional)",
  "deliveryType": "pickup | dine-in",
  "deliveryAddress": "string (optional)",
  "paymentMethod": "string (optional)",
  "updatedAt": "string (optional)",
  "createdAt": "string (optional)"
}
```

### GET `/order/admin/all`
**Purpose**: Get all orders (Admin only)
**Response** (JSON):
```json
[
  {
    "id": "string",
    "userId": "string",
    "restaurantId": "string",
    "restaurantName": "string",
    "items": [],
    "totalAmount": "number",
    "status": "pending | confirmed | preparing | ready | completed | cancelled | delivered",
    "paymentStatus": "pending | paid | failed",
    "orderDate": "string",
    "estimatedDeliveryTime": "string (optional)",
    "actualDeliveryTime": "string (optional)",
    "notes": "string (optional)",
    "deliveryType": "pickup | dine-in",
    "deliveryAddress": "string (optional)",
    "paymentMethod": "string (optional)",
    "updatedAt": "string (optional)",
    "createdAt": "string (optional)"
  }
]
```

## Cart Management Endpoints

### GET `/cart/:userId`
**Purpose**: Get user's cart
**Parameters**: `userId` (string)
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "items": [
    {
      "id": "string",
      "menuItem": {
        "id": "string",
        "restaurantId": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "imageUrl": "string (optional)",
        "category": "string",
        "isAvailable": "boolean"
      },
      "quantity": "number",
      "customizations": {},
      "specialInstructions": "string (optional)",
      "subtotal": "number"
    }
  ],
  "totalAmount": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### POST `/cart`
**Purpose**: Add item to cart
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "userId": "string",
  "menuItemId": "string",
  "quantity": "number",
  "customizations": {},
  "specialInstructions": "string (optional)"
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "items": [
    {
      "id": "string",
      "menuItem": {},
      "quantity": "number",
      "customizations": {},
      "specialInstructions": "string (optional)",
      "subtotal": "number"
    }
  ],
  "totalAmount": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### PUT `/cart/:cartItemId`
**Purpose**: Update cart item
**Parameters**: `cartItemId` (string)
**Content-Type**: `application/json`
**Request Body** (JSON): Partial CartItem object
```json
{
  "quantity": "number (optional)",
  "customizations": {},
  "specialInstructions": "string (optional)"
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "items": [],
  "totalAmount": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### DELETE `/cart/:cartItemId`
**Purpose**: Remove item from cart
**Parameters**: `cartItemId` (string)
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "items": [],
  "totalAmount": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### DELETE `/cart`
**Purpose**: Clear entire cart
**Response** (JSON):
```json
{
  "message": "Cart cleared successfully"
}
```

## Rating System Endpoints

### GET `/rating/:restaurantId`
**Purpose**: Get restaurant ratings
**Parameters**: `restaurantId` (string)
**Response** (JSON):
```json
[
  {
    "id": "string",
    "userId": "string",
    "orderId": "string",
    "restaurantId": "string",
    "tasteRating": "number",
    "valueRating": "number",
    "overallRating": "number",
    "comment": "string (optional)",
    "createdAt": "string"
  }
]
```

### POST `/rating`
**Purpose**: Create restaurant rating
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "orderId": "string",
  "restaurantId": "string",
  "tasteRating": "number",
  "valueRating": "number",
  "overallRating": "number",
  "comment": "string (optional)"
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "orderId": "string",
  "restaurantId": "string",
  "tasteRating": "number",
  "valueRating": "number",
  "overallRating": "number",
  "comment": "string (optional)",
  "createdAt": "string"
}
```

### PUT `/rating/:ratingId`
**Purpose**: Update rating
**Parameters**: `ratingId` (string)
**Content-Type**: `application/json`
**Request Body** (JSON): Partial rating object
```json
{
  "tasteRating": "number (optional)",
  "valueRating": "number (optional)",
  "overallRating": "number (optional)",
  "comment": "string (optional)"
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "orderId": "string",
  "restaurantId": "string",
  "tasteRating": "number",
  "valueRating": "number",
  "overallRating": "number",
  "comment": "string (optional)",
  "createdAt": "string"
}
```

### DELETE `/rating/:ratingId`
**Purpose**: Delete rating
**Parameters**: `ratingId` (string)
**Response** (JSON):
```json
{
  "message": "Rating deleted successfully"
}
```

### GET `/dish-rating/:dishId`
**Purpose**: Get dish ratings
**Parameters**: `dishId` (string)
**Response** (JSON):
```json
[
  {
    "id": "string",
    "userId": "string",
    "orderId": "string",
    "dishId": "string",
    "restaurantId": "string",
    "rating": "number",
    "createdAt": "string"
  }
]
```

### POST `/dish-rating`
**Purpose**: Create dish rating
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "orderId": "string",
  "dishId": "string",
  "restaurantId": "string",
  "rating": "number"
}
```
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "orderId": "string",
  "dishId": "string",
  "restaurantId": "string",
  "rating": "number",
  "createdAt": "string"
}
```

## Inbox/Notification Endpoints

### GET `/inbox/:userId`
**Purpose**: Get user's messages
**Parameters**: `userId` (string)
**Response** (JSON):
```json
[
  {
    "id": "string",
    "userId": "string",
    "title": "string",
    "message": "string",
    "type": "info | warning | success | error",
    "isRead": "boolean",
    "createdAt": "string"
  }
]
```

### PUT `/inbox/:messageId/read`
**Purpose**: Mark message as read
**Parameters**: `messageId` (string)
**Response** (JSON):
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "message": "string",
  "type": "info | warning | success | error",
  "isRead": "boolean",
  "createdAt": "string"
}
```

### PUT `/inbox/:userId/read-all`
**Purpose**: Mark all messages as read for user
**Parameters**: `userId` (string)
**Response** (JSON):
```json
{
  "message": "All messages marked as read"
}
```

### DELETE `/inbox/:messageId`
**Purpose**: Delete message
**Parameters**: `messageId` (string)
**Response** (JSON):
```json
{
  "message": "Message deleted successfully"
}
```

### GET `/inbox/:userId/unread-count`
**Purpose**: Get unread message count
**Parameters**: `userId` (string)
**Response** (JSON):
```json
{
  "count": "number"
}
```

### POST `/inbox/send-to-all-employees`
**Purpose**: Send notification to all employees (Admin only)
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "title": "string",
  "message": "string",
  "type": "info | warning | success | error"
}
```
**Response** (JSON):
```json
{
  "message": "Notification sent to all employees successfully"
}
```

### POST `/inbox/send-to-employee/:employeeId`
**Purpose**: Send notification to specific employee (Admin only)
**Parameters**: `employeeId` (string)
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "title": "string",
  "message": "string",
  "type": "info | warning | success | error"
}
```
**Response** (JSON):
```json
{
  "message": "Notification sent successfully"
}
```

## Payment Endpoints

### POST `/payment`
**Purpose**: Process payment
**Content-Type**: `application/json`
**Request Body** (JSON):
```json
{
  "orderId": "string",
  "paymentMethod": "string"
}
```
**Response** (JSON):
```json
{
  "success": "boolean",
  "transactionId": "string"
}
```

## Data Models

### Restaurant
```typescript
interface Restaurant {
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
```

### MenuItem
```typescript
interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
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
```

### Order
```typescript
interface Order {
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
```

### Cart
```typescript
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
```

### CartItem
```typescript
interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations?: Record<string, string | string[]>;
  specialInstructions?: string;
  subtotal: number;
}
```

### InboxMessage
```typescript
interface InboxMessage {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
}
```

### RestaurantRating
```typescript
interface RestaurantRating {
  id: string;
  userId: string;
  orderId: string;
  restaurantId: string;
  tasteRating: number;
  valueRating: number;
  overallRating: number;
  comment?: string;
  createdAt: string;
}
```

### DishRating
```typescript
interface DishRating {
  id: string;
  userId: string;
  orderId: string;
  dishId: string;
  restaurantId: string;
  rating: number; // 1-5
  createdAt: string;
}
```

## Authentication & Authorization

All endpoints require authentication except for the login endpoint. The system supports three user roles:

- **employee**: Regular customers who can place orders, view menus, rate restaurants
- **staff**: Restaurant staff who can manage orders, update order status
- **admin**: Full access to manage restaurants, menus, orders, and send notifications

Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Handling

All endpoints should return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error response format (JSON):
```json
{
  "message": "string",
  "error": "string (optional)",
  "statusCode": "number"
}
```

## Implementation Notes

1. All endpoints should validate user permissions based on roles
2. Cart operations should be associated with the authenticated user
3. Order creation should clear the user's cart
4. Rating endpoints should prevent duplicate ratings for the same order
5. Notification endpoints should create inbox messages for the target users
6. Payment processing should update both payment status and order status
7. Soft deletes are recommended for critical data like orders and restaurants
8. All timestamps should be in ISO 8601 format
9. File uploads for images should be handled separately (e.g., using multer)
10. Implement proper pagination for endpoints that return lists of items

This guide provides all the necessary endpoints and data structures needed to fully support the frontend application's functionality.
