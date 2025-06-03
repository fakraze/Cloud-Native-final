import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  ArrowLeft, 
  Clock, 
  Eye,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle,
  Utensils
} from 'lucide-react';
import { useMenu, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem, useRestaurant } from '../../hooks/useRestaurant';
import { MenuItem } from '../../types/restaurant';
import MenuItemFormModal from '../../components/MenuItemFormModal';
import MenuItemPreviewModal from '../../components/MenuItemPreviewModal';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

const MenuManagement: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { data: restaurant } = useRestaurant(restaurantId!);
  const { data: menu, isLoading } = useMenu(restaurantId!);
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [deletingMenuItem, setDeletingMenuItem] = useState<MenuItem | null>(null);
  const [previewingMenuItem, setPreviewingMenuItem] = useState<MenuItem | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle form submission
  const handleFormSubmit = async (menuItemData: Omit<MenuItem, 'id' | 'restaurantId'> | Partial<MenuItem>) => {
    try {
      if (editingMenuItem) {
        await updateMenuItem.mutateAsync({
          restaurantId: restaurantId!,
          menuItemId: editingMenuItem.id,
          data: menuItemData as Partial<MenuItem>
        });
        showNotification('success', 'Menu item updated successfully!');
      } else {
        await createMenuItem.mutateAsync({
          restaurantId: restaurantId!,
          menuItem: menuItemData as Omit<MenuItem, 'id' | 'restaurantId'>
        });
        showNotification('success', 'Menu item created successfully!');
      }
      setIsFormModalOpen(false);
      setEditingMenuItem(null);
    } catch (error) {
      showNotification('error', 'An error occurred. Please try again.');
    }
  };

  // Handle toggle menu item availability
  const handleToggleAvailability = async (menuItem: MenuItem) => {
    try {
      await updateMenuItem.mutateAsync({
        restaurantId: restaurantId!,
        menuItemId: menuItem.id,
        data: { isAvailable: !menuItem.isAvailable }
      });
      showNotification('success', `${menuItem.name} ${menuItem.isAvailable ? 'disabled' : 'enabled'}`);
    } catch (error) {
      showNotification('error', 'Failed to update menu item status');
    }
  };

  // Handle delete menu item
  const handleDeleteMenuItem = async () => {
    if (!deletingMenuItem) return;
    
    try {
      await deleteMenuItem.mutateAsync({
        restaurantId: restaurantId!,
        menuItemId: deletingMenuItem.id
      });
      showNotification('success', 'Menu item deleted successfully!');
      setIsDeleteModalOpen(false);
      setDeletingMenuItem(null);
    } catch (error) {
      showNotification('error', 'Failed to delete menu item.');
    }
  };

  // Modal handlers
  const handleAddMenuItem = () => {
    setEditingMenuItem(null);
    setIsFormModalOpen(true);
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (menuItem: MenuItem) => {
    setDeletingMenuItem(menuItem);
    setIsDeleteModalOpen(true);
  };

  const handlePreviewMenuItem = (menuItem: MenuItem) => {
    setPreviewingMenuItem(menuItem);
    setIsPreviewModalOpen(true);
  };

  // Get unique categories
  const categories = ['all', ...(menu ? [...new Set(menu.map(item => item.category))] : [])];

  // Filter menu items
  const filteredMenuItems = menu?.filter(menuItem => {
    const matchesSearch = menuItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menuItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menuItem.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || menuItem.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'available' && menuItem.isAvailable) ||
                         (statusFilter === 'unavailable' && !menuItem.isAvailable);
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-md flex items-center space-x-2 ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link
              to="/admin/restaurants"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Restaurants</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">
            Manage menu items for <span className="font-medium">{restaurant?.name}</span>
          </p>
        </div>
        <button 
          onClick={handleAddMenuItem}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
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

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field w-auto"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'available' | 'unavailable')}
              className="input-field w-auto"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredMenuItems.length} of {menu?.length || 0} menu items
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenuItems.map((menuItem) => (
          <div key={menuItem.id} className="card hover:shadow-lg transition-shadow duration-200">
            {/* Menu Item Image */}
            <div className="relative">
              <img
                src={menuItem.imageUrl || menuItem.image || '/placeholder-food.jpg'}
                alt={menuItem.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleToggleAvailability(menuItem)}
                  className={`p-1 rounded-full ${menuItem.isAvailable ? 'text-green-600' : 'text-gray-400'}`}
                  title={menuItem.isAvailable ? 'Available - Click to make unavailable' : 'Unavailable - Click to make available'}
                >
                  {menuItem.isAvailable ? (
                    <ToggleRight className="h-6 w-6" />
                  ) : (
                    <ToggleLeft className="h-6 w-6" />
                  )}
                </button>
              </div>
              <div className="absolute top-2 left-2">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-700">
                  {menuItem.category}
                </span>
              </div>
            </div>

            {/* Menu Item Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{menuItem.name}</h3>
                <div className="text-xl font-bold text-blue-600">
                  ${menuItem.price.toFixed(2)}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{menuItem.description}</p>

              {/* Status and Details */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  menuItem.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {menuItem.isAvailable ? 'Available' : 'Unavailable'}
                </span>

                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{menuItem.preparationTime || 15} min</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {menuItem.allergens && menuItem.allergens.length > 0 && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                    Contains allergens
                  </span>
                )}
                {menuItem.customizations && menuItem.customizations.length > 0 && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Customizable
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePreviewMenuItem(menuItem)}
                  className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditMenuItem(menuItem)}
                    className="p-1 text-gray-500 hover:text-blue-600"
                    title="Edit menu item"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(menuItem)}
                    className="p-1 text-gray-500 hover:text-red-600"
                    title="Delete menu item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMenuItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filters' 
              : 'Get started by adding your first menu item'}
          </p>
          {!searchTerm && categoryFilter === 'all' && statusFilter === 'all' && (
            <button 
              onClick={handleAddMenuItem}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Menu Item</span>
            </button>
          )}
        </div>
      )}

      {/* Statistics */}
      {menu && menu.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{menu.length}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {menu.filter(item => item.isAvailable).length}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {menu.filter(item => !item.isAvailable).length}
              </div>
              <div className="text-sm text-gray-600">Unavailable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{categories.length - 1}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Item Form Modal */}
      <MenuItemFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingMenuItem(null);
        }}
        onSubmit={handleFormSubmit}
        menuItem={editingMenuItem || undefined}
        isLoading={createMenuItem.isPending || updateMenuItem.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingMenuItem(null);
        }}
        onConfirm={handleDeleteMenuItem}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu item? This action cannot be undone."
        itemName={deletingMenuItem?.name}
        isLoading={deleteMenuItem.isPending}
      />

      {/* Menu Item Preview Modal */}
      {previewingMenuItem && (
        <MenuItemPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setPreviewingMenuItem(null);
          }}
          menuItem={previewingMenuItem}
        />
      )}
    </div>
  );
};

export default MenuManagement;
