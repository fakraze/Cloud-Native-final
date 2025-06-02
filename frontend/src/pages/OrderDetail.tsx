import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Phone } from 'lucide-react';
import { useOrder } from '../hooks/useOrder';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(orderId!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Order not found or failed to load.</p>
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
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your order has been placed and is waiting for confirmation.';
      case 'confirmed':
        return 'Your order has been confirmed and will be prepared soon.';
      case 'preparing':
        return 'Your order is being prepared.';
      case 'ready':
        return 'Your order is ready for pickup!';
      case 'completed':
        return 'Your order has been completed.';
      case 'cancelled':
        return 'Your order has been cancelled.';
      default:
        return 'Order status unknown.';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      {/* Order Header */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.id.slice(-8)}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800">{getStatusMessage(order.status)}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Ordered: {new Date(order.orderDate).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{order.deliveryType === 'pickup' ? 'Pickup' : 'Dine In'}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="font-medium">Payment:</span>            <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}>
              {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{item.menuItemName}</h3>
                      <span className="text-gray-600">x{item.quantity}</span>
                    </div>
                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Customizations:</span>
                        <div className="ml-2">
                          {Object.entries(item.customizations).map(([key, value]) => (
                            <div key={key}>
                              {Array.isArray(value) ? value.join(', ') : value}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {item.notes && (
                      <p className="text-sm text-gray-600 italic">Note: {item.notes}</p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Restaurant Info */}
        <div className="space-y-6">
          {/* Restaurant Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Restaurant</h3>
            <p className="font-medium text-gray-900">{order.restaurantName}</p>
            <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>Contact restaurant for updates</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>${(order.totalAmount * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${(order.totalAmount * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {order.notes && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Instructions</h3>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { OrderDetail };
