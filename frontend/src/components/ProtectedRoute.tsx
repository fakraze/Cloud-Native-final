import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: User['role'];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/restaurant" replace />;
  }
  return <>{children}</>;
};

export { ProtectedRoute };
