import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken, selectUser } from '../features/auth/authSlice';

/**
 * Protects routes that require login.
 * - If no token: redirect to /login (and save intended URL for post-login redirect if you add it later).
 * - If role="admin": also require user.role === 'admin' || 'driver'; otherwise redirect to /user.
 */
const ProtectedRoute = ({ children, role }) => {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === 'admin') {
    const isAdmin = user?.role === 'admin' || user?.role === 'driver';
    if (!isAdmin) {
      return <Navigate to="/user" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
