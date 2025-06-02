import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Store, 
  ShoppingBag, 
  History, 
  User, 
  BarChart3,
  UtensilsCrossed,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  const employeeNavItems = [
    { name: 'Restaurants', path: '/restaurant', icon: Store },
    { name: 'Ongoing Orders', path: '/order', icon: ShoppingBag },
    { name: 'Order History', path: '/order-history', icon: History },
    { name: 'Personal', path: '/personal', icon: User },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin', icon: BarChart3 },
    { name: 'Restaurant Management', path: '/admin/restaurants', icon: UtensilsCrossed },
    { name: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'POS Interface', path: '/admin/pos', icon: CreditCard },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <aside className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-600 rounded-lg p-2">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isAdmin ? 'Admin Panel' : 'Order System'}
            </h2>
            <p className="text-sm text-gray-500">{user?.name}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {!isAdmin && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500 mb-2">Quick Actions</div>
            <Link
              to="/cart"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="font-medium">View Cart</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export { Sidebar };
