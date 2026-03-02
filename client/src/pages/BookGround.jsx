import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Get slots that overlap [fromTime, toTime]. Includes any slot that overlaps the range (e.g. 09:30–12:30 includes 09:00–10:00 and 12:00–13:00)
const getSlotsInRange = (allSlots, fromTime, toTime) => {
  if (!fromTime || !toTime || fromTime >= toTime) return [];
  const parseSlot = (s) => {
    const [start, end] = (s || '').split('-').map((x) => x.trim());
    return { start, end };
  };
  const sorted = [...(allSlots || [])].sort((a, b) => parseSlot(a).start.localeCompare(parseSlot(b).start));
  return sorted.filter((slotStr) => {
    const { start, end } = parseSlot(slotStr);
    return start < toTime && fromTime < end;
  });
};

function BookGround() {
  const { groundId } = useParams();
  const navigate = useNavigate();
  const { token, isLoggedIn } = useAuth();

  const [ground, setGround] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingMode, setBookingMode] = useState('slot'); // 'slot' | 'range'
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
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

  const fromNorm = timeFrom.trim().substring(0, 5);
  const toNorm = timeTo.trim().substring(0, 5);
  const rangeSlots = useMemo(() => {
    if (!ground || !fromNorm || !toNorm || fromNorm >= toNorm) return [];
    return getSlotsInRange(ground.availableSlots || [], fromNorm, toNorm);
  }, [ground, fromNorm, toNorm]);
  const rangeSlotsAvailable = useMemo(() => {
    return rangeSlots.filter((s) => availableSlots.includes(s));
  }, [rangeSlots, availableSlots]);
  const rangeTotal = rangeSlotsAvailable.length * (ground?.pricePerSlot || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      setError('Please select date');
      return;
    }
    if (bookingMode === 'slot') {
      if (!selectedSlot) {
        setError('Please select a time slot');
        return;
      }
    } else {
      if (!fromNorm || !toNorm || fromNorm >= toNorm) {
        setError('Please select a valid From and To time');
        return;
      }
      if (rangeSlotsAvailable.length === 0) {
        setError('No available slots in the selected time range. Try a different range or date.');
        return;
      }
    }

    setSubmitting(true);
    setError('');

    const body =
      bookingMode === 'slot'
        ? { groundID: groundId, bookingDate: selectedDate, timeSlot: selectedSlot }
        : { groundID: groundId, bookingDate: selectedDate, timeFrom: fromNorm, timeTo: toNorm };

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
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

  if (ground.isActive === false) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <h2>Book Ground: {ground.groundName}</h2>
        <p><strong>Location:</strong> {ground.location}</p>
        <div style={{ padding: '1rem', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', marginTop: '1rem' }}>
          <p style={{ margin: 0, color: '#92400E', fontWeight: '600' }}>Under maintenance</p>
          <p style={{ margin: '0.5rem 0 0 0', color: '#B45309' }}>This ground is currently unavailable for booking. Please check back later.</p>
        </div>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/grounds" style={{ color: '#007bff' }}>← Back to Grounds</Link>
        </p>
      </div>
    );
  }

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
                setTimeFrom('');
                setTimeTo('');
              }}
              min={today}
              required
              style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', width: '100%' }}
            />
          </label>
        </div>

        {selectedDate && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ marginRight: '1rem', fontWeight: '600' }}>Booking option:</span>
              <label style={{ marginRight: '1rem' }}>
                <input
                  type="radio"
                  name="mode"
                  checked={bookingMode === 'slot'}
                  onChange={() => {
                    setBookingMode('slot');
                    setTimeFrom('');
                    setTimeTo('');
                  }}
                />
                Select from available slots
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  checked={bookingMode === 'range'}
                  onChange={() => {
                    setBookingMode('range');
                    setSelectedSlot('');
                  }}
                />
                Custom time range (from – to)
              </label>
            </div>

            {bookingMode === 'slot' && (
              <div style={{ marginBottom: '1rem' }}>
                <label>
                  Select Time Slot:
                  {availableSlots.length === 0 ? (
                    <p style={{ color: 'red' }}>No slots available for this date</p>
                  ) : (
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', width: '100%' }}
                    >
                      <option value="">Select a slot</option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot} — ₹{ground.pricePerSlot}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
              </div>
            )}

            {bookingMode === 'range' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  From:
                  <input
                    type="time"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
                  />
                </label>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  To:
                  <input
                    type="time"
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                    style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
                  />
                </label>
                {fromNorm && toNorm && fromNorm < toNorm && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f5f5f5', borderRadius: '6px', fontSize: '14px' }}>
                    {rangeSlotsAvailable.length === 0 ? (
                      <p style={{ color: '#b45309', margin: 0 }}>
                        No available slots in this range for the selected date.
                        {rangeSlots.length > 0 && ' Some slots may already be booked.'}
                      </p>
                    ) : (
                      <>
                        <p style={{ margin: '0 0 0.25rem 0' }}>
                          <strong>Slots selected:</strong> {rangeSlotsAvailable.join(', ')}
                        </p>
                        <p style={{ margin: 0 }}>
                          <strong>Total ({rangeSlotsAvailable.length} slot{rangeSlotsAvailable.length !== 1 ? 's' : ''}):</strong> ₹{rangeTotal}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          type="submit"
          disabled={
            submitting ||
            !selectedDate ||
            (bookingMode === 'slot' && (!selectedSlot || availableSlots.length === 0)) ||
            (bookingMode === 'range' && (rangeSlotsAvailable.length === 0 || !fromNorm || !toNorm || fromNorm >= toNorm))
          }
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
