import React from 'react';
import { X, Clock, AlertTriangle } from 'lucide-react';
import { MenuItem } from '../types/restaurant';

interface MenuItemPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem;
}

const MenuItemPreviewModal: React.FC<MenuItemPreviewModalProps> = ({
  isOpen,
  onClose,
  menuItem
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Menu Item Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Image */}
          <div className="mb-6">
            <img
              src={menuItem.imageUrl || menuItem.image || '/placeholder-food.jpg'}
              alt={menuItem.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Basic Info */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{menuItem.name}</h3>
              <div className="text-2xl font-bold text-blue-600">
                ${menuItem.price.toFixed(2)}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${
                menuItem.isAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {menuItem.isAvailable ? 'Available' : 'Unavailable'}
              </span>
              
              <span className="inline-flex px-2 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                {menuItem.category}
              </span>
              
              {menuItem.preparationTime && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{menuItem.preparationTime} min</span>
                </div>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed">{menuItem.description}</p>
          </div>

          {/* Allergens */}
          {menuItem.allergens && menuItem.allergens.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                Allergens
              </h4>
              <div className="flex flex-wrap gap-2">
                {menuItem.allergens.map((allergen, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Information */}
          {menuItem.nutritionInfo && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Nutrition Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {menuItem.nutritionInfo.calories && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{menuItem.nutritionInfo.calories}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                )}
                {menuItem.nutritionInfo.protein && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{menuItem.nutritionInfo.protein}g</div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                )}
                {menuItem.nutritionInfo.carbs && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{menuItem.nutritionInfo.carbs}g</div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                )}
                {menuItem.nutritionInfo.fat && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{menuItem.nutritionInfo.fat}g</div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customizations */}
          {menuItem.customizations && menuItem.customizations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Available Customizations</h4>
              <div className="space-y-4">
                {menuItem.customizations.map((customization, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">{customization.name}</h5>
                    
                    {customization.options && customization.options.length > 0 && (
                      <div className="space-y-2">
                        {customization.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Type: {customization.type} • 
                      {customization.required ? ' Required' : ' Optional'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemPreviewModal;
