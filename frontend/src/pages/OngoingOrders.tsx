import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, X } from 'lucide-react';
import { useOngoingOrders, useCancelOrder } from '../hooks/useOrder';

const OngoingOrders: React.FC = () => {
  const { data: orders, isLoading, error } = useOngoingOrders();
  const cancelOrderMutation = useCancelOrder();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load ongoing orders. Please try again.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ongoing Orders</h1>
        <p className="text-gray-600 mt-2">Track your current orders</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(-8)}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{order.restaurantName}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{order.deliveryType}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Items:</span>
                    <span className="ml-1">
                      {order.items.map(item => `${item.quantity}x ${item.menuItemName}`).join(', ')}
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
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancelOrderMutation.isPending}
                      className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
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
          <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No ongoing orders</h2>
          <p className="text-gray-600 mb-6">Your current orders will appear here</p>
          <Link to="/restaurant" className="btn-primary">
            Browse Restaurants
          </Link>
        </div>
      )}
    </div>
  );
};

export { OngoingOrders };
