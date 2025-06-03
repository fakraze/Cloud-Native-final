import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Bell, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useLogout } from '../hooks/useAuth';
import { useUnreadCount, useInbox } from '../hooks/useInbox';

const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { cart } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { unreadCount } = useUnreadCount(user?.id || '');
  const { messages, markAsRead } = useInbox(user?.id || '');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const recentMessages = messages.slice(0, 5); // Show only 5 most recent messages

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };  const handleMessageClick = async (messageId: string) => {
    try {
      await markAsRead(messageId);
      let inboxPath;
      if (user?.role === 'admin') {
        inboxPath = '/admin/inbox';
      } else if (user?.role === 'staff') {
        // Staff don't have inbox, redirect to dashboard
        inboxPath = '/staff';
      } else {
        inboxPath = '/inbox';
      }
      navigate(inboxPath);
      setShowNotifications(false);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      return `${Math.floor(diffInHours / 24)}d`;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Restaurant Order System
          </h1>
        </div>

        <div className="flex items-center space-x-4">          {/* Cart Icon */}
          {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/staff') && (
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
          )}{/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={handleNotificationClick}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors relative"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {recentMessages.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    recentMessages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => handleMessageClick(message.id)}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !message.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`text-sm font-medium ${
                                !message.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {message.title}
                              </h4>
                              {!message.isRead && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {message.message}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 ml-2">
                            {formatTimeAgo(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                  <div className="p-3 border-t border-gray-200">                  <button
                    onClick={() => {
                      let inboxPath;
                      if (user?.role === 'admin') {
                        inboxPath = '/admin/inbox';
                      } else if (user?.role === 'staff') {
                        // Staff don't have inbox, redirect to dashboard
                        inboxPath = '/staff';
                      } else {
                        inboxPath = '/inbox';
                      }
                      navigate(inboxPath);
                      setShowNotifications(false);
                    }}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {user?.role === 'staff' ? 'Go to Dashboard' : 'View All Messages'}
                  </button>
                </div>
              </div>
            )}
          </div>          {/* User Menu */}
          <div className="flex items-center space-x-3">            <Link
              to={
                user?.role === 'admin' 
                  ? '/admin/personal' 
                  : user?.role === 'staff' 
                    ? '/staff/personal' 
                    : '/personal'
              }
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
