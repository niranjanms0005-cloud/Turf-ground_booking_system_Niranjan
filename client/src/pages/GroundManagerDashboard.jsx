import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function GroundManagerDashboard() {
  const { user, token, isLoggedIn } = useAuth();
  const [myGrounds, setMyGrounds] = useState([]);
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState({});
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    groundName: '',
    location: '',
    pricePerSlot: '',
    availableSlots: '',
  });
  const [editingId, setEditingId] = useState(null);

  const isManager = isLoggedIn && (user?.role === 'groundManager' || user?.role === 'admin');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const loadMyGrounds = async () => {
    if (!isManager) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/grounds/manager/my-grounds', {
        headers: authHeaders,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to load your grounds');
      } else {
        setMyGrounds(data);
      }
    } catch (err) {
      setError('Something went wrong while loading your grounds');
    } finally {
      setLoading(false);
    }
  };

  const loadBookingsForGround = async (groundId) => {
    setLoadingBookings((prev) => ({ ...prev, [groundId]: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/ground/${groundId}`, {
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setBookings((prev) => ({ ...prev, [groundId]: data.data || [] }));
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoadingBookings((prev) => ({ ...prev, [groundId]: false }));
    }
  };

  const handleApprove = async (bookingId, groundId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/approve`, {
        method: 'PUT',
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        loadBookingsForGround(groundId);
      } else {
        setError(data.message || 'Failed to approve booking');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleReject = async (bookingId, groundId) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/reject`, {
        method: 'PUT',
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        loadBookingsForGround(groundId);
      } else {
        setError(data.message || 'Failed to reject booking');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  useEffect(() => {
    loadMyGrounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManager]);

  useEffect(() => {
    // Load bookings for all grounds when grounds are loaded
    myGrounds.forEach((ground) => {
      loadBookingsForGround(ground._id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myGrounds.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      groundName: '',
      location: '',
      pricePerSlot: '',
      availableSlots: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      groundName: form.groundName,
      location: form.location,
      pricePerSlot: Number(form.pricePerSlot),
      availableSlots: form.availableSlots
        ? form.availableSlots.split(',').map((s) => s.trim())
        : [],
    };

    const url = editingId
      ? `http://localhost:5000/api/grounds/${editingId}`
      : 'http://localhost:5000/api/grounds';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to save ground');
      } else {
        resetForm();
        loadMyGrounds();
      }
    } catch (err) {
      setError('Something went wrong while saving ground');
    }
  };

  const handleEdit = (ground) => {
    setEditingId(ground._id);
    setForm({
      groundName: ground.groundName,
      location: ground.location,
      pricePerSlot: ground.pricePerSlot,
      availableSlots: (ground.availableSlots || []).join(', '),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete (deactivate) this ground?')) return;

    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/grounds/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to delete ground');
      } else {
        loadMyGrounds();
      }
    } catch (err) {
      setError('Something went wrong while deleting ground');
    }
  };

  if (!isLoggedIn) {
    return <p>Please login as Ground Manager or Admin to manage grounds.</p>;
  }

  if (!isManager) {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <div>
      <h2>Ground Manager Dashboard</h2>

      <h3>{editingId ? 'Edit Ground' : 'Create Ground'}</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Ground Name</label>
          <input
            name="groundName"
            value={form.groundName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Price Per Slot (₹)</label>
          <input
            name="pricePerSlot"
            type="number"
            value={form.pricePerSlot}
            onChange={handleChange}
            required
            min="0"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Available Slots (comma separated, e.g. 09:00-10:00, 10:00-11:00)</label>
          <input
            name="availableSlots"
            value={form.availableSlots}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginRight: '0.5rem' }}>
          {editingId ? 'Update Ground' : 'Create Ground'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h3>My Grounds</h3>
      {loading ? (
        <p>Loading your grounds...</p>
      ) : myGrounds.length === 0 ? (
        <p>You do not have any grounds yet.</p>
      ) : (
        <div>
          {myGrounds.map((ground) => (
            <div
              key={ground._id}
              style={{
                marginBottom: '2rem',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            >
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>{ground.groundName}</strong> - {ground.location} - ₹{ground.pricePerSlot}
                <br />
                Slots: {(ground.availableSlots || []).join(', ')}
                <br />
                <button onClick={() => handleEdit(ground)} style={{ marginRight: '0.5rem', marginTop: '0.5rem' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(ground._id)} style={{ marginTop: '0.5rem' }}>
                  Delete
                </button>
                <button
                  onClick={() => loadBookingsForGround(ground._id)}
                  style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}
                >
                  Refresh Bookings
                </button>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <h4>Bookings for {ground.groundName}</h4>
                {loadingBookings[ground._id] ? (
                  <p>Loading bookings...</p>
                ) : !bookings[ground._id] || bookings[ground._id].length === 0 ? (
                  <p>No bookings yet.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>User</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Time Slot</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Payment</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings[ground._id].map((booking) => {
                        const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
                        return (
                          <tr key={booking._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '0.5rem' }}>
                              {booking.userID?.name || 'N/A'} ({booking.userID?.email || 'N/A'})
                            </td>
                            <td style={{ padding: '0.5rem' }}>{bookingDate}</td>
                            <td style={{ padding: '0.5rem' }}>{booking.timeSlot}</td>
                            <td style={{ padding: '0.5rem' }}>
                              <strong
                                style={{
                                  color:
                                    booking.status === 'Approved'
                                      ? 'green'
                                      : booking.status === 'Rejected'
                                      ? 'red'
                                      : 'orange',
                                }}
                              >
                                {booking.status}
                              </strong>
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                              {booking.paymentStatus === 'Paid' ? (
                                <span style={{ color: 'green' }}>Paid</span>
                              ) : (
                                <span style={{ color: 'orange' }}>Unpaid</span>
                              )}
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                              {booking.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(booking._id, ground._id)}
                                    style={{
                                      marginRight: '0.5rem',
                                      backgroundColor: 'green',
                                      color: 'white',
                                      border: 'none',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(booking._id, ground._id)}
                                    style={{
                                      backgroundColor: 'red',
                                      color: 'white',
                                      border: 'none',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroundManagerDashboard;


