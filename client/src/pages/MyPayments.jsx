import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function MyPayments() {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchPayments = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/payments/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

    fetchPayments();
  }, [token, isLoggedIn, navigate]);

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h2>My Payments</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Transaction</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Ground</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Time Slot</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Amount</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Method</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const bookingDate = p.bookingID?.bookingDate ? new Date(p.bookingID.bookingDate).toLocaleDateString() : 'N/A';
              return (
                <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{p.transactionID}</td>
                  <td style={{ padding: '0.5rem' }}>
                    {p.bookingID?.groundID?.groundName || (p.bookingID?.groundID ? String(p.bookingID.groundID) : 'N/A')}
                  </td>
                  <td style={{ padding: '0.5rem' }}>{bookingDate}</td>
                  <td style={{ padding: '0.5rem' }}>{p.bookingID?.timeSlot || 'N/A'}</td>
                  <td style={{ padding: '0.5rem' }}>₹{p.amount}</td>
                  <td style={{ padding: '0.5rem' }}>{p.paymentMethod}</td>
                  <td style={{ padding: '0.5rem' }}>{p.paymentStatus}</td>
                  <td style={{ padding: '0.5rem' }}>
                    {p.paymentStatus === 'Refunded' ? (
                      <div>
                        <div>Refunded by: {p.verifiedBy?.name || 'N/A'}</div>
                        <div>Refunded at: {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : 'N/A'}</div>
                      </div>
                    ) : (
                      <div>
                        {p.verifiedBy ? (
                          <div>Verified by: {p.verifiedBy.name}</div>
                        ) : (
                          <div>Not verified</div>
                        )}
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

export default MyPayments;

