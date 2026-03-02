import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icon Components
const BookingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const FieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
  </svg>
);

function MyBookings() {
  const { token, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/bookings/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to load bookings');
      } else {
        setBookings(data.data || []);
      }
    } catch (err) {
      setError('Something went wrong while loading bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    fetchBookings();
  }, [token, isLoggedIn, navigate]);

  const startEdit = (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    setDrafts((d) => ({
      ...d,
      [bookingId]: {
        rating: booking?.review?.rating || 5,
        text: booking?.review?.text || '',
        editing: true,
      },
    }));
  };

  const cancelEdit = (bookingId) => {
    setDrafts((d) => ({ ...d, [bookingId]: { ...(d[bookingId] || {}), editing: false } }));
  };

  const setDraftField = (bookingId, field, value) => {
    setDrafts((d) => ({ ...d, [bookingId]: { ...(d[bookingId] || {}), [field]: value } }));
  };

  const submitReview = async (bookingId) => {
    const draft = drafts[bookingId];
    if (!draft || !draft.rating) return alert('Please select a rating');

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: draft.rating,
          text: draft.text,
          visible: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to submit review');
      } else {
        await fetchBookings();
        setDrafts((d) => ({ ...d, [bookingId]: { ...(d[bookingId] || {}), editing: false } }));
      }
    } catch (err) {
      alert('Something went wrong while submitting review');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return { backgroundColor: '#ECFDF5', color: '#059669' };
      case 'Rejected':
        return { backgroundColor: '#FEF2F2', color: '#DC2626' };
      case 'Pending':
        return { backgroundColor: '#FFFBEB', color: '#D97706' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  // Styles
  const styles = {
    pageWrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '0',
    },
    headerBar: {
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      padding: '20px 40px',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    headerIcon: {
      width: '48px',
      height: '48px',
      backgroundColor: '#F5F3FF',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: '26px',
      fontWeight: '700',
      color: '#1F2937',
      letterSpacing: '-0.5px',
      margin: 0,
    },
    headerTitleAccent: {
      color: '#7C5CFC',
    },
    headerSubtitle: {
      fontSize: '14px',
      color: '#6B7280',
      marginTop: '2px',
    },
    bookingCount: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#F5F3FF',
      borderRadius: '20px',
      fontSize: '14px',
      color: '#7C5CFC',
      fontWeight: '600',
    },
    mainContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '32px 40px 60px',
    },
    bookingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
    },
    bookingCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease',
    },
    bookingCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 40px rgba(124, 92, 252, 0.12)',
    },
    cardHeader: {
      padding: '20px 24px',
      borderBottom: '1px solid #F3F4F6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    groundInfo: {
      flex: 1,
    },
    groundName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '6px',
    },
    groundLocation: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      color: '#6B7280',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
    },
    cardBody: {
      padding: '20px 24px',
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginBottom: '20px',
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    detailLabel: {
      fontSize: '12px',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    detailValue: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1F2937',
    },
    priceValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#059669',
    },
    cardFooter: {
      padding: '16px 24px',
      backgroundColor: '#FAFAFA',
      borderTop: '1px solid #F3F4F6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paymentSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    paidBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      backgroundColor: '#ECFDF5',
      color: '#059669',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
    },
    unpaidBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 16px',
      backgroundColor: '#FFFBEB',
      color: '#D97706',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
    },
    payNowButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: '#22C55E',
      color: '#FFFFFF',
      textDecoration: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      border: 'none',
      cursor: 'pointer',
    },
    payNowButtonHover: {
      backgroundColor: '#16A34A',
      transform: 'translateY(-1px)',
    },
    reviewSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    reviewDisplay: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    reviewStars: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
    },
    reviewText: {
      fontSize: '13px',
      color: '#6B7280',
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    reviewButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      backgroundColor: '#F5F3FF',
      color: '#7C5CFC',
      border: 'none',
      borderRadius: '10px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    reviewButtonHover: {
      backgroundColor: '#EDE9FE',
    },
    reviewModal: {
      marginTop: '16px',
      padding: '20px',
      backgroundColor: '#F9FAFB',
      borderRadius: '16px',
      border: '1px solid #E5E7EB',
    },
    reviewModalTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '16px',
    },
    starRating: {
      display: 'flex',
      gap: '4px',
      marginBottom: '16px',
    },
    starButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      transition: 'transform 0.15s ease',
    },
    starButtonHover: {
      transform: 'scale(1.2)',
    },
    reviewTextarea: {
      width: '100%',
      padding: '14px',
      fontSize: '14px',
      border: '1.5px solid #E5E7EB',
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',
      outline: 'none',
      resize: 'vertical',
      minHeight: '80px',
      marginBottom: '16px',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease',
    },
    reviewActions: {
      display: 'flex',
      gap: '12px',
    },
    saveButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 20px',
      backgroundColor: '#7C5CFC',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    saveButtonHover: {
      backgroundColor: '#6B4FE0',
    },
    cancelButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#F3F4F6',
      color: '#6B7280',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    cancelButtonHover: {
      backgroundColor: '#E5E7EB',
    },
    loadingWrapper: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    loadingCard: {
      backgroundColor: '#FFFFFF',
      padding: '48px',
      borderRadius: '24px',
      textAlign: 'center',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    loadingSpinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #F3F4F6',
      borderTop: '4px solid #7C5CFC',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 16px',
    },
    loadingText: {
      fontSize: '16px',
      color: '#6B7280',
    },
    errorCard: {
      backgroundColor: '#FFFFFF',
      padding: '48px',
      borderRadius: '24px',
      textAlign: 'center',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      maxWidth: '400px',
    },
    errorText: {
      fontSize: '16px',
      color: '#DC2626',
      marginTop: '16px',
    },
    emptyState: {
      gridColumn: '1 / -1',
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      padding: '80px 40px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    },
    emptyIcon: {
      width: '80px',
      height: '80px',
      backgroundColor: '#F5F3FF',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
    },
    emptyTitle: {
      fontSize: '22px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '8px',
    },
    emptyText: {
      fontSize: '15px',
      color: '#6B7280',
      marginBottom: '24px',
    },
    browseButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '14px 28px',
      backgroundColor: '#7C5CFC',
      color: '#FFFFFF',
      textDecoration: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    checkIcon: {
      width: '16px',
      height: '16px',
    },
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading your bookings...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.errorCard}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      {/* Header */}
      <header style={styles.headerBar}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>
              <BookingIcon />
            </div>
            <div>
              <h1 style={styles.headerTitle}>
                <span style={styles.headerTitleAccent}>My</span> Bookings
              </h1>
              <p style={styles.headerSubtitle}>Manage your ground reservations and reviews</p>
            </div>
          </div>
          <div style={styles.bookingCount}>
            <BookingIcon />
            {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.mainContainer}>
        <div style={styles.bookingsGrid} className="bookings-grid">
          {bookings.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <BookingIcon />
              </div>
              <h3 style={styles.emptyTitle}>No Bookings Yet</h3>
              <p style={styles.emptyText}>You haven't made any bookings. Start exploring available grounds!</p>
              <Link to="/grounds" style={styles.browseButton}>
                <FieldIcon />
                Browse Grounds
              </Link>
            </div>
          ) : (
            bookings.map((booking) => {
              const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              const draft = drafts[booking._id] || {};
              const statusStyle = getStatusStyle(booking.status);

              return (
                <div
                  key={booking._id}
                  style={{
                    ...styles.bookingCard,
                    ...(hoveredCard === booking._id ? styles.bookingCardHover : {}),
                  }}
                  onMouseEnter={() => setHoveredCard(booking._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card Header */}
                  <div style={styles.cardHeader}>
                    <div style={styles.groundInfo}>
                      <h3 style={styles.groundName}>{booking.groundID?.groundName || 'N/A'}</h3>
                      <div style={styles.groundLocation}>
                        <LocationIcon />
                        {booking.groundID?.location || 'N/A'}
                      </div>
                    </div>
                    <span style={{ ...styles.statusBadge, ...statusStyle }}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div style={styles.cardBody}>
                    <div style={styles.detailsGrid}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>
                          <CalendarIcon /> Date
                        </span>
                        <span style={styles.detailValue}>{bookingDate}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>
                          <ClockIcon /> Time Slot
                        </span>
                        <span style={styles.detailValue}>{booking.timeSlot}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Amount</span>
                        <span style={styles.priceValue}>
                          ₹{(booking.amount != null && booking.amount > 0)
                            ? Number(booking.amount).toLocaleString('en-IN')
                            : (booking.timeSlots?.length
                                ? (booking.timeSlots.length * (booking.groundID?.pricePerSlot || 0)).toLocaleString('en-IN')
                                : (booking.groundID?.pricePerSlot ?? 'N/A'))}
                        </span>
                      </div>
                    </div>

                    {/* Review Section (when editing) */}
                    {draft.editing && (
                      <div style={styles.reviewModal}>
                        <div style={styles.reviewModalTitle}>
                          {booking.review?.visible ? 'Edit Your Review' : 'Write a Review'}
                        </div>
                        <div style={styles.starRating}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              onClick={() => setDraftField(booking._id, 'rating', s)}
                              style={{
                                ...styles.starButton,
                                ...(hoveredButton === `star-${booking._id}-${s}` ? styles.starButtonHover : {}),
                              }}
                              onMouseEnter={() => setHoveredButton(`star-${booking._id}-${s}`)}
                              onMouseLeave={() => setHoveredButton(null)}
                              aria-label={`${s} star`}
                            >
                              <StarIcon filled={s <= (draft.rating || 5)} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={draft.text || ''}
                          onChange={(e) => setDraftField(booking._id, 'text', e.target.value)}
                          placeholder="Share your experience..."
                          style={styles.reviewTextarea}
                        />
                        <div style={styles.reviewActions}>
                          <button
                            onClick={() => submitReview(booking._id)}
                            style={{
                              ...styles.saveButton,
                              ...(hoveredButton === `save-${booking._id}` ? styles.saveButtonHover : {}),
                            }}
                            onMouseEnter={() => setHoveredButton(`save-${booking._id}`)}
                            onMouseLeave={() => setHoveredButton(null)}
                          >
                            Save Review
                          </button>
                          <button
                            onClick={() => cancelEdit(booking._id)}
                            style={{
                              ...styles.cancelButton,
                              ...(hoveredButton === `cancel-${booking._id}` ? styles.cancelButtonHover : {}),
                            }}
                            onMouseEnter={() => setHoveredButton(`cancel-${booking._id}`)}
                            onMouseLeave={() => setHoveredButton(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div style={styles.cardFooter}>
                    <div style={styles.paymentSection}>
                      {booking.paymentStatus === 'Paid' ? (
                        <span style={styles.paidBadge}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Paid
                        </span>
                      ) : (
                        <>
                          <span style={styles.unpaidBadge}>Unpaid</span>
                          <Link
                            to={`/payment/${booking._id}`}
                            style={{
                              ...styles.payNowButton,
                              ...(hoveredButton === `pay-${booking._id}` ? styles.payNowButtonHover : {}),
                            }}
                            onMouseEnter={() => setHoveredButton(`pay-${booking._id}`)}
                            onMouseLeave={() => setHoveredButton(null)}
                          >
                            Pay Now
                          </Link>
                        </>
                      )}
                    </div>

                    <div style={styles.reviewSection}>
                      {booking.review && booking.review.visible && !draft.editing ? (
                        <div style={styles.reviewDisplay}>
                          <div style={styles.reviewStars}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <StarIcon key={s} filled={s <= booking.review.rating} />
                            ))}
                          </div>
                          <button
                            onClick={() => startEdit(booking._id)}
                            style={{
                              ...styles.reviewButton,
                              ...(hoveredButton === `edit-${booking._id}` ? styles.reviewButtonHover : {}),
                            }}
                            onMouseEnter={() => setHoveredButton(`edit-${booking._id}`)}
                            onMouseLeave={() => setHoveredButton(null)}
                          >
                            <EditIcon />
                            Edit
                          </button>
                        </div>
                      ) : !draft.editing ? (
                        <button
                          onClick={() => startEdit(booking._id)}
                          style={{
                            ...styles.reviewButton,
                            ...(hoveredButton === `add-${booking._id}` ? styles.reviewButtonHover : {}),
                          }}
                          onMouseEnter={() => setHoveredButton(`add-${booking._id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                        >
                          <PlusIcon />
                          Add Review
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Responsive Styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 24px;
        }
        
        @media (max-width: 1200px) {
          .bookings-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 600px) {
          header {
            padding: 16px 20px !important;
          }
          main {
            padding: 20px 16px 40px !important;
          }
        }
        
        textarea:focus {
          border-color: #7C5CFC;
          box-shadow: 0 0 0 3px rgba(124, 92, 252, 0.1);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>
    </div>
  );
}

export default MyBookings;
