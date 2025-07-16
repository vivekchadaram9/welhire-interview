import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { type ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector((state:any) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to='/login' />;
};

export default ProtectedRoute;
