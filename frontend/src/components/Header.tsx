import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Bell } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useLogout } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { cart } = useCartStore();
  const location = useLocation();
  const logoutMutation = useLogout();

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Restaurant Order System
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          {!location.pathname.startsWith('/admin') && (
            <Link
              to="/cart"
              className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          {/* Notifications */}
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Bell className="h-6 w-6" />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Link
              to="/personal"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <User className="h-6 w-6" />
              <span className="text-sm font-medium">{user?.name}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
