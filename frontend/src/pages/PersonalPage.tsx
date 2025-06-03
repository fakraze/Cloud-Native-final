import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Star, Edit2, Save, X, Award, TrendingUp, Shield, Bell } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOrderHistory } from '../hooks/useOrder';
import { useUnreadCount } from '../hooks/useInbox';

const PersonalPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: orderHistory } = useOrderHistory();
  const { unreadCount } = useUnreadCount(user?.id || '');
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative max-w-6xl mx-auto p-6 space-y-8">        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Personal Profile
          </h1>
          <p className="text-gray-600">View your profile, dining statistics, and messages</p>
        </div>

        {/* Profile Header */}
        <div className="glass-card card-hover">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Profile Active</span>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProfile}
                  className="btn-success inline-flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn-danger inline-flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="text-center lg:text-left">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto lg:mx-0 shadow-lg">
                  <User className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                  <Award className="h-4 w-4 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{user?.role}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="input-field"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">{user?.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="input-field"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">{user?.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    className="input-field"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-900 font-medium">{user?.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Statistics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card card-hover text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{totalOrders}</div>
            <div className="text-gray-600 font-medium">Total Orders</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>
          
          <div className="glass-card card-hover text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{completedOrders}</div>
            <div className="text-gray-600 font-medium">Completed</div>
            <div className="text-xs text-gray-500 mt-1">Successfully delivered</div>
          </div>
          
          <div className="glass-card card-hover text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl font-bold text-white">$</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">${totalSpent.toFixed(2)}</div>
            <div className="text-gray-600 font-medium">Total Spent</div>
            <div className="text-xs text-gray-500 mt-1">Lifetime value</div>
          </div>
          
          <div className="glass-card card-hover text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Star className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {topRestaurant ? topRestaurant[1] : 0}
            </div>
            <div className="text-gray-600 font-medium">Favorite Orders</div>
            <div className="text-xs text-gray-500 mt-1">Most frequent</div>
          </div>
        </div>

        {/* Favorite Restaurant */}
        {topRestaurant && (
          <div className="glass-card card-hover">
            <div className="flex items-center justify-between mb-6">
              <h3 className="section-title">🏆 Favorite Restaurant</h3>
              <div className="badge-gold">VIP Customer</div>
            </div>
            <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Star className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{topRestaurant[0]}</h4>
                <p className="text-gray-600 mb-2">{topRestaurant[1]} orders placed • You're a loyal customer!</p>
                <div className="flex items-center space-x-4">
                  <span className="badge-success">Preferred Customer</span>
                  <span className="text-sm text-gray-500">Special discounts available</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{Math.round((topRestaurant[1] / totalOrders) * 100)}%</div>
                <div className="text-sm text-gray-600">of your orders</div>
              </div>
            </div>
          </div>
        )}        {/* Inbox */}
        <div className="glass-card card-hover">
          <h3 className="section-title mb-6">📧 Messages</h3>
          <button 
            onClick={() => navigate('/inbox')}
            className="w-full group p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 text-left relative"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors duration-300 relative">
                <Bell className="h-6 w-6 text-purple-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-purple-900">
                  Inbox
                  {unreadCount > 0 && (
                    <span className="ml-2 text-sm text-purple-600 font-normal">
                      ({unreadCount} unread)
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">View your messages and notifications</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export { PersonalPage };
