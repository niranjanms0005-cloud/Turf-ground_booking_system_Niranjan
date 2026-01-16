import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#007bff' }}>
        Turf Booking System
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        Book your favorite sports grounds and turfs with ease
      </p>

      {isLoggedIn ? (
        <div>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Welcome back, <strong>{user?.name}</strong>!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/grounds"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              Browse Grounds
            </Link>
            <Link
              to="/my-bookings"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              My Bookings
            </Link>
            {user?.role === 'groundManager' && (
              <Link
                to="/ground-manager"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#ffc107',
                  color: '#000',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block',
                }}
              >
                Ground Manager Dashboard
              </Link>
            )}
            {user?.role === 'paymentManager' && (
              <Link
                to="/payment-manager"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block',
                }}
              >
                Payment Manager Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block',
                }}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Get started by creating an account or logging in
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              to="/register"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              Register
            </Link>
            <Link
              to="/login"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              Login
            </Link>
            <Link
              to="/grounds"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              Browse Grounds
            </Link>
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '1rem' }}>Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'left' }}>
          <div>
            <h3>🎯 Easy Booking</h3>
            <p>Browse available grounds and book your preferred time slots</p>
          </div>
          <div>
            <h3>💳 Online Payment</h3>
            <p>Secure payment processing for all your bookings</p>
          </div>
          <div>
            <h3>📅 Real-time Availability</h3>
            <p>Check slot availability in real-time before booking</p>
          </div>
          <div>
            <h3>👥 Role-Based Access</h3>
            <p>Different dashboards for users, managers, and admins</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
