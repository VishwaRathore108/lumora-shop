import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken, selectUser } from '../features/auth/authSlice';

/**
 * Protects routes that require login.
 * - If no token: redirect to /login (and save intended URL for post-login redirect if you add it later).
 * - If role="admin": require admin user.
 * - If role="driver": require driver user.
 */
const ProtectedRoute = ({ children, role }) => {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === 'admin') {
    if (user?.role !== 'admin') {
      return <Navigate to={user?.role === 'driver' ? '/driver' : '/user'} replace />;
    }
  }

  if (role === 'driver') {
    if (user?.role !== 'driver') {
      return <Navigate to="/user" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
