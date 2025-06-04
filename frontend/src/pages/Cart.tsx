import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useUpdateCartItem, useRemoveFromCart, useCreateOrder } from '../hooks/useOrder';

const Cart: React.FC = () => {
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const updateCartMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const createOrderMutation = useCreateOrder();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <Link to="/restaurant" className="btn-primary">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCartMutation.mutate(itemId);
    } else {
      updateCartMutation.mutate({
        cartItemId: itemId,
        updates: { quantity: newQuantity }
      });
    }
  };

  const removeItem = (itemId: string) => {
    removeFromCartMutation.mutate(itemId);
  };
  const handleCheckout = () => {
    console.log(cart);
    const orderData = {      
      restaurantId: cart.items[0].menuItem.restaurantId,
      userId: cart.userId,
      items: cart.items.map(item => ({
        menuItemId: item.menuItem.id,
        menuItemName: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price,
        customizations: item.customizations,
        notes: item.notes
      })),
      totalAmount: cart.totalAmount,
      deliveryType: 'pickup' as const
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: (order) => {
        navigate(`/order/${order.id}`);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            to="/restaurant" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-center space-x-4">
                <img
                  src={item.menuItem.imageUrl || '/placeholder-food.jpg'}
                  alt={item.menuItem.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.menuItem.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.menuItem.description}</p>
                  
                  {/* Customizations */}
                  {Object.keys(item.customizations).length > 0 && (
                    <div className="text-xs text-gray-500 mb-2">
                      {Object.entries(item.customizations).map(([key, value]) => (
                        <div key={key}>
                          {Array.isArray(value) ? value.join(', ') : value}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {item.notes && (
                    <p className="text-xs text-gray-500 italic">Note: {item.notes}</p>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                      disabled={updateCartMutation.isPending}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                      disabled={updateCartMutation.isPending}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      disabled={removeFromCartMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>${(cart.totalAmount * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${(cart.totalAmount * 1.08).toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={createOrderMutation.isPending}
              className={`w-full btn-primary ${
                createOrderMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {createOrderMutation.isPending ? 'Processing...' : 'Checkout'}
            </button>
            
            {createOrderMutation.error && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded p-2">
                <p className="text-sm text-red-600">Failed to create order. Please try again.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Cart };
