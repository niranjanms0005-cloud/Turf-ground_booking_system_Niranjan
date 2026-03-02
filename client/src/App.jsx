import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import GroundList from './pages/GroundList.jsx';
import GroundManagerDashboard from './pages/GroundManagerDashboard.jsx';
import BookGround from './pages/BookGround.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Payment from './pages/Payment.jsx';
import PaymentManagerDashboard from './pages/PaymentManagerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import MyPayments from './pages/MyPayments.jsx';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  const { user, isLoggedIn, logout } = useAuth();

  // Themed navbar: single bar with purple gradient, only when logged in
  const themedNavStyles = {
    nav: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '16px 24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    },
    left: { display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
    link: {
      color: 'rgba(255,255,255,0.95)',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '15px',
    },
    userInfo: { color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginRight: '12px' },
    logoutBtn: {
      background: 'rgba(255,255,255,0.2)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.4)',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
    },
    guestLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    guestLink: {
      color: 'rgba(255,255,255,0.95)',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '15px',
    },
  };

  return (
      <div>
      {isLoggedIn ? (
        <nav style={themedNavStyles.nav}>
          <div style={themedNavStyles.left}>
            <Link to="/" style={themedNavStyles.link}>Home</Link>
            {user?.role === 'user' && (
              <>
                <Link to="/grounds" style={themedNavStyles.link}>Grounds</Link>
                <Link to="/my-bookings" style={themedNavStyles.link}>My Bookings</Link>
                <Link to="/my-payments" style={themedNavStyles.link}>My Payments</Link>
              </>
            )}
            {user?.role === 'groundManager' && (
              <Link to="/ground-manager" style={themedNavStyles.link}>Ground Manager</Link>
            )}
            {user?.role === 'paymentManager' && (
              <Link to="/payment-manager" style={themedNavStyles.link}>Payment Manager</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" style={themedNavStyles.link}>Admin</Link>
            )}
            <Link to="/profile" style={themedNavStyles.link}>Profile</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={themedNavStyles.userInfo}>
              {user?.name} ({user?.role})
            </span>
            <button type="button" style={themedNavStyles.logoutBtn} onClick={logout}>Logout</button>
          </div>
        </nav>
      ) : (
        <nav style={themedNavStyles.nav}>
          <Link to="/" style={themedNavStyles.link}>Home</Link>
          <div style={themedNavStyles.guestLinks}>
            <Link to="/login" style={themedNavStyles.guestLink}>Login</Link>
            <Link to="/register" style={themedNavStyles.guestLink}>Register</Link>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        {/* User routes: only accessible after login as regular user */}
        <Route
          path="/grounds"
          element={
            isLoggedIn && user?.role === 'user'
              ? <GroundList />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/book/:groundId"
          element={
            isLoggedIn && user?.role === 'user'
              ? <BookGround />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/my-bookings"
          element={
            isLoggedIn && user?.role === 'user'
              ? <MyBookings />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/payment/:bookingId"
          element={
            isLoggedIn && user?.role === 'user'
              ? <Payment />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/my-payments"
          element={
            isLoggedIn && user?.role === 'user'
              ? <MyPayments />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            isLoggedIn ? <Profile /> : <Navigate to="/login" replace />
          }
        />
        {/* Role-specific dashboards: only accessible after login with correct role */}
        <Route
          path="/ground-manager"
          element={
            isLoggedIn && user?.role === 'groundManager'
              ? <GroundManagerDashboard />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/payment-manager"
          element={
            isLoggedIn && user?.role === 'paymentManager'
              ? <PaymentManagerDashboard />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin"
          element={
            isLoggedIn && user?.role === 'admin'
              ? <AdminDashboard />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
      </div>
  );
}

export default App;
