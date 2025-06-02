import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, X, CheckCircle, AlertCircle, Package, Utensils, MapPin } from 'lucide-react';
import { useOngoingOrders, useCancelOrder } from '../hooks/useOrder';

const OngoingOrders: React.FC = () => {
  const { data: orders, isLoading, error } = useOngoingOrders();
  const cancelOrderMutation = useCancelOrder();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card">
                <div className="animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="glass-card text-center p-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Orders</h2>
            <p className="text-gray-600 mb-6">Failed to load ongoing orders. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
        return 'badge-info';
      case 'preparing':
        return 'badge-orange';
      case 'ready':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'preparing':
        return <Utensils className="h-4 w-4" />;
      case 'ready':
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
