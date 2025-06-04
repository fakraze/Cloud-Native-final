import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, DollarSign, Calendar, Receipt, AlertCircle, CheckCircle } from 'lucide-react';
import { orderService } from '../services/orderService';

const Payment: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Fetch unpaid orders
  const { data: unpaidOrders = [], isLoading } = useQuery({
    queryKey: ['orders', 'unpaid'],
    queryFn: async () => {
      const allOrders = await orderService.getOrderHistory();
      return allOrders.filter(order => 
        order.paymentStatus === 'pending' || !order.paymentStatus
      );
    },
  });

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: async (data: { orderIds: string[]; paymentMethod: string; cardDetails?: any }) => {
      // In a real app, this would call a payment service
      const results = await Promise.all(
        data.orderIds.map(orderId => 
          orderService.updatePaymentStatus(orderId, 'paid', data.paymentMethod)
        )
      );
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setSelectedOrders([]);
      setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
    },
  });

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === unpaidOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(unpaidOrders.map(order => order.id));
    }
  };

  const handlePayment = () => {
    if (selectedOrders.length === 0) return;

    const paymentData = {
      orderIds: selectedOrders,
      paymentMethod,
      ...(paymentMethod === 'card' && { cardDetails })
    };

    paymentMutation.mutate(paymentData);
  };

  const selectedTotal = unpaidOrders
    .filter(order => selectedOrders.includes(order.id))
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const totalUnpaid = unpaidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Center</h1>
        <p className="text-gray-600">Manage your unpaid orders and process payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Total Unpaid</p>
              <p className="text-2xl font-bold text-red-700">${totalUnpaid.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Unpaid Orders</p>
              <p className="text-2xl font-bold text-blue-700">{unpaidOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Selected Total</p>
              <p className="text-2xl font-bold text-green-700">${selectedTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Unpaid Orders</h2>
              {unpaidOrders.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {selectedOrders.length === unpaidOrders.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {unpaidOrders.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">You have no unpaid orders at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {unpaidOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedOrders.includes(order.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleOrderSelect(order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleOrderSelect(order.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.restaurant!.name}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(order.createdAt!).toLocaleDateString()}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</div>
                        <div className="text-sm text-red-600">Unpaid</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        {order.items.map((item, index) => (
                          <span key={item.id || index}>
                            {index > 0 && ', '}
                            {item.quantity}x {item.menuItem!.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Panel */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            
            {selectedOrders.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select orders to pay</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected Orders Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Selected Orders</h4>
                  <div className="space-y-1">
                    {selectedOrders.map(orderId => {
                      const order = unpaidOrders.find(o => o.id === orderId);
                      return order ? (
                        <div key={orderId} className="flex justify-between text-sm">
                          <span>Order #{order.id}</span>
                          <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${selectedTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                      { value: 'transfer', label: 'Bank Transfer', icon: DollarSign },
                      { value: 'cash', label: 'Cash Payment', icon: DollarSign }
                    ].map(({ value, label, icon: Icon }) => (
                      <label key={value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={value}
                          checked={paymentMethod === value}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="mr-3 text-blue-600"
                        />
                        <Icon className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Card Details (if card payment selected) */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                        placeholder="1234 5678 9012 3456"
                        className="input-field"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                          placeholder="MM/YY"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                          placeholder="123"
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        className="input-field"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={paymentMutation.isPending}
                  className={`w-full btn-primary ${
                    paymentMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {paymentMutation.isPending ? 'Processing...' : `Pay $${selectedTotal.toFixed(2)}`}
                </button>

                {paymentMutation.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm text-red-600">Payment failed. Please try again.</p>
                  </div>
                )}

                {paymentMutation.isSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm text-green-600">Payment successful!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Payment };
