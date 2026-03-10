import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api.js';
import { useNavigate } from 'react-router-dom';

// Icon Components
const RevenueIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const RefundIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>
);

const SuccessIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const PendingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

function PaymentManagerDashboard() {
  const { user, token, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('analytics');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const isPaymentManager = isLoggedIn && (user?.role === 'paymentManager' || user?.role === 'admin');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const loadDashboardStats = async () => {
    if (!isPaymentManager) return;
    setLoadingStats(true);
    try {
      const res = await fetch(API_ENDPOINTS.payments.dashboardStats, {
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setDashboardStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadPayments = async () => {
    if (!isPaymentManager) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_ENDPOINTS.payments.allPayments, {
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
    loadDashboardStats();
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaymentManager]);

  const handleVerify = async (paymentId) => {
    try {
      const res = await fetch(API_ENDPOINTS.payments.verify(paymentId), {
        method: 'PUT',
        headers: authHeaders,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to verify payment');
      } else {
        loadPayments();
        loadDashboardStats();
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm('Are you sure you want to refund this payment?')) return;

    try {
      const res = await fetch(API_ENDPOINTS.payments.refund(paymentId), {
        method: 'PUT',
        headers: authHeaders,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to refund payment');
      } else {
        loadPayments();
        loadDashboardStats();
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const refreshAll = () => {
    loadDashboardStats();
    loadPayments();
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
      padding: '16px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1F2937',
      letterSpacing: '-0.5px',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    headerTitleAccent: {
      color: '#7C5CFC',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    userBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 16px',
      backgroundColor: '#F8F5FC',
      borderRadius: '30px',
      border: '1px solid #E8E0F0',
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#7C5CFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF',
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1F2937',
    },
    userRole: {
      fontSize: '12px',
      color: '#6B7280',
      textTransform: 'capitalize',
    },
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: '#FFFFFF',
      color: '#6B7280',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },
    logoutButtonHover: {
      backgroundColor: '#FEF2F2',
      borderColor: '#FECACA',
      color: '#DC2626',
    },
    mainContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 40px 60px',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      marginBottom: '32px',
    },
    summaryCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    },
    summaryCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 40px rgba(124, 92, 252, 0.12)',
    },
    summaryIconWrapper: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: '4px',
      letterSpacing: '-0.5px',
    },
    summaryLabel: {
      fontSize: '14px',
      color: '#6B7280',
      fontWeight: '500',
    },
    contentCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 28px',
      borderBottom: '1px solid #F3F4F6',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      margin: 0,
    },
    tabGroup: {
      display: 'flex',
      gap: '8px',
    },
    tabButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },
    tabButtonActive: {
      backgroundColor: '#7C5CFC',
      color: '#FFFFFF',
    },
    tabButtonInactive: {
      backgroundColor: '#F8F5FC',
      color: '#6B7280',
    },
    refreshButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: '#22C55E',
      color: '#FFFFFF',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },
    refreshButtonHover: {
      backgroundColor: '#16A34A',
      transform: 'translateY(-1px)',
    },
    cardContent: {
      padding: '28px',
    },
    errorMessage: {
      padding: '16px 20px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: '12px',
      color: '#DC2626',
      fontSize: '14px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    loadingText: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#6B7280',
      fontSize: '16px',
    },
    emptyText: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#9CA3AF',
      fontSize: '16px',
    },
    distributionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '24px',
    },
    distributionCard: {
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid',
    },
    distributionValue: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '4px',
    },
    distributionLabel: {
      fontSize: '14px',
      fontWeight: '500',
    },
    rulesCard: {
      backgroundColor: '#F8F5FC',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #E8E0F0',
    },
    rulesTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '16px',
      margin: 0,
    },
    rulesList: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
    rulesItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 0',
      fontSize: '14px',
      color: '#4B5563',
      borderBottom: '1px solid #E8E0F0',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0',
      minWidth: '1100px',
    },
    tableHeader: {
      backgroundColor: '#F8F5FC',
    },
    tableHeaderCell: {
      padding: '16px 20px',
      textAlign: 'left',
      fontSize: '13px',
      fontWeight: '600',
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '1px solid #E8E0F0',
    },
    tableRow: {
      transition: 'background-color 0.15s ease',
    },
    tableRowHover: {
      backgroundColor: '#FAFAFA',
    },
    tableRowRefunded: {
      opacity: 0.7,
      backgroundColor: '#FFFBF5',
    },
    tableCell: {
      padding: '18px 20px',
      fontSize: '14px',
      color: '#1F2937',
      borderBottom: '1px solid #F3F4F6',
      verticalAlign: 'top',
    },
    transactionId: {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: '12px',
      color: '#6B7280',
      backgroundColor: '#F3F4F6',
      padding: '4px 8px',
      borderRadius: '6px',
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    userInfoName: {
      fontWeight: '500',
      color: '#1F2937',
    },
    userInfoEmail: {
      fontSize: '12px',
      color: '#9CA3AF',
    },
    amountCell: {
      textAlign: 'right',
      fontWeight: '600',
      fontSize: '15px',
      color: '#1F2937',
    },
    refundAmount: {
      fontSize: '12px',
      color: '#F97316',
      marginTop: '4px',
    },
    distributionCell: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    distributionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
    },
    distributionDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
    },
    statusSuccess: {
      backgroundColor: '#ECFDF5',
      color: '#059669',
    },
    statusRefunded: {
      backgroundColor: '#FFF7ED',
      color: '#EA580C',
    },
    statusPending: {
      backgroundColor: '#FFFBEB',
      color: '#D97706',
    },
    statusFailed: {
      backgroundColor: '#FEF2F2',
      color: '#DC2626',
    },
    distributedBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      marginTop: '6px',
      fontSize: '11px',
      color: '#059669',
    },
    actionButton: {
      padding: '8px 16px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      width: '100%',
      marginBottom: '6px',
    },
    verifyButton: {
      backgroundColor: '#7C5CFC',
      color: '#FFFFFF',
    },
    verifyButtonHover: {
      backgroundColor: '#6B4EE6',
    },
    refundButton: {
      backgroundColor: '#FFF7ED',
      color: '#EA580C',
      border: '1px solid #FED7AA',
    },
    refundButtonHover: {
      backgroundColor: '#FFEDD5',
    },
    disabledButton: {
      backgroundColor: '#F3F4F6',
      color: '#9CA3AF',
      cursor: 'not-allowed',
    },
    accessDenied: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    accessDeniedCard: {
      backgroundColor: '#FFFFFF',
      padding: '48px',
      borderRadius: '24px',
      textAlign: 'center',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      maxWidth: '400px',
    },
    accessDeniedTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '12px',
    },
    accessDeniedText: {
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '24px',
    },
    loginButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#7C5CFC',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
    },
  };

  // Access denied states
  if (!isLoggedIn) {
    return (
      <div style={styles.accessDenied}>
        <div style={styles.accessDeniedCard}>
          <div style={{ marginBottom: '20px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 style={styles.accessDeniedTitle}>Authentication Required</h2>
          <p style={styles.accessDeniedText}>Please login as Payment Manager or Admin to access this dashboard.</p>
          <button style={styles.loginButton} onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isPaymentManager) {
    return (
      <div style={styles.accessDenied}>
        <div style={styles.accessDeniedCard}>
          <div style={{ marginBottom: '20px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
          </div>
          <h2 style={styles.accessDeniedTitle}>Access Denied</h2>
          <p style={styles.accessDeniedText}>You do not have permission to access this page. Only Payment Managers and Admins can view this dashboard.</p>
          <button style={styles.loginButton} onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Success':
        return styles.statusSuccess;
      case 'Refunded':
        return styles.statusRefunded;
      case 'Pending':
        return styles.statusPending;
      case 'Failed':
        return styles.statusFailed;
      default:
        return {};
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Header Bar */}
      <header style={styles.headerBar}>
        <h1 style={styles.headerTitle}>
          <span style={styles.headerTitleAccent}>Payment</span> Dashboard
        </h1>
        <div style={styles.headerRight}>
          <div style={styles.userBadge}>
            <div style={styles.userAvatar}>
              <UserIcon />
            </div>
            <div>
              <div style={styles.userName}>{user?.name || 'User'}</div>
              <div style={styles.userRole}>{user?.role || 'Manager'}</div>
            </div>
          </div>
          <button
            style={{
              ...styles.logoutButton,
              ...(hoveredButton === 'logout' ? styles.logoutButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton('logout')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={handleLogout}
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.mainContainer}>
        {/* Summary Cards */}
        <div style={styles.summaryGrid} className="summary-grid">
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#ECFDF5' }}>
              <RevenueIcon />
            </div>
            <div style={styles.summaryValue}>
              ₹{dashboardStats?.totalRevenue?.toLocaleString() || '0'}
            </div>
            <div style={styles.summaryLabel}>Total Revenue</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#FFF7ED' }}>
              <RefundIcon />
            </div>
            <div style={styles.summaryValue}>
              ₹{dashboardStats?.totalRefundedAmount?.toLocaleString() || '0'}
            </div>
            <div style={styles.summaryLabel}>Total Refunded</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#F5F3FF' }}>
              <SuccessIcon />
            </div>
            <div style={styles.summaryValue}>
              {dashboardStats?.totalSuccessfulTransactions || 0}
            </div>
            <div style={styles.summaryLabel}>Successful Transactions</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#FFFBEB' }}>
              <PendingIcon />
            </div>
            <div style={styles.summaryValue}>
              {dashboardStats?.pendingVerificationCount || 0}
            </div>
            <div style={styles.summaryLabel}>Pending Verification</div>
          </div>
        </div>

        {/* Content Card */}
        <div style={styles.contentCard}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              {activeTab === 'analytics' ? 'Financial Analytics' : 'Transactions'}
            </h2>
            <div style={styles.tabGroup}>
              <button
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'analytics' ? styles.tabButtonActive : styles.tabButtonInactive),
                }}
                onClick={() => setActiveTab('analytics')}
              >
                <ChartIcon />
                Analytics
              </button>
              <button
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'transactions' ? styles.tabButtonActive : styles.tabButtonInactive),
                }}
                onClick={() => setActiveTab('transactions')}
              >
                <ListIcon />
                Transactions
              </button>
              <button
                style={{
                  ...styles.refreshButton,
                  ...(hoveredButton === 'refresh' ? styles.refreshButtonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton('refresh')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={refreshAll}
              >
                <RefreshIcon />
                Refresh
              </button>
            </div>
          </div>

          <div style={styles.cardContent}>
            {error && (
              <div style={styles.errorMessage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                {loadingStats ? (
                  <p style={styles.loadingText}>Loading analytics...</p>
                ) : dashboardStats ? (
                  <>
                    {/* Revenue Distribution */}
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>
                      Revenue Distribution
                    </h3>
                    <div style={styles.distributionGrid} className="distribution-grid">
                      <div style={{ ...styles.distributionCard, backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }}>
                        <div style={{ ...styles.distributionValue, color: '#059669' }}>
                          ₹{dashboardStats.distribution?.totalGroundManagerShare?.toLocaleString() || '0'}
                        </div>
                        <div style={{ ...styles.distributionLabel, color: '#047857' }}>
                          Ground Managers ({dashboardStats.percentages?.groundManager || 90}%)
                        </div>
                      </div>
                      <div style={{ ...styles.distributionCard, backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
                        <div style={{ ...styles.distributionValue, color: '#2563EB' }}>
                          ₹{dashboardStats.distribution?.totalPaymentManagerShare?.toLocaleString() || '0'}
                        </div>
                        <div style={{ ...styles.distributionLabel, color: '#1D4ED8' }}>
                          Payment Managers ({dashboardStats.percentages?.paymentManager || 5}%)
                        </div>
                      </div>
                      <div style={{ ...styles.distributionCard, backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }}>
                        <div style={{ ...styles.distributionValue, color: '#EA580C' }}>
                          ₹{dashboardStats.distribution?.totalAdminShare?.toLocaleString() || '0'}
                        </div>
                        <div style={{ ...styles.distributionLabel, color: '#C2410C' }}>
                          Admin/Platform ({dashboardStats.percentages?.admin || 5}%)
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }} className="additional-stats">
                      <div style={{ ...styles.distributionCard, backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
                        <div style={{ ...styles.distributionValue, color: '#D97706', fontSize: '24px' }}>
                          ₹{dashboardStats.totalRetainedFromRefunds?.toLocaleString() || '0'}
                        </div>
                        <div style={{ ...styles.distributionLabel, color: '#B45309' }}>
                          Retained from Refunds (20%)
                        </div>
                      </div>
                      <div style={{ ...styles.distributionCard, backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' }}>
                        <div style={{ ...styles.distributionValue, color: '#4B5563', fontSize: '24px' }}>
                          {dashboardStats.refundedCount || 0}
                        </div>
                        <div style={{ ...styles.distributionLabel, color: '#6B7280' }}>
                          Total Refunded Payments
                        </div>
                      </div>
                    </div>

                    {/* Distribution Rules */}
                    <div style={styles.rulesCard}>
                      <h4 style={{ ...styles.rulesTitle, marginBottom: '16px' }}>Distribution Rules</h4>
                      <ul style={styles.rulesList}>
                        <li style={styles.rulesItem}>
                          <span style={{ ...styles.distributionDot, backgroundColor: '#059669' }}></span>
                          Ground Manager receives <strong>{dashboardStats.percentages?.groundManager || 90}%</strong> of each payment
                        </li>
                        <li style={styles.rulesItem}>
                          <span style={{ ...styles.distributionDot, backgroundColor: '#2563EB' }}></span>
                          Payment Manager receives <strong>{dashboardStats.percentages?.paymentManager || 5}%</strong> of each payment
                        </li>
                        <li style={styles.rulesItem}>
                          <span style={{ ...styles.distributionDot, backgroundColor: '#EA580C' }}></span>
                          Platform/Admin receives <strong>{dashboardStats.percentages?.admin || 5}%</strong> commission
                        </li>
                        <li style={{ ...styles.rulesItem, borderBottom: 'none' }}>
                          <span style={{ ...styles.distributionDot, backgroundColor: '#D97706' }}></span>
                          On refund: User gets <strong>{dashboardStats.percentages?.refundToUser || 80}%</strong> back, <strong>{dashboardStats.percentages?.retainedOnRefund || 20}%</strong> retained
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <p style={styles.emptyText}>No analytics data available</p>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div>
                {loading ? (
                  <p style={styles.loadingText}>Loading transactions...</p>
                ) : payments.length === 0 ? (
                  <p style={styles.emptyText}>No payments found.</p>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead style={styles.tableHeader}>
                        <tr>
                          <th style={styles.tableHeaderCell}>Transaction ID</th>
                          <th style={styles.tableHeaderCell}>User</th>
                          <th style={styles.tableHeaderCell}>Ground</th>
                          <th style={styles.tableHeaderCell}>Date</th>
                          <th style={{ ...styles.tableHeaderCell, textAlign: 'right' }}>Amount</th>
                          <th style={{ ...styles.tableHeaderCell, textAlign: 'center' }}>Distribution</th>
                          <th style={styles.tableHeaderCell}>Status</th>
                          <th style={styles.tableHeaderCell}>Verified By</th>
                          <th style={styles.tableHeaderCell}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment, index) => {
                          const paymentDate = payment.bookingID?.bookingDate
                            ? new Date(payment.bookingID.bookingDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'N/A';
                          const gmShare = payment.groundManagerShare || (payment.amount * 0.90).toFixed(2);
                          const pmShare = payment.paymentManagerShare || (payment.amount * 0.05).toFixed(2);
                          const adminShare = payment.adminShare || (payment.amount * 0.05).toFixed(2);
                          const isRefunded = payment.paymentStatus === 'Refunded';

                          return (
                            <tr
                              key={payment._id}
                              style={{
                                ...styles.tableRow,
                                ...(hoveredRow === index && !isRefunded ? styles.tableRowHover : {}),
                                ...(isRefunded ? styles.tableRowRefunded : {}),
                              }}
                              onMouseEnter={() => setHoveredRow(index)}
                              onMouseLeave={() => setHoveredRow(null)}
                            >
                              <td style={styles.tableCell}>
                                <span style={styles.transactionId}>{payment.transactionID}</span>
                              </td>
                              <td style={styles.tableCell}>
                                <div style={styles.userInfo}>
                                  <span style={styles.userInfoName}>
                                    {payment.bookingID?.userID?.name || 'N/A'}
                                  </span>
                                  <span style={styles.userInfoEmail}>
                                    {payment.bookingID?.userID?.email || ''}
                                  </span>
                                </div>
                              </td>
                              <td style={styles.tableCell}>
                                <div style={styles.userInfo}>
                                  <span style={styles.userInfoName}>
                                    {payment.bookingID?.groundID?.groundName || 'N/A'}
                                  </span>
                                  <span style={styles.userInfoEmail}>
                                    {payment.bookingID?.groundID?.location || ''}
                                  </span>
                                </div>
                              </td>
                              <td style={styles.tableCell}>
                                <div style={styles.userInfo}>
                                  <span style={styles.userInfoName}>{paymentDate}</span>
                                  <span style={styles.userInfoEmail}>{payment.bookingID?.timeSlot || ''}</span>
                                </div>
                              </td>
                              <td style={{ ...styles.tableCell, ...styles.amountCell }}>
                                ₹{Number(payment.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                {isRefunded && payment.refundAmount && (
                                  <div style={styles.refundAmount}>
                                    Refund: ₹{Number(payment.refundAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                  </div>
                                )}
                              </td>
                              <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                                {payment.distributed || isRefunded ? (
                                  <div style={styles.distributionCell}>
                                    <div style={styles.distributionItem}>
                                      <span style={{ ...styles.distributionDot, backgroundColor: '#059669' }}></span>
                                      <span style={{ color: '#059669' }}>GM: ₹{gmShare}</span>
                                    </div>
                                    <div style={styles.distributionItem}>
                                      <span style={{ ...styles.distributionDot, backgroundColor: '#2563EB' }}></span>
                                      <span style={{ color: '#2563EB' }}>PM: ₹{pmShare}</span>
                                    </div>
                                    <div style={styles.distributionItem}>
                                      <span style={{ ...styles.distributionDot, backgroundColor: '#EA580C' }}></span>
                                      <span style={{ color: '#EA580C' }}>Admin: ₹{adminShare}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Not distributed</span>
                                )}
                              </td>
                              <td style={styles.tableCell}>
                                <span style={{ ...styles.statusBadge, ...getStatusBadgeStyle(payment.paymentStatus) }}>
                                  {payment.paymentStatus}
                                </span>
                                {payment.distributed && payment.paymentStatus === 'Success' && (
                                  <div style={styles.distributedBadge}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    Distributed
                                  </div>
                                )}
                              </td>
                              <td style={styles.tableCell}>
                                {isRefunded ? (
                                  <div style={styles.userInfo}>
                                    <span style={{ ...styles.userInfoEmail, fontStyle: 'italic' }}>Refunded by:</span>
                                    <span style={styles.userInfoName}>
                                      {payment.refundedBy?.name || payment.verifiedBy?.name || 'N/A'}
                                    </span>
                                  </div>
                                ) : payment.verifiedBy ? (
                                  <span style={{ fontSize: '14px', color: '#1F2937' }}>
                                    {payment.verifiedBy.name || 'N/A'}
                                  </span>
                                ) : (
                                  <span style={{ ...styles.statusBadge, ...styles.statusPending, padding: '4px 10px', fontSize: '12px' }}>
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td style={styles.tableCell}>
                                {payment.paymentStatus === 'Success' && !payment.verifiedBy && (
                                  <button
                                    onClick={() => handleVerify(payment._id)}
                                    style={{
                                      ...styles.actionButton,
                                      ...styles.verifyButton,
                                      ...(hoveredButton === `verify-${payment._id}` ? styles.verifyButtonHover : {}),
                                    }}
                                    onMouseEnter={() => setHoveredButton(`verify-${payment._id}`)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                  >
                                    Verify & Distribute
                                  </button>
                                )}
                                {payment.paymentStatus === 'Success' && payment.distributed && (
                                  <button
                                    onClick={() => handleRefund(payment._id)}
                                    style={{
                                      ...styles.actionButton,
                                      ...styles.refundButton,
                                      ...(hoveredButton === `refund-${payment._id}` ? styles.refundButtonHover : {}),
                                    }}
                                    onMouseEnter={() => setHoveredButton(`refund-${payment._id}`)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                  >
                                    Refund (80%)
                                  </button>
                                )}
                                {isRefunded && (
                                  <span style={{ ...styles.actionButton, ...styles.disabledButton }}>
                                    Refunded
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1200px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .distribution-grid {
            grid-template-columns: 1fr !important;
          }
          .additional-stats {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 768px) {
          .summary-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 600px) {
          header {
            padding: 12px 16px !important;
            flex-wrap: wrap;
            gap: 12px;
          }
          main {
            padding: 20px 16px 40px !important;
          }
        }
        
        /* Smooth scrollbar for table */
        .table-wrapper::-webkit-scrollbar {
          height: 8px;
        }
        .table-wrapper::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 4px;
        }
        .table-wrapper::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 4px;
        }
        .table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>
    </div>
  );
}

export default PaymentManagerDashboard;
