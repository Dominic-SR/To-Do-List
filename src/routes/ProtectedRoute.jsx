// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/context/AuthContext'; // Recommended: Use Auth Context

const ProtectedRoute = () => {
  // Use state/context instead of raw localStorage so state changes trigger re-renders
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Prevent flash while checking auth token
  }

  if (!isAuthenticated) {
    // Save current location so you can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;