import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Star, Eye, Filter } from 'lucide-react';
import { useOrderHistory } from '../hooks/useOrder';

const OrderHistory: React.FC = () => {
  const { data: orders, isLoading, error } = useOrderHistory();
  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'all'>('month');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Failed to load order history</h2>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred while loading your order history.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  // Filter orders based on date
  const filteredOrders = orders?.filter(order => {
    const orderDate = new Date(order.createdAt!);
    const now = new Date();
    
    switch (dateFilter) {
      case 'week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      }
      case 'month': {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= monthAgo;
      }
      default:
        return true;
    }
  }) || [];

  const totalSpent = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-600 mt-2">View your past orders and leave reviews</p>
      </div>

      {/* Filters and Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as 'week' | 'month' | 'all')}
            className="input-field w-auto"
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Orders: {filteredOrders.length}</p>
          <p className="text-lg font-semibold text-gray-900">Total Spent: ${totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    {order.paymentStatus === 'paid' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Paid
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{order.restaurant!.name}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(order.createdAt!).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{order.deliveryType}</span>
                  </div>
                    <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Items:</span>
                    <span className="ml-1">
                      {order.items.map(item => `${item.quantity}x ${item.menuItem!.name || 'Unknown Item'}`).join(', ')}
                    </span>
                  </div>
                  
                  <div className="text-lg font-semibold text-gray-900">
                    Total: ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/order/${order.id}`}
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Details</span>
                  </Link>
                  
                  {order.status === 'completed' && (
                    <Link
                      to={`/rate/${order.restaurantId}?orderId=${order.id}`}
                      className="inline-flex items-center space-x-1 text-yellow-600 hover:text-yellow-800"
                    >
                      <Star className="h-4 w-4" />
                      <span>Rate</span>
                    </Link>
                  )}
                </div>
              </div>
              
              {order.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Note:</span>
                  <span className="text-sm text-gray-600 ml-2">{order.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No orders found
          </h2>
          <p className="text-gray-600 mb-6">
            {dateFilter === 'week' ? 'No orders in the past week' : 
             dateFilter === 'month' ? 'No orders in the past month' : 
             'You haven\'t placed any orders yet'}
          </p>
          <Link to="/restaurant" className="btn-primary">
            Browse Restaurants
          </Link>
        </div>
      )}
    </div>
  );
};

export { OrderHistory };
