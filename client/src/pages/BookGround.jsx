import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BookGround() {
  const { groundId } = useParams();
  const navigate = useNavigate();
  const { token, isLoggedIn } = useAuth();

  const [ground, setGround] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchGround = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/grounds/${groundId}`);
        const data = await res.json();
        if (res.ok) {
          setGround(data);
        } else {
          setError(data.message || 'Ground not found');
        }
      } catch (err) {
        setError('Failed to load ground details');
      } finally {
        setLoading(false);
      }
    };

    fetchGround();
  }, [groundId, isLoggedIn, navigate]);

  useEffect(() => {
    if (selectedDate && ground) {
      const checkAvailability = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/bookings/availability?groundId=${groundId}&bookingDate=${selectedDate}`
          );
          const data = await res.json();
          if (res.ok) {
            setAvailableSlots(data.data.availableSlots || []);
          }
        } catch (err) {
          setError('Failed to check availability');
        }
      };
      checkAvailability();
    }
  }, [selectedDate, groundId, ground]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      setError('Please select date and time slot');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groundID: groundId,
          bookingDate: selectedDate,
          timeSlot: selectedSlot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to create booking');
      } else {
        alert('Booking created successfully! Status: Pending');
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

  if (error && !ground) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!ground) {
    return <p>Ground not found</p>;
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Book Ground: {ground.groundName}</h2>
      <p><strong>Location:</strong> {ground.location}</p>
      <p><strong>Price per slot:</strong> ₹{ground.pricePerSlot}</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Select Date:
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot('');
              }}
              min={today}
              required
              style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', width: '100%' }}
            />
          </label>
        </div>

        {selectedDate && (
          <div style={{ marginBottom: '1rem' }}>
            <label>
              Select Time Slot:
              {availableSlots.length === 0 ? (
                <p style={{ color: 'red' }}>No slots available for this date</p>
              ) : (
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  required
                  style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', width: '100%' }}
                >
                  <option value="">Select a slot</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              )}
            </label>
          </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting || !selectedDate || !selectedSlot || availableSlots.length === 0}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}

export default BookGround;
