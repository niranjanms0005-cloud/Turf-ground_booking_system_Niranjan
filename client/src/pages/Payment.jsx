import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { token, isLoggedIn } = useAuth();

  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/bookings/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          const foundBooking = data.data?.find((b) => b._id === bookingId);
          if (foundBooking) {
            setBooking(foundBooking);
            if (foundBooking.paymentStatus === 'Paid') {
              setError('This booking is already paid');
            }
          } else {
            setError('Booking not found');
          }
        } else {
          setError(data.message || 'Failed to load booking');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, token, isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (booking?.paymentStatus === 'Paid') {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingID: bookingId,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Payment failed');
      } else {
        alert(`Payment successful! Transaction ID: ${data.data.transactionID}`);
        navigate('/my-bookings');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error && !booking) {
    return (
      <div style={{ padding: '2rem' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate('/my-bookings')}>Go to My Bookings</button>
      </div>
    );
  }

  if (!booking) {
    return <p>Booking not found</p>;
  }

  const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
  const amount = booking.groundID?.pricePerSlot || 0;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Make Payment</h2>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h3>Booking Details</h3>
        <p><strong>Ground:</strong> {booking.groundID?.groundName || 'N/A'}</p>
        <p><strong>Location:</strong> {booking.groundID?.location || 'N/A'}</p>
        <p><strong>Date:</strong> {bookingDate}</p>
        <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <p><strong>Amount:</strong> ₹{amount}</p>
      </div>

      {booking.paymentStatus === 'Paid' ? (
        <div style={{ padding: '1rem', backgroundColor: '#d4edda', borderRadius: '4px' }}>
          <p style={{ color: 'green' }}>This booking is already paid.</p>
          <button onClick={() => navigate('/my-bookings')} style={{ marginTop: '1rem' }}>
            Go to My Bookings
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>
              Payment Method:
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', width: '100%' }}
              >
                <option value="Online">Online Payment</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
            <p><strong>Note:</strong> This is a simulated payment. No actual money will be charged.</p>
            <p><strong>Total Amount:</strong> ₹{amount}</p>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
            }}
          >
            {submitting ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        </form>
      )}
    </div>
  );
}

export default Payment;
