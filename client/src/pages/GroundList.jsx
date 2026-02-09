import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function GroundList() {
  const { isLoggedIn } = useAuth();
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters / search state
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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
          setGrounds(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError('Something went wrong while loading grounds');
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

  const uniqueLocations = useMemo(() => {
    const s = new Set(grounds.map((g) => g.location).filter(Boolean));
    return Array.from(s);
  }, [grounds]);

  const filteredGrounds = useMemo(() => {
    return grounds.filter((g) => {
      // Search by ground name
      if (search && !g.groundName.toLowerCase().includes(search.toLowerCase())) return false;
      // Filter by location
      if (locationFilter && g.location !== locationFilter) return false;
      // Filter by price
      if (minPrice && Number(g.pricePerSlot) < Number(minPrice)) return false;
      if (maxPrice && Number(g.pricePerSlot) > Number(maxPrice)) return false;
      return true;
    });
  }, [grounds, search, locationFilter, minPrice, maxPrice]);

  const resetFilters = () => {
    setSearch('');
    setLocationFilter('');
    setMinPrice('');
    setMaxPrice('');
  };

  if (loading) return <p>Loading grounds...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!grounds.length) return <p>No grounds available.</p>;

  return (
    <div>
      <h2>Available Grounds</h2>

      {/* Search & Filters */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by ground name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', flex: '1 1 240px' }}
        />

        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">All locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ padding: '0.5rem', width: '110px' }}
          min="0"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ padding: '0.5rem', width: '110px' }}
          min="0"
        />

        <button onClick={resetFilters} style={{ padding: '0.5rem 0.75rem' }}>
          Reset
        </button>
      </div>

      <ul>
        {filteredGrounds.length === 0 ? (
          <li>No grounds match your search/filters.</li>
        ) : (
          filteredGrounds.map((ground) => (
            <li
              key={ground._id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ minWidth: '160px' }}>
                {ground.photo ? (
                  <img
                    src={ground.photo}
                    alt={ground.groundName}
                    style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                ) : (
                  <div style={{ width: '160px', height: '110px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#999' }}>
                    No Photo
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div>
                  <strong>{ground.groundName}</strong> - {ground.location} - ₹{ground.pricePerSlot} per slot
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  {isLoggedIn ? (
                    <Link
                      to={`/book/${ground._id}`}
                      style={{
                        display: 'inline-block',
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
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default GroundList;


