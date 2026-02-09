import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MyBookings() {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // draft reviews keyed by booking id
  const [drafts, setDrafts] = useState({});

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

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

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

  const startEdit = (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    setDrafts((d) => ({
      ...d,
      [bookingId]: {
        rating: booking?.review?.rating || 5,
        text: booking?.review?.text || '',
        editing: true,
      },
    }));
  };

  const cancelEdit = (bookingId) => {
    setDrafts((d) => ({ ...d, [bookingId]: { ...(d[bookingId] || {}), editing: false } }));
  };

  const setDraftField = (bookingId, field, value) => {
    setDrafts((d) => ({ ...d, [bookingId]: { ...(d[bookingId] || {}), [field]: value } }));
  };

  const submitReview = async (bookingId) => {
    const draft = drafts[bookingId];
    if (!draft || !draft.rating) return alert('Please select a rating');

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: draft.rating,
          text: draft.text,
          visible: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to submit review');
      } else {
        // refresh bookings to show the new review
        await fetchBookings();
        setDrafts((d) => ({ ...d, [bookingId]: { ...(d[bookingId] || {}), editing: false } }));
      }
    } catch (err) {
      alert('Something went wrong while submitting review');
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
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Review</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
              const draft = drafts[booking._id] || {};
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
                  <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                    {/* Display existing review if visible */}
                    {booking.review && booking.review.visible ? (
                      <div>
                        <div style={{ color: '#f39c12', fontSize: '1rem' }}>
                          {'★'.repeat(booking.review.rating || 0)}{' '}
                          <span style={{ color: '#666', fontSize: '0.85rem' }}>
                            ({booking.review.rating})
                          </span>
                        </div>
                        {booking.review.text && <div style={{ marginTop: '0.25rem' }}>{booking.review.text}</div>}
                        <div style={{ marginTop: '0.25rem' }}>
                          <button onClick={() => startEdit(booking._id)} style={{ fontSize: '0.85rem' }}>
                            Edit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <button onClick={() => startEdit(booking._id)} style={{ fontSize: '0.85rem' }}>
                          Add Review
                        </button>
                      </div>
                    )}

                    {/* Editing form */}
                    {draft.editing && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ marginBottom: '0.25rem' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              onClick={() => setDraftField(booking._id, 'rating', s)}
                              style={{
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.1rem',
                                color: s <= (draft.rating || 5) ? '#f39c12' : '#ddd',
                              }}
                              aria-label={`${s} star`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <div>
                          <textarea
                            value={draft.text || ''}
                            onChange={(e) => setDraftField(booking._id, 'text', e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '0.4rem', marginBottom: '0.25rem' }}
                          />
                        </div>
                        <div>
                          <button
                            onClick={() => submitReview(booking._id)}
                            style={{
                              padding: '0.35rem 0.6rem',
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              marginRight: '0.5rem',
                              cursor: 'pointer',
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => cancelEdit(booking._id)}
                            style={{
                              padding: '0.35rem 0.6rem',
                              backgroundColor: '#6c757d',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
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
