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
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

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
      // Debug bookings response to inspect presence of user/ground fields
      console.debug(`Bookings for ground ${groundId}:`, data);
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
    setPhotoPreview('');
    setPhotoFile(null);
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
      photo: photoPreview || '',
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
    setPhotoPreview(ground.photo || '');
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

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  const toggleSelectAll = () => {
    if (!selectAll) {
      const allIds = myGrounds.map((g) => g._id);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return alert('No grounds selected');
    if (!window.confirm(`Are you sure you want to deactivate ${selectedIds.length} selected ground(s)?`)) return;
    try {
      const promises = selectedIds.map((id) =>
        fetch(`http://localhost:5000/api/grounds/${id}`, { method: 'DELETE', headers: authHeaders })
      );
      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map((r) => r.json().catch(() => ({}))));
      const failed = responses.map((r, i) => (!r.ok ? results[i]?.message || 'Failed' : null)).filter(Boolean);
      if (failed.length) {
        alert(`Some deletions failed: ${failed.join('; ')}`);
      }
      // refresh and clear selection
      setSelectedIds([]);
      setSelectAll(false);
      loadMyGrounds();
    } catch (err) {
      alert('Error deleting selected grounds');
    }
  };

  const enterSelectionMode = () => {
    setIsSelectionMode(true);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
    setSelectAll(false);
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
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) {
                setPhotoFile(null);
                setPhotoPreview('');
                return;
              }
              setPhotoFile(file);
              const reader = new FileReader();
              reader.onload = () => setPhotoPreview(reader.result);
              reader.readAsDataURL(file);
            }}
            style={{ width: '100%', padding: '0.25rem' }}
          />
          {photoPreview && (
            <div style={{ marginTop: '0.5rem' }}>
              <img src={photoPreview} alt="preview" style={{ maxWidth: '200px', borderRadius: '4px' }} />
            </div>
          )}
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

      <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        My Grounds
        <div>
          {!isSelectionMode ? (
            <button onClick={enterSelectionMode} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
              Delete
            </button>
          ) : (
            <div>
              <label style={{ marginRight: '0.75rem' }}>
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} /> Select all
              </label>
              <button onClick={handleDeleteSelected} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.4rem 0.6rem', borderRadius: '4px', marginRight: '0.5rem' }}>
                Delete Selected
              </button>
              <button onClick={exitSelectionMode} style={{ padding: '0.35rem 0.6rem' }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </h3>
      {loading ? (
        <p>Loading your grounds...</p>
      ) : myGrounds.length === 0 ? (
        <p>You do not have any grounds yet.</p>
      ) : (
        <div>
          {myGrounds.map((ground) => (
            <div key={ground._id} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              {isSelectionMode && (
                <div style={{ marginRight: '0.5rem' }}>
                  <input type="checkbox" checked={selectedIds.includes(ground._id)} onChange={() => toggleSelect(ground._id)} />
                </div>
              )}
              <div style={{ minWidth: '220px' }}>
                {ground.photo ? (
                  <img src={ground.photo} alt={ground.groundName} style={{ width: '220px', height: '140px', objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                  <div style={{ width: '220px', height: '140px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#999' }}>
                    No Photo
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
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
                  <button onClick={() => loadBookingsForGround(ground._id)} style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}>
                    Refresh Bookings
                  </button>
                </div>

                {/* Reviews */}
                <div style={{ marginTop: '1rem' }}>
                  <h4>Reviews for {ground.groundName}</h4>
                  {(!bookings[ground._id] || bookings[ground._id].length === 0) ? (
                    <p>No reviews yet.</p>
                  ) : (
                    (() => {
                      const reviews = (bookings[ground._id] || [])
                        .map((b) => ({ booking: b, review: b.review }))
                        .filter((r) => r.review && r.review.visible);
                      if (reviews.length === 0) return <p>No reviews yet.</p>;
                      return (
                        <div style={{ marginBottom: '0.75rem' }}>
                          {reviews.map(({ booking, review }) => (
                            <div key={booking._id} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                              <div style={{ color: '#f39c12', fontSize: '1rem' }}>
                                {'★'.repeat(review.rating || 0)} <span style={{ color: '#666', fontSize: '0.85rem' }}>({review.rating})</span>
                              </div>
                              {review.text && <div style={{ marginTop: '0.25rem' }}>{review.text}</div>}
                              <div style={{ marginTop: '0.25rem', color: '#666', fontSize: '0.85rem' }}>
                                By: {booking.userID?.name || 'User'} on {review.reviewedAt ? new Date(review.reviewedAt).toLocaleDateString() : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  )}
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
                                {booking.userID?.name || (booking.userID ? String(booking.userID) : 'N/A')} ({booking.userID?.email || (booking.userID ? String(booking.userID) : 'N/A')})
                              </td>
                              <td style={{ padding: '0.5rem' }}>{bookingDate}</td>
                              <td style={{ padding: '0.5rem' }}>{booking.timeSlot}</td>
                              <td style={{ padding: '0.5rem' }}>
                                <strong style={{ color: booking.status === 'Approved' ? 'green' : booking.status === 'Rejected' ? 'red' : 'orange' }}>
                                  {booking.status}
                                </strong>
                              </td>
                              <td style={{ padding: '0.5rem' }}>{booking.paymentStatus === 'Paid' ? <span style={{ color: 'green' }}>Paid</span> : <span style={{ color: 'orange' }}>Unpaid</span>}</td>
                              <td style={{ padding: '0.5rem' }}>
                                {booking.status === 'Pending' && (
                                  <>
                                    <button onClick={() => handleApprove(booking._id, ground._id)} style={{ marginRight: '0.5rem' }}>
                                      Approve
                                    </button>
                                    <button onClick={() => handleReject(booking._id, ground._id)}>Reject</button>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroundManagerDashboard;


