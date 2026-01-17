import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { getDashboardPath, getNavLinks } from './utils/roleUtils';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import GroundList from './pages/GroundList.jsx';
import GroundManagerDashboard from './pages/GroundManagerDashboard.jsx';
import BookGround from './pages/BookGround.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Payment from './pages/Payment.jsx';
import PaymentManagerDashboard from './pages/PaymentManagerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Home from './pages/Home.jsx';

// Component to redirect logged-in users to their dashboard
function HomeRoute() {
  const { isLoggedIn, user } = useAuth();
  
  if (isLoggedIn) {
    const dashboardPath = getDashboardPath(user?.role);
    return <Navigate to={dashboardPath} replace />;
  }
  
  return <Home />;
}

// Component to redirect logged-in users away from login/register
function AuthRoute({ children }) {
  const { isLoggedIn, user } = useAuth();
  
  if (isLoggedIn) {
    const dashboardPath = getDashboardPath(user?.role);
    return <Navigate to={dashboardPath} replace />;
  }
  
  return children;
}

function App() {
  const { user, isLoggedIn, logout } = useAuth();
  
  // Get navigation links based on role
  const navLinks = isLoggedIn ? getNavLinks(user?.role) : [
    { to: '/', label: 'Home' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ];

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
        {navLinks.map((link) => (
          <Link 
            key={link.to} 
            to={link.to} 
            style={{ marginRight: '1rem' }}
          >
            {link.label}
          </Link>
        ))}

        {isLoggedIn && (
          <>
            <span style={{ marginRight: '1rem' }}>
              Logged in as: {user?.name} ({user?.role})
            </span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomeRoute />} />
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } 
        />

        {/* User routes - only accessible to users */}
        <Route
          path="/grounds"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <GroundList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:groundId"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <BookGround />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:bookingId"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* Ground Manager route - only accessible to groundManager */}
        <Route
          path="/ground-manager"
          element={
            <ProtectedRoute allowedRoles={['groundManager']}>
              <GroundManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Payment Manager route - only accessible to paymentManager */}
        <Route
          path="/payment-manager"
          element={
            <ProtectedRoute allowedRoles={['paymentManager']}>
              <PaymentManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin route - only accessible to admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect to dashboard or home */}
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to={getDashboardPath(user?.role)} replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
