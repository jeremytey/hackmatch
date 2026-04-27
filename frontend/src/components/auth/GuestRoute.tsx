// protect routes like login/register from authenticated users (e.g., redirect to home if already logged in)
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const GuestRoute = () => {
    const { user, _hasHydrated } = useAuthStore();

    if (!_hasHydrated) {
        return null; // or <LoadingSpinner />
    }

    // If user is authenticated, redirect to home page
    if (user) {
        return <Navigate to="/" replace />;
    }

    // If user is not authenticated, render the child routes (e.g., login or register)
    return <Outlet />;
};
