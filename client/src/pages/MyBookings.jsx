import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MyBookings() {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch('http://localhost:5000/api/bookings/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to load bookings');
        } else {
          setBookings(data.data || []);
        }
      } catch (err) {
        setError('Something went wrong while loading bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, isLoggedIn, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      case 'Pending':
        return 'orange';
      default:
        return 'black';
    }
  };

  if (loading) {
    return <p>Loading your bookings...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>You have no bookings yet. <Link to="/grounds">Browse grounds</Link> to make a booking.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Ground</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Location</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Time Slot</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
              return (
                <tr key={booking._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{booking.groundID?.groundName || 'N/A'}</td>
                  <td style={{ padding: '0.75rem' }}>{booking.groundID?.location || 'N/A'}</td>
                  <td style={{ padding: '0.75rem' }}>{bookingDate}</td>
                  <td style={{ padding: '0.75rem' }}>{booking.timeSlot}</td>
                  <td style={{ padding: '0.75rem' }}>₹{booking.groundID?.pricePerSlot || 'N/A'}</td>
                  <td style={{ padding: '0.75rem', color: getStatusColor(booking.status) }}>
                    <strong>{booking.status}</strong>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {booking.paymentStatus === 'Paid' ? (
                      <span style={{ color: 'green' }}>Paid</span>
                    ) : (
                      <div>
                        <span style={{ color: 'orange', marginRight: '0.5rem' }}>Unpaid</span>
                        <Link
                          to={`/payment/${booking._id}`}
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#28a745',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                          }}
                        >
                          Pay Now
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyBookings;
