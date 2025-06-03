import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../store/authStore';
import { useCart } from '../hooks/useOrder';

const Layout: React.FC = () => {
  const { user } = useAuthStore();
  
  // Initialize cart when layout loads
  useCart(user?.id || '1');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
  </div>
  );
};

export { Layout };
