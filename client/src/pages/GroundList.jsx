import { useEffect, useState } from 'react';

function GroundList() {
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
          <li key={ground._id} style={{ marginBottom: '1rem' }}>
            <strong>{ground.groundName}</strong> - {ground.location} - ₹{ground.pricePerSlot} per slot
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroundList;


