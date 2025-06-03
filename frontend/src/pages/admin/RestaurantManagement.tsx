import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useRestaurants, useCreateRestaurant, useUpdateRestaurant, useDeleteRestaurant } from '../../hooks/useRestaurant';
import { Restaurant } from '../../types/restaurant';
import RestaurantFormModal from '../../components/RestaurantFormModal';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

const RestaurantManagement: React.FC = () => {
  const { data: restaurants, isLoading } = useRestaurants();
  const createRestaurant = useCreateRestaurant();
  const updateRestaurant = useUpdateRestaurant();
  const deleteRestaurant = useDeleteRestaurant();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [deletingRestaurant, setDeletingRestaurant] = useState<Restaurant | null>(null);
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
  const handleFormSubmit = async (restaurantData: Omit<Restaurant, 'id'> | Partial<Restaurant>) => {
    try {
      if (editingRestaurant) {
        await updateRestaurant.mutateAsync({
          id: editingRestaurant.id,
          data: restaurantData as Partial<Restaurant>
        });
        showNotification('success', 'Restaurant updated successfully!');
      } else {
        await createRestaurant.mutateAsync(restaurantData as Omit<Restaurant, 'id'>);
        showNotification('success', 'Restaurant created successfully!');
      }
      setIsFormModalOpen(false);
      setEditingRestaurant(null);
    } catch (error) {
      showNotification('error', 'An error occurred. Please try again.');
    }
  };

  // Handle toggle restaurant status
  const handleToggleStatus = async (restaurant: Restaurant) => {
    try {
      await updateRestaurant.mutateAsync({
        id: restaurant.id,
        data: { isActive: !restaurant.isActive }
      });
      showNotification('success', `Restaurant ${!restaurant.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      showNotification('error', 'Failed to update restaurant status.');
    }
  };

  // Handle delete restaurant
  const handleDeleteRestaurant = async () => {
    if (!deletingRestaurant) return;
    
    try {
      await deleteRestaurant.mutateAsync(deletingRestaurant.id);
      showNotification('success', 'Restaurant deleted successfully!');
      setIsDeleteModalOpen(false);
      setDeletingRestaurant(null);
    } catch (error) {
      showNotification('error', 'Failed to delete restaurant.');
    }
  };

  // Modal handlers
  const handleAddRestaurant = () => {
    setEditingRestaurant(null);
    setIsFormModalOpen(true);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (restaurant: Restaurant) => {
    setDeletingRestaurant(restaurant);
    setIsDeleteModalOpen(true);
  };

  const filteredRestaurants = restaurants?.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && restaurant.isActive) ||
                         (statusFilter === 'inactive' && !restaurant.isActive);
    
    return matchesSearch && matchesStatus;
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
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Management</h1>
          <p className="text-gray-600">Manage your restaurant listings and settings</p>
        </div>
        <button 
          onClick={handleAddRestaurant}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Restaurant</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="input-field w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredRestaurants.length} of {restaurants?.length || 0} restaurants
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="card hover:shadow-lg transition-shadow duration-200">
            {/* Restaurant Image */}
            <div className="relative">
              <img
                src={restaurant.imageUrl || '/placeholder-restaurant.jpg'}
                alt={restaurant.name}
                className="w-full h-48 object-cover rounded-lg"
              />              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleToggleStatus(restaurant)}
                  className={`p-1 rounded-full ${restaurant.isActive ? 'text-green-600' : 'text-gray-400'}`}
                  title={restaurant.isActive ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                >
                  {restaurant.isActive ? (
                    <ToggleRight className="h-6 w-6" />
                  ) : (
                    <ToggleLeft className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{restaurant.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  restaurant.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.isActive ? 'Active' : 'Inactive'}
                </span>

                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>15-30 min</span>
                </div>
              </div>              {/* Actions */}              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    ID: {restaurant.id}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditRestaurant(restaurant)}
                      className="p-1 text-gray-500 hover:text-blue-600"
                      title="Edit restaurant"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(restaurant)}
                      className="p-1 text-gray-500 hover:text-red-600"
                      title="Delete restaurant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Link
                  to={`/admin/restaurants/${restaurant.id}/menu`}
                  className="btn-secondary text-sm w-full text-center"
                >
                  Manage Menu
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by adding your first restaurant'}
          </p>          {!searchTerm && statusFilter === 'all' && (
            <button 
              onClick={handleAddRestaurant}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Restaurant</span>
            </button>
          )}
        </div>
      )}

      {/* Restaurant Form Modal */}
      <RestaurantFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRestaurant(null);
        }}
        onSubmit={handleFormSubmit}
        restaurant={editingRestaurant || undefined}
        isLoading={createRestaurant.isPending || updateRestaurant.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingRestaurant(null);
        }}
        onConfirm={handleDeleteRestaurant}
        title="Delete Restaurant"
        message="Are you sure you want to delete this restaurant? This will also remove all associated menu items and order history."
        itemName={deletingRestaurant?.name}
        isLoading={deleteRestaurant.isPending}
      />
    </div>
  );
};

export { RestaurantManagement };
