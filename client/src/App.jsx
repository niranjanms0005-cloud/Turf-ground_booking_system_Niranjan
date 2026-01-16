import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import GroundList from './pages/GroundList.jsx';
import GroundManagerDashboard from './pages/GroundManagerDashboard.jsx';
import BookGround from './pages/BookGround.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Payment from './pages/Payment.jsx';
import PaymentManagerDashboard from './pages/PaymentManagerDashboard.jsx';

function App() {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/grounds" style={{ marginRight: '1rem' }}>Grounds</Link>
        <Link to="/ground-manager" style={{ marginRight: '1rem' }}>Ground Manager</Link>
        <Link to="/payment-manager" style={{ marginRight: '1rem' }}>Payment Manager</Link>
        <Link to="/admin" style={{ marginRight: '1rem' }}>Admin</Link>

        {isLoggedIn ? (
          <>
            <Link to="/my-bookings" style={{ marginRight: '1rem' }}>My Bookings</Link>
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
        <Route path="/" element={<h1>Frontend Running</h1>} />
        <Route path="/grounds" element={<GroundList />} />
        <Route path="/book/:groundId" element={<BookGround />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/payment/:bookingId" element={<Payment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ground-manager" element={<GroundManagerDashboard />} />
        <Route path="/payment-manager" element={<PaymentManagerDashboard />} />
        <Route path="/admin" element={<div>Admin Dashboard (coming later)</div>} />
      </Routes>
    </div>
  );
}

export default App;
