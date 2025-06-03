import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { useOrderHistory } from '../../hooks/useOrder';
import { useAuthStore } from '../../store/authStore';

const StaffDashboard: React.FC = () => {
  const { data: orders } = useOrderHistory();
  const { user } = useAuthStore();

  // Calculate statistics
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const preparingOrders = orders?.filter(order => order.status === 'preparing').length || 0;
  const readyOrders = orders?.filter(order => order.status === 'ready').length || 0;
  const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  
  const todayOrders = orders?.filter(order => {
    const today = new Date().toDateString();
    return new Date(order.orderDate).toDateString() === today;
  }).length || 0;

  const stats = [
    {
      name: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Orders Today',
      value: todayOrders,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pending Orders',
      value: pendingOrders,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const quickActions = [
    {
      name: 'Order Management',
      description: 'View and manage all restaurant orders',
      href: '/staff/orders',
      icon: ShoppingBag,
      color: 'bg-blue-600',
    },
    {
      name: 'POS Interface',
      description: 'Process in-store orders and payments',
      href: '/staff/pos',
      icon: CreditCard,
      color: 'bg-green-600',
    },
  ];

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening with orders.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-lg ${action.color}`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders and Order Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/staff/orders" className="text-blue-600 hover:text-blue-800">
              View All
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
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
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

        {/* Order Status Overview */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                <span className="font-medium text-yellow-900">Pending</span>
              </div>
              <span className="text-yellow-900 font-semibold">{pendingOrders}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 text-orange-600 mr-3" />
                <span className="font-medium text-orange-900">Preparing</span>
              </div>
              <span className="text-orange-900 font-semibold">{preparingOrders}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-900">Ready</span>
              </div>
              <span className="text-blue-900 font-semibold">{readyOrders}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-green-900">Completed</span>
              </div>
              <span className="text-green-900 font-semibold">{completedOrders}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
