import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Authenticated layout used for all protected routes (after login).
// Contains role-specific navbar and renders dashboards/pages via <Outlet />.
function AuthenticatedLayout() {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
        {/* Role-specific navigation, only after login */}
        {isLoggedIn && user?.role === 'user' && (
          <>
            <Link to="/grounds" style={{ marginRight: '1rem' }}>Grounds</Link>
            <Link to="/my-bookings" style={{ marginRight: '1rem' }}>My Bookings</Link>
          </>
        )}
        {isLoggedIn && user?.role === 'groundManager' && (
          <Link to="/ground-manager" style={{ marginRight: '1rem' }}>Ground Manager</Link>
        )}
        {isLoggedIn && user?.role === 'paymentManager' && (
          <Link to="/payment-manager" style={{ marginRight: '1rem' }}>Payment Manager</Link>
        )}
        {isLoggedIn && user?.role === 'admin' && (
          <Link to="/admin" style={{ marginRight: '1rem' }}>Admin</Link>
        )}

        {isLoggedIn && (
          <>
            <span style={{ marginRight: '1rem' }}>
              Logged in as: {user?.name} ({user?.role})
            </span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>

      {/* Protected dashboards and feature pages render here */}
      <Outlet />
    </div>
  );
}

export default AuthenticatedLayout;

