import React, { useState, useEffect } from 'react';
import { X, Upload, Clock, DollarSign, Plus, Minus } from 'lucide-react';
import { MenuItem, MenuItemCustomization } from '../types/restaurant';

interface MenuItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (menuItem: Omit<MenuItem, 'id' | 'restaurantId'> | Partial<MenuItem>) => void;
  menuItem?: MenuItem; // For editing
  isLoading?: boolean;
}

const MenuItemFormModal: React.FC<MenuItemFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  menuItem,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    isAvailable: true,
    preparationTime: 15,
    allergens: [] as string[],
    nutritionInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  });

  const [customizations, setCustomizations] = useState<MenuItemCustomization[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonCategories = [
    'appetizer', 'main', 'dessert', 'beverage', 'side', 'pizza', 'burger', 
    'pasta', 'salad', 'soup', 'sandwich', 'snack'
  ];

  const commonAllergens = [
    'gluten', 'dairy', 'nuts', 'shellfish', 'eggs', 'soy', 'fish', 'sesame'
  ];

  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name || '',
        description: menuItem.description || '',
        price: menuItem.price || 0,
        imageUrl: menuItem.imageUrl || menuItem.image || '',
        category: menuItem.category || '',
        isAvailable: menuItem.isAvailable !== undefined ? menuItem.isAvailable : true,
        preparationTime: menuItem.preparationTime || 15,
        allergens: menuItem.allergens || [],
        nutritionInfo: menuItem.nutritionInfo || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        }
      });
      setCustomizations(menuItem.customizations || []);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: '',
        isAvailable: true,
        preparationTime: 15,
        allergens: [],
        nutritionInfo: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        }
      });
      setCustomizations([]);
    }
    setErrors({});
  }, [menuItem, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNutritionChange = (field: keyof typeof formData.nutritionInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      nutritionInfo: {
        ...prev.nutritionInfo,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleAllergenToggle = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const addCustomization = () => {
    const newCustomization: MenuItemCustomization = {
      id: `custom_${Date.now()}`,
      name: '',
      type: 'radio',
      required: false,
      options: []
    };
    setCustomizations(prev => [...prev, newCustomization]);
  };

  const updateCustomization = (index: number, updates: Partial<MenuItemCustomization>) => {
    setCustomizations(prev => prev.map((custom, i) => 
      i === index ? { ...custom, ...updates } : custom
    ));
  };

  const removeCustomization = (index: number) => {
    setCustomizations(prev => prev.filter((_, i) => i !== index));
  };

  const addCustomizationOption = (customIndex: number) => {
    setCustomizations(prev => prev.map((custom, i) => 
      i === customIndex 
        ? { ...custom, options: [...(custom.options || []), ''] }
        : custom
    ));
  };

  const updateCustomizationOption = (customIndex: number, optionIndex: number, value: string) => {
    setCustomizations(prev => prev.map((custom, i) => 
      i === customIndex 
        ? { 
            ...custom, 
            options: custom.options?.map((opt, j) => j === optionIndex ? value : opt) || []
          }
        : custom
    ));
  };

  const removeCustomizationOption = (customIndex: number, optionIndex: number) => {
    setCustomizations(prev => prev.map((custom, i) => 
      i === customIndex 
        ? { 
            ...custom, 
            options: custom.options?.filter((_, j) => j !== optionIndex) || []
          }
        : custom
    ));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Menu item name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.preparationTime <= 0) {
      newErrors.preparationTime = 'Preparation time must be greater than 0';
    }

    // Validate customizations
    customizations.forEach((custom, index) => {
      if (!custom.name.trim()) {
        newErrors[`customization_${index}_name`] = 'Customization name is required';
      }
      if ((custom.type === 'radio' || custom.type === 'checkbox') && (!custom.options || custom.options.length === 0)) {
        newErrors[`customization_${index}_options`] = 'At least one option is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const menuItemData = {
      ...formData,
      customizations: customizations.filter(custom => 
        custom.name.trim() && 
        (custom.type === 'text' || (custom.options && custom.options.length > 0))
      )
    };

    onSubmit(menuItemData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {menuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter menu item name"
                  disabled={isLoading}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`input-field pl-10 ${errors.price ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                    disabled={isLoading}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe the menu item"
                disabled={isLoading}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                >
                  <option value="">Select category</option>
                  {commonCategories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preparation Time (minutes) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    min="1"
                    className={`input-field pl-10 ${errors.preparationTime ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.preparationTime && <p className="text-red-500 text-sm mt-1">{errors.preparationTime}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="https://example.com/image.jpg"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label className="ml-2 block text-sm text-gray-900">
                Available for ordering
              </label>
            </div>
          </div>

          {/* Allergens */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Allergens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {commonAllergens.map(allergen => (
                <label key={allergen} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.allergens.includes(allergen)}
                    onChange={() => handleAllergenToggle(allergen)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{allergen}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Nutrition Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Nutrition Information (Optional)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="number"
                  value={formData.nutritionInfo.calories}
                  onChange={(e) => handleNutritionChange('calories', e.target.value)}
                  className="input-field"
                  min="0"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={formData.nutritionInfo.protein}
                  onChange={(e) => handleNutritionChange('protein', e.target.value)}
                  className="input-field"
                  min="0"
                  step="0.1"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={formData.nutritionInfo.carbs}
                  onChange={(e) => handleNutritionChange('carbs', e.target.value)}
                  className="input-field"
                  min="0"
                  step="0.1"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                <input
                  type="number"
                  value={formData.nutritionInfo.fat}
                  onChange={(e) => handleNutritionChange('fat', e.target.value)}
                  className="input-field"
                  min="0"
                  step="0.1"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Customizations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Customizations</h3>
              <button
                type="button"
                onClick={addCustomization}
                className="btn-secondary text-sm inline-flex items-center space-x-1"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                <span>Add Customization</span>
              </button>
            </div>

            {customizations.map((custom, index) => (
              <div key={custom.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={custom.name}
                    onChange={(e) => updateCustomization(index, { name: e.target.value })}
                    className={`input-field ${errors[`customization_${index}_name`] ? 'border-red-500' : ''}`}
                    placeholder="Customization name (e.g., Size, Toppings)"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomization(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    disabled={isLoading}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
                {errors[`customization_${index}_name`] && (
                  <p className="text-red-500 text-sm">{errors[`customization_${index}_name`]}</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={custom.type}
                    onChange={(e) => updateCustomization(index, { 
                      type: e.target.value as 'radio' | 'checkbox' | 'text' 
                    })}
                    className="input-field"
                    disabled={isLoading}
                  >
                    <option value="radio">Single Choice (Radio)</option>
                    <option value="checkbox">Multiple Choice (Checkbox)</option>
                    <option value="text">Text Input</option>
                  </select>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={custom.required}
                      onChange={(e) => updateCustomization(index, { required: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-sm text-gray-700">Required</span>
                  </label>
                </div>

                {(custom.type === 'radio' || custom.type === 'checkbox') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Options</span>
                      <button
                        type="button"
                        onClick={() => addCustomizationOption(index)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        disabled={isLoading}
                      >
                        Add Option
                      </button>
                    </div>
                    {custom.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateCustomizationOption(index, optionIndex, e.target.value)}
                          className="input-field flex-1"
                          placeholder="Option name"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomizationOption(index, optionIndex)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {errors[`customization_${index}_options`] && (
                      <p className="text-red-500 text-sm">{errors[`customization_${index}_options`]}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                menuItem ? 'Update Menu Item' : 'Create Menu Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemFormModal;
