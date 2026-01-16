import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function PaymentManagerDashboard() {
  const { user, token, isLoggedIn } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPaymentManager = isLoggedIn && (user?.role === 'paymentManager' || user?.role === 'admin');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const loadPayments = async () => {
    if (!isPaymentManager) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/payments', {
        headers: authHeaders,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to load payments');
      } else {
        setPayments(data.data || []);
      }
    } catch (err) {
      setError('Something went wrong while loading payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaymentManager]);

  const handleVerify = async (paymentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/payments/${paymentId}/verify`, {
        method: 'PUT',
        headers: authHeaders,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to verify payment');
      } else {
        loadPayments();
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm('Are you sure you want to refund this payment?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/payments/${paymentId}/refund`, {
        method: 'PUT',
        headers: authHeaders,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to refund payment');
      } else {
        loadPayments();
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success':
        return 'green';
      case 'Failed':
        return 'red';
      case 'Refunded':
        return 'orange';
      default:
        return 'black';
    }
  };

  if (!isLoggedIn) {
    return <p>Please login as Payment Manager or Admin to manage payments.</p>;
  }

  if (!isPaymentManager) {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h2>Payment Manager Dashboard</h2>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={loadPayments} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
          Refresh Payments
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Transaction ID</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>User</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Ground</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Time Slot</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Amount</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Method</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Verified By</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const paymentDate = payment.bookingID?.bookingDate
                ? new Date(payment.bookingID.bookingDate).toLocaleDateString()
                : 'N/A';
              return (
                <tr key={payment._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {payment.transactionID}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {payment.bookingID?.userID?.name || 'N/A'}
                    <br />
                    <small style={{ color: '#666' }}>{payment.bookingID?.userID?.email || ''}</small>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {payment.bookingID?.groundID?.groundName || 'N/A'}
                    <br />
                    <small style={{ color: '#666' }}>{payment.bookingID?.groundID?.location || ''}</small>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{paymentDate}</td>
                  <td style={{ padding: '0.75rem' }}>{payment.bookingID?.timeSlot || 'N/A'}</td>
                  <td style={{ padding: '0.75rem' }}>₹{payment.amount}</td>
                  <td style={{ padding: '0.75rem' }}>{payment.paymentMethod}</td>
                  <td style={{ padding: '0.75rem', color: getStatusColor(payment.paymentStatus) }}>
                    <strong>{payment.paymentStatus}</strong>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {payment.verifiedBy ? (
                      <div>
                        {payment.verifiedBy.name || 'N/A'}
                        <br />
                        <small style={{ color: '#666' }}>
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : ''}
                        </small>
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>Not verified</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {payment.paymentStatus === 'Success' && !payment.verifiedBy && (
                      <button
                        onClick={() => handleVerify(payment._id)}
                        style={{
                          marginRight: '0.5rem',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Verify
                      </button>
                    )}
                    {payment.paymentStatus === 'Success' && (
                      <button
                        onClick={() => handleRefund(payment._id)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Refund
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
  );
}

export default PaymentManagerDashboard;
