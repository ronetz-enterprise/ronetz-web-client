import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  // const { isAuthenticated, user } = useAuthStore();
  // const location = useLocation();

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  // if (allowedRoles && user && !allowedRoles.includes(user.role)) {
  //   // Redirect to a default page based on role if unauthorized
  //   const defaultPath = user.role === 'CLIENT' ? '/jetons' : 
  //                       user.role === 'ADMIN_WIFI' ? '/sites' : 
  //                       '/admin/users';
  //   return <Navigate to={defaultPath} replace />;
  // }


  return <>{children}</>;
};
