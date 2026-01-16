import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function GroundList() {
  const { isLoggedIn } = useAuth();
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGrounds = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch('http://localhost:5000/api/grounds');
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to load grounds');
        } else {
          setGrounds(data);
        }
      } catch (err) {
        setError('Something went wrong while loading grounds');
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

  if (loading) {
    return <p>Loading grounds...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!grounds.length) {
    return <p>No grounds available.</p>;
  }

  return (
    <div>
      <h2>Available Grounds</h2>
      <ul>
        {grounds.map((ground) => (
          <li key={ground._id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
            <div>
              <strong>{ground.groundName}</strong> - {ground.location} - ₹{ground.pricePerSlot} per slot
            </div>
            {isLoggedIn ? (
              <Link
                to={`/book/${ground._id}`}
                style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                }}
              >
                Book Now
              </Link>
            ) : (
              <p style={{ marginTop: '0.5rem', color: '#666' }}>
                <Link to="/login">Login</Link> to book this ground
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroundList;


