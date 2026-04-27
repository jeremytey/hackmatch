// protected route component to guard routes based on authentication and user roles
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface ProtectedRouteProps {
    allowedRoles?: ('USER' | 'ADMIN')[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, _hasHydrated } = useAuthStore();
    const location = useLocation();

    if (!_hasHydrated) {
        return null; // or <LoadingSpinner />
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.userRole)) {
        return <Navigate to="/" replace />;
    }

    // If user is authenticated and has the required role, render the child routes
    return <Outlet />;
};