import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../api/auth/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const auth = useAuth();

  if (auth) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PublicRoute;
