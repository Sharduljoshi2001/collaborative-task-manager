import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // showing loading text while auth check is in progress
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if user is not authenticated redirecting to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // if authenticated rendering the other  routes
  return <Outlet />;
};

export default ProtectedRoute;