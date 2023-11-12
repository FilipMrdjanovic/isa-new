import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../api/auth/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // Change to an array of strings
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const auth = useAuth();

    if (!auth) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(auth.auth.role!)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}

export default ProtectedRoute;
