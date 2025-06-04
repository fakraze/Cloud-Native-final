import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  DollarSign,
  Clock,
  CheckCircle 
} from 'lucide-react';
import { useOrderHistory } from '../../hooks/useOrder';
import { useRestaurants } from '../../hooks/useRestaurant';

const AdminDashboard: React.FC = () => {
  const { data: orders } = useOrderHistory();
  const { data: restaurants } = useRestaurants();

  // Calculate statistics
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  const todayOrders = orders?.filter(order => {
    const today = new Date().toDateString();
    return new Date(order.orderDate).toDateString() === today;
  }).length || 0;

  const activeRestaurants = restaurants?.filter(r => r.isActive).length || 0;
  const totalRestaurants = restaurants?.length || 0;

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Pending Orders',
      value: pendingOrders.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      name: 'Completed Today',
      value: todayOrders.toString(),
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];
  const quickActions = [
    {
      name: 'Manage Restaurants',
      description: 'Add, edit, or manage restaurant listings',
      href: '/admin/restaurants',
      icon: UtensilsCrossed,
      color: 'bg-blue-600',
    },
    {
      name: 'Order Management',
      description: 'View and manage all customer orders',
      href: '/admin/orders',
      icon: ShoppingBag,
      color: 'bg-green-600',
    },
  ];

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your restaurant system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="group relative p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Overview */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Restaurants</span>
              <span className="text-lg font-semibold text-gray-900">{totalRestaurants}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Active Restaurants</span>
              <span className="text-lg font-semibold text-green-600">{activeRestaurants}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Inactive Restaurants</span>
              <span className="text-lg font-semibold text-red-600">{totalRestaurants - activeRestaurants}</span>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{order.id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">{order.restaurantName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{((completedOrders / totalOrders) * 100 || 0).toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Order Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">${(totalRevenue / totalOrders || 0).toFixed(2)}</div>
            <div className="text-sm text-gray-600">Average Order Value</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{((activeRestaurants / totalRestaurants) * 100 || 0).toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Restaurant Availability</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminDashboard };
