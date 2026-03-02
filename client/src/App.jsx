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

  return (
      <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>

        {/* Show navigation links based on role, only after login */}
        {isLoggedIn && user?.role === 'user' && (
          <>
            <Link to="/grounds" style={{ marginRight: '1rem' }}>Grounds</Link>
            <Link to="/my-bookings" style={{ marginRight: '1rem' }}>My Bookings</Link>
            <Link to="/my-payments" style={{ marginRight: '1rem' }}>My Payments</Link>
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

        {isLoggedIn ? (
          <>
            <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
            <span style={{ marginRight: '1rem' }}>
              Logged in as: {user?.name} ({user?.role})
            </span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

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
