import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import AuthenticatedLayout from './layouts/AuthenticatedLayout.jsx';
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

function App() {
  const { user, isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Public layout: Home, Login, Register */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Authenticated layout: all protected routes with role-specific navbar */}
      <Route element={<AuthenticatedLayout />}>
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
      </Route>
    </Routes>
  );
}

export default App;
