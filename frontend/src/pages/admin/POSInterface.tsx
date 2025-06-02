import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign,
  ShoppingCart,
  Calculator
} from 'lucide-react';
import { useRestaurants, useMenu } from '../../hooks/useRestaurant';
import { MenuItem } from '../../types/restaurant';

interface POSCartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

const POSInterface: React.FC = () => {
  const { data: restaurants } = useRestaurants();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');
  const { data: menu } = useMenu(selectedRestaurantId);
  
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const categories = menu ? ['all', ...new Set(menu.map(item => item.category))] : ['all'];
  
  const filteredMenu = menu?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.isAvailable;
  }) || [];

  const cartTotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + tax;

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.menuItem.id === menuItem.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: `pos_${Date.now()}_${menuItem.id}`,
        menuItem,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerInfo({ name: '', phone: '', email: '' });
  };

  const handleCheckout = (paymentMethod: 'cash' | 'card') => {
    if (cart.length === 0) return;

    // In a real app, this would process the payment and create an order
    const orderData = {
      restaurantId: selectedRestaurantId,
      items: cart.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        price: item.menuItem.price,
        notes: item.notes
      })),
      customerInfo,
      paymentMethod,
      totalAmount: grandTotal,
      isPOSOrder: true
    };

    console.log('Processing POS order:', orderData);
    
    // Clear cart after successful order
    clearCart();
    alert(`Order processed successfully! Payment method: ${paymentMethod}`);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - Menu Items */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">POS System</h1>
          
          {/* Restaurant Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Restaurant
            </label>
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="input-field"
            >
              <option value="">Choose a restaurant...</option>
              {restaurants?.map(restaurant => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRestaurantId && (
            <>
              {/* Search and Category Filter */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field w-auto"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedRestaurantId ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMenu.map(item => (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer p-4"
                >
                  <img
                    src={item.imageUrl || '/placeholder-food.jpg'}
                    alt={item.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-600">${item.price.toFixed(2)}</span>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Restaurant</h3>
                <p className="text-gray-600">Choose a restaurant to start taking orders</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Cart and Checkout */}
      <div className="w-96 bg-white shadow-lg flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Current Order</h2>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Customer Information</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              className="input-field text-sm"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              className="input-field text-sm"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length > 0 ? (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.menuItem.name}</h4>
                    <p className="text-xs text-gray-600">${item.menuItem.price.toFixed(2)} each</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">No items in cart</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {cart.length > 0 && (
          <div className="p-4 border-t">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleCheckout('cash')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2"
              >
                <DollarSign className="h-4 w-4" />
                <span>Cash Payment</span>
              </button>
              <button
                onClick={() => handleCheckout('card')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Card Payment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { POSInterface };
