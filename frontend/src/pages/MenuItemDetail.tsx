import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Menu item not found.</p>
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
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button 
        onClick={() => navigate(`/restaurant/${restaurantId}`)}
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Menu</span>
      </button>

      <div className="card">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            <img
              src={menuItem.imageUrl || '/placeholder-food.jpg'}
              alt={menuItem.name}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{menuItem.name}</h1>
            <p className="text-gray-600 mb-6">{menuItem.description}</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-blue-600">${menuItem.price.toFixed(2)}</span>
            </div>

            {/* Customizations */}
            {menuItem.customizations && menuItem.customizations.length > 0 && (
              <div className="space-y-6 mb-6">
                {menuItem.customizations.map(customization => (
                  <div key={customization.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {customization.name}
                      {customization.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {customization.type === 'radio' && customization.options && (
                      <div className="space-y-2">
                        {customization.options.map(option => (
                          <label key={option} className="flex items-center">
                            <input
                              type="radio"
                              name={customization.id}
                              value={option}
                              onChange={(e) => handleCustomizationChange(customization.id, e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {customization.type === 'checkbox' && customization.options && (
                      <div className="space-y-2">
                        {customization.options.map(option => (
                          <label key={option} className="flex items-center">
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
                              className="mr-2"
                            />
                            <span className="text-sm">{option}</span>
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
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Type
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="pickup"
                    checked={deliveryType === 'pickup'}
                    onChange={(e) => setDeliveryType(e.target.value as 'pickup')}
                    className="mr-2"
                  />
                  <span className="text-sm">Pickup</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="dine-in"
                    checked={deliveryType === 'dine-in'}
                    onChange={(e) => setDeliveryType(e.target.value as 'dine-in')}
                    className="mr-2"
                  />
                  <span className="text-sm">Dine In</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="input-field"
                placeholder="Any special requests or modifications..."
              />
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className={`w-full btn-primary text-lg py-3 ${
                  addToCartMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {addToCartMutation.isPending 
                  ? 'Adding to Cart...' 
                  : `Add to Cart - $${totalPrice.toFixed(2)}`
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MenuItemDetail };
