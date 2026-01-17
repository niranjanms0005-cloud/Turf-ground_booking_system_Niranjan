import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component that enforces role-based access control
 * @param {Object} props
 * @param {React.ReactElement} props.children - The component to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user role is not in allowedRoles, redirect to their dashboard
  if (!allowedRoles.includes(user?.role)) {
    // Get the appropriate dashboard for the user's role
    const getDashboardPath = (role) => {
      switch (role) {
        case 'admin':
          return '/admin';
        case 'groundManager':
          return '/ground-manager';
        case 'paymentManager':
          return '/payment-manager';
        case 'user':
          return '/my-bookings';
        default:
          return '/login';
      }
    };

    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  // Authorized - render the protected component
  return children;
}

export default ProtectedRoute;
