import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Star, Edit2, Save, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOrderHistory } from '../hooks/useOrder';

const PersonalPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: orderHistory } = useOrderHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Calculate user statistics
  const totalOrders = orderHistory?.length || 0;
  const completedOrders = orderHistory?.filter(order => order.status === 'completed').length || 0;
  const totalSpent = orderHistory?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  const favoriteRestaurants = orderHistory?.reduce((acc, order) => {
    acc[order.restaurantName] = (acc[order.restaurantName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topRestaurant = favoriteRestaurants 
    ? Object.entries(favoriteRestaurants).sort(([,a], [,b]) => b - a)[0]
    : null;

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    console.log('Saving profile:', editedUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Personal Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSaveProfile}
                className="inline-flex items-center space-x-2 text-green-600 hover:text-green-800"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Picture & Basic Info */}
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600 capitalize">{user?.role}</p>
            <div className="mt-2 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="input-field"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="input-field"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                  className="input-field"
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <Phone className="h-4 w-4" />
                  <span>{user?.phone || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
          <div className="text-sm text-gray-600">Completed Orders</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">${totalSpent.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600">
            {topRestaurant ? topRestaurant[1] : 0}
          </div>
          <div className="text-sm text-gray-600">Most Orders</div>
        </div>
      </div>

      {/* Favorite Restaurants */}
      {topRestaurant && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Restaurant</h3>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{topRestaurant[0]}</h4>
              <p className="text-sm text-gray-600">{topRestaurant[1]} orders placed</p>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="font-medium text-gray-900">Change Password</div>
            <div className="text-sm text-gray-600">Update your account password</div>
          </button>
          <button className="w-full text-left px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="font-medium text-gray-900">Notification Preferences</div>
            <div className="text-sm text-gray-600">Manage your notification settings</div>
          </button>
          <button className="w-full text-left px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="font-medium text-gray-900">Privacy Settings</div>
            <div className="text-sm text-gray-600">Control your privacy and data settings</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export { PersonalPage };
