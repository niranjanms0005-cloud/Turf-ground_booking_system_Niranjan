import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { API_ENDPOINTS } from '../config/api.js';

// Icon Components
const PaymentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
    <line x1="6" y1="15" x2="10" y2="15"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
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

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const RefundIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

function MyPayments() {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchPayments = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(API_ENDPOINTS.payments.userPayments, {
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Success':
        return { backgroundColor: '#ECFDF5', color: '#059669' };
      case 'Refunded':
        return { backgroundColor: '#FEF3C7', color: '#D97706' };
      case 'Pending':
        return { backgroundColor: '#FEF2F2', color: '#DC2626' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const getMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'upi':
        return '📱';
      case 'card':
        return '💳';
      case 'online':
        return '🌐';
      default:
        return '💰';
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
    paymentCount: {
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
    paymentsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
    },
    paymentCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease',
    },
    paymentCardHover: {
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
    transactionInfo: {
      flex: 1,
    },
    transactionId: {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#7C5CFC',
      backgroundColor: '#F5F3FF',
      padding: '4px 10px',
      borderRadius: '6px',
      display: 'inline-block',
      marginBottom: '8px',
    },
    groundName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '4px',
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
      gap: '6px',
      padding: '8px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
    },
    cardBody: {
      padding: '20px 24px',
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '16px',
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
    amountValue: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#059669',
    },
    methodBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: '#F3F4F6',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#4B5563',
    },
    cardFooter: {
      padding: '16px 24px',
      backgroundColor: '#FAFAFA',
      borderTop: '1px solid #F3F4F6',
    },
    verificationInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: '#6B7280',
    },
    verifiedBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: '#ECFDF5',
      color: '#059669',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
    },
    refundedBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: '#FEF3C7',
      color: '#D97706',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
    },
    refundDetails: {
      marginTop: '8px',
      fontSize: '12px',
      color: '#9CA3AF',
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
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading your payments...</p>
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
              <PaymentIcon />
            </div>
            <div>
              <h1 style={styles.headerTitle}>
                <span style={styles.headerTitleAccent}>My</span> Payments
              </h1>
              <p style={styles.headerSubtitle}>Track all your payment transactions</p>
            </div>
          </div>
          <div style={styles.paymentCount}>
            <PaymentIcon />
            {payments.length} {payments.length === 1 ? 'Payment' : 'Payments'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.mainContainer}>
        <div style={styles.paymentsGrid} className="payments-grid">
          {payments.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <PaymentIcon />
              </div>
              <h3 style={styles.emptyTitle}>No Payments Yet</h3>
              <p style={styles.emptyText}>You haven't made any payments. Book a ground to get started!</p>
              <Link to="/grounds" style={styles.browseButton}>
                <CreditCardIcon />
                Browse Grounds
              </Link>
            </div>
          ) : (
            payments.map((p) => {
              const bookingDate = p.bookingID?.bookingDate
                ? new Date(p.bookingID.bookingDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A';
              const statusStyle = getStatusStyle(p.paymentStatus);

              return (
                <div
                  key={p._id}
                  style={{
                    ...styles.paymentCard,
                    ...(hoveredCard === p._id ? styles.paymentCardHover : {}),
                  }}
                  onMouseEnter={() => setHoveredCard(p._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card Header */}
                  <div style={styles.cardHeader}>
                    <div style={styles.transactionInfo}>
                      <div style={styles.transactionId}>{p.transactionID}</div>
                      <h3 style={styles.groundName}>
                        {p.bookingID?.groundID?.groundName || 'N/A'}
                      </h3>
                      <div style={styles.groundLocation}>
                        <LocationIcon />
                        {p.bookingID?.groundID?.location || 'N/A'}
                      </div>
                    </div>
                    <span style={{ ...styles.statusBadge, ...statusStyle }}>
                      {p.paymentStatus === 'Success' && <CheckIcon />}
                      {p.paymentStatus === 'Refunded' && <RefundIcon />}
                      {p.paymentStatus}
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
                        <span style={styles.detailValue}>{p.bookingID?.timeSlot || 'N/A'}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Method</span>
                        <span style={styles.methodBadge}>
                          {getMethodIcon(p.paymentMethod)} {p.paymentMethod}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Amount</span>
                        <span style={styles.amountValue}>₹{p.amount?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div style={styles.cardFooter}>
                    {p.paymentStatus === 'Refunded' ? (
                      <div>
                        <div style={styles.refundedBadge}>
                          <RefundIcon />
                          Refunded by {p.refundedBy?.name || 'N/A'}
                        </div>
                        <div style={styles.refundDetails}>
                          Refunded at: {p.updatedAt ? new Date(p.updatedAt).toLocaleString('en-IN') : 'N/A'}
                        </div>
                        <div style={styles.refundDetails}>
                          Payment Manager Email: {p.refundedBy?.email || 'N/A'}
                        </div>
                      </div>
                    ) : p.verifiedBy ? (
                      <div style={styles.verifiedBadge}>
                        <CheckIcon />
                        Verified by {p.verifiedBy.name} ({p.verifiedBy.email || 'N/A'})
                      </div>
                    ) : (
                      <div style={styles.verificationInfo}>
                        <UserIcon />
                        Pending verification (Payment manager email will appear after verification)
                      </div>
                    )}
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
        
        .payments-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 24px;
        }
        
        @media (max-width: 1200px) {
          .payments-grid {
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

export default MyPayments;

