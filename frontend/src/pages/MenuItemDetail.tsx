import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Clock, Star, Heart, Share2, Info } from 'lucide-react';
import { useMenuItem } from '../hooks/useRestaurant';
import { useAddToCart } from '../hooks/useOrder';
import { useAuthStore } from '../store/authStore';

const MenuItemDetail: React.FC = () => {
  const { restaurantId, menuItemId } = useParams<{ restaurantId: string; menuItemId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: menuItem, isLoading } = useMenuItem(restaurantId!, menuItemId!);
  const addToCartMutation = useAddToCart();

  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<Record<string, string | string[]>>({});
  const [notes, setNotes] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'dine-in'>('pickup');
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="glass-card card-hover">
            <div className="animate-pulse">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                  <div className="h-96 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="lg:w-1/2 space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!menuItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="glass-card text-center p-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Item Not Found</h2>
            <p className="text-gray-600 mb-6">The menu item you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate(-1)}
              className="btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCustomizationChange = (customizationId: string, value: string | string[]) => {
    setCustomizations(prev => ({
      ...prev,
      [customizationId]: value
    }));
  };

  const handleAddToCart = () => {
    if (!user) return;

    addToCartMutation.mutate({
      menuItem,
      quantity,
      customizations,
      notes: notes.trim() || undefined,
    }, {
      onSuccess: () => {
        navigate(`/restaurant/${restaurantId}`);
      }
    });
  };

  const totalPrice = menuItem.price * quantity;
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-4 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative max-w-6xl mx-auto p-6">
        {/* Back button */}
        <button 
          onClick={() => navigate(`/restaurant/${restaurantId}`)}
          className="inline-flex items-center space-x-3 text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="font-medium">Back to Menu</span>
        </button>

        <div className="glass-card card-hover">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Section */}
            <div className="lg:w-1/2">
              <div className="relative group">
                <img
                  src={menuItem.imageUrl || '/placeholder-food.jpg'}
                  alt={menuItem.name}
                  className="w-full h-96 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors duration-300 group">
                    <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500" />
                  </button>
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors duration-300 group">
                    <Share2 className="h-5 w-5 text-gray-600 group-hover:text-blue-500" />
                  </button>
                </div>
                {/* Rating Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">4.8</span>
                    <span className="text-xs text-gray-600">(124)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:w-1/2 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="badge-success">Popular</span>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">15-20 min</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{menuItem.name}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{menuItem.description}</p>
              </div>
              
              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ${menuItem.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">$24.99</span>
                <span className="badge-danger">20% OFF</span>
              </div>

              {/* Customizations */}
              {menuItem.customizations && menuItem.customizations.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Customize Your Order</h3>
                  {menuItem.customizations.map(customization => (
                    <div key={customization.id} className="bg-gray-50 rounded-xl p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {customization.name}
                        {customization.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {customization.type === 'radio' && customization.options && (
                        <div className="grid grid-cols-1 gap-2">
                          {customization.options.map(option => (
                            <label key={option} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 cursor-pointer transition-colors duration-200">
                              <input
                                type="radio"
                                name={customization.id}
                                value={option}
                                onChange={(e) => handleCustomizationChange(customization.id, e.target.value)}
                                className="mr-3 text-orange-600 focus:ring-orange-500"
                              />
                              <span className="text-sm font-medium text-gray-900">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {customization.type === 'checkbox' && customization.options && (
                        <div className="grid grid-cols-1 gap-2">
                          {customization.options.map(option => (
                            <label key={option} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 cursor-pointer transition-colors duration-200">
                              <input
                                type="checkbox"
                                value={option}
                                onChange={(e) => {
                                  const currentValues = (customizations[customization.id] as string[]) || [];
                                  if (e.target.checked) {
                                    handleCustomizationChange(customization.id, [...currentValues, option]);
                                  } else {
                                    handleCustomizationChange(customization.id, currentValues.filter(v => v !== option));
                                  }
                                }}
                                className="mr-3 text-orange-600 focus:ring-orange-500 rounded"
                              />
                              <span className="text-sm font-medium text-gray-900">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {customization.type === 'text' && (
                        <input
                          type="text"
                          onChange={(e) => handleCustomizationChange(customization.id, e.target.value)}
                          className="input-field"
                          placeholder={`Enter ${customization.name.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery Type */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    deliveryType === 'pickup' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                  }`}>
                    <input
                      type="radio"
                      value="pickup"
                      checked={deliveryType === 'pickup'}
                      onChange={(e) => setDeliveryType(e.target.value as 'pickup')}
                      className="sr-only"
                    />
                    <span className="font-medium">🚗 Pickup</span>
                  </label>
                  <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    deliveryType === 'dine-in' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                  }`}>
                    <input
                      type="radio"
                      value="dine-in"
                      checked={deliveryType === 'dine-in'}
                      onChange={(e) => setDeliveryType(e.target.value as 'dine-in')}
                      className="sr-only"
                    />
                    <span className="font-medium">🍽️ Dine In</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  placeholder="Any special requests or modifications..."
                />
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Quantity</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      <Minus className="h-5 w-5 text-gray-600" />
                    </button>
                    <span className="w-12 text-center text-xl font-bold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      <Plus className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  className={`w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                    addToCartMutation.isPending ? 'opacity-50 cursor-not-allowed transform-none' : ''
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {addToCartMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Adding to Cart...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        <span>Add to Cart - ${totalPrice.toFixed(2)}</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MenuItemDetail };
