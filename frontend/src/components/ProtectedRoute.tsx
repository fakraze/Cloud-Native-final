import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: User['role'];
  allowedRoles?: User['role'][];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role permissions
  const hasAccess = () => {
    if (!user?.role) return false;
    
    // If allowedRoles is provided, use it
    if (allowedRoles) {
      return allowedRoles.includes(user.role);
    }
    
    // If requiredRole is provided, use it (backward compatibility)
    if (requiredRole) {
      return user.role === requiredRole;
    }
    
    // If no role restrictions, allow access
    return true;
  };

  if (!hasAccess()) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === 'staff') {
      return <Navigate to="/staff" replace />;
    } else {
      return <Navigate to="/restaurant" replace />;
    }
  }
  
  return <>{children}</>;
};

export { ProtectedRoute };
