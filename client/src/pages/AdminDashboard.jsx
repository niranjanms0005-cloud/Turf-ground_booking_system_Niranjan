import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user, token, isLoggedIn } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'users'

  const isAdmin = isLoggedIn && user?.role === 'admin';

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data.data);
      } else {
        setError(data.message || 'Failed to load stats');
      }
    } catch (err) {
      setError('Something went wrong while loading stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.data || []);
      } else {
        setError(data.message || 'Failed to load users');
      }
    } catch (err) {
      setError('Something went wrong while loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadStats();
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        loadUsers();
        alert('User role updated successfully');
      } else {
        setError(data.message || 'Failed to update user role');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        loadUsers();
        loadStats();
        alert('User deleted successfully');
      } else {
        setError(data.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  if (!isLoggedIn) {
    return <p>Please login as Admin to access this page.</p>;
  }

  if (!isAdmin) {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h2>Admin Dashboard</h2>

      <div style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('stats')}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            backgroundColor: activeTab === 'stats' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'stats' ? 'white' : 'black',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          System Statistics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'users' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'users' ? 'white' : 'black',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          User Management
        </button>
        <button
          onClick={() => {
            loadStats();
            loadUsers();
          }}
          style={{
            padding: '0.5rem 1rem',
            marginLeft: '1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Refresh All
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {activeTab === 'stats' && (
        <div>
          <h3>System Statistics</h3>
          {loadingStats ? (
            <p>Loading statistics...</p>
          ) : stats ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                <h4>Users</h4>
                <p><strong>Total:</strong> {stats.users.total}</p>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                  <li>Regular Users: {stats.users.byRole.user}</li>
                  <li>Admins: {stats.users.byRole.admin}</li>
                  <li>Ground Managers: {stats.users.byRole.groundManager}</li>
                  <li>Payment Managers: {stats.users.byRole.paymentManager}</li>
                </ul>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                <h4>Grounds</h4>
                <p><strong>Total Active:</strong> {stats.grounds.total}</p>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                <h4>Bookings</h4>
                <p><strong>Total:</strong> {stats.bookings.total}</p>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                  <li>Pending: {stats.bookings.pending}</li>
                  <li>Approved: {stats.bookings.approved}</li>
                  <li>Rejected: {stats.bookings.rejected}</li>
                </ul>
                <p style={{ marginTop: '0.5rem' }}>
                  <strong>Payment Status:</strong> Paid: {stats.bookings.paid}, Unpaid: {stats.bookings.unpaid}
                </p>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                <h4>Payments</h4>
                <p><strong>Total:</strong> {stats.payments.total}</p>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                  <li>Verified: {stats.payments.verified}</li>
                  <li>Refunded: {stats.payments.refunded}</li>
                </ul>
              </div>
            </div>
          ) : (
            <p>No statistics available</p>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h3>User Management</h3>
          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Created</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const createdDate = new Date(u.createdAt).toLocaleDateString();
                  const isCurrentUser = u._id === user._id;
                  return (
                    <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '0.75rem' }}>
                        {u.name}
                        {isCurrentUser && <span style={{ color: '#007bff', marginLeft: '0.5rem' }}>(You)</span>}
                      </td>
                      <td style={{ padding: '0.75rem' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={isCurrentUser}
                          style={{
                            padding: '0.25rem 0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                          }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="groundManager">Ground Manager</option>
                          <option value="paymentManager">Payment Manager</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{createdDate}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {!isCurrentUser && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
