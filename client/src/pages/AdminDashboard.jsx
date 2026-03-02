import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Icon Components
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const GroundsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
  </svg>
);

const BookingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const PaymentsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const UserManageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
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

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

const RevenueIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const CommissionIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

const RefundIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>
);

const RetainedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

function AdminDashboard() {
  const { user, token, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [financialStats, setFinancialStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingFinancial, setLoadingFinancial] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('stats');
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const isAdmin = isLoggedIn && user?.role === 'admin';

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data.data);
      } else {
        setError(data.message || 'Failed to load stats');
      }
    } catch (err) {
      setError('Something went wrong while loading stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.data || []);
      } else {
        setError(data.message || 'Failed to load users');
      }
    } catch (err) {
      setError('Something went wrong while loading users');
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialStats = async () => {
    setLoadingFinancial(true);
    try {
      const res = await fetch('http://localhost:5000/api/payments/dashboard-stats', {
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setFinancialStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load financial stats', err);
    } finally {
      setLoadingFinancial(false);
    }
  };

  const loadPayments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payments', {
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setPayments(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load payments', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadStats();
      loadUsers();
      loadFinancialStats();
      loadPayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        loadUsers();
        loadStats();
      } else {
        setError(data.message || 'Failed to update user role');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        loadUsers();
        loadStats();
      } else {
        setError(data.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/approve`, {
        method: 'PUT',
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        loadUsers();
        loadStats();
      } else {
        setError(data.message || 'Failed to approve user');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleRejectUser = async (userId) => {
    if (!window.confirm('Revoke this user\'s access? They will not be able to log in until approved again.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/reject`, {
        method: 'PUT',
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        loadUsers();
        loadStats();
      } else {
        setError(data.message || 'Failed to revoke approval');
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
    loadStats();
    loadUsers();
    loadFinancialStats();
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
    summaryBreakdown: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #F3F4F6',
    },
    breakdownItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '13px',
      color: '#6B7280',
      marginBottom: '4px',
    },
    breakdownValue: {
      fontWeight: '600',
      color: '#374151',
    },
    contentCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      marginBottom: '24px',
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
    cardSubtitle: {
      fontSize: '13px',
      color: '#9CA3AF',
      marginTop: '4px',
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
    },
    statCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      border: '1px solid #F3F4F6',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0',
    },
    tableHeader: {
      backgroundColor: '#F8F5FC',
    },
    tableHeaderCell: {
      padding: '14px 18px',
      textAlign: 'left',
      fontSize: '12px',
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
    tableRowAlt: {
      backgroundColor: '#FAFBFC',
    },
    tableCell: {
      padding: '16px 18px',
      fontSize: '14px',
      color: '#1F2937',
      borderBottom: '1px solid #F3F4F6',
    },
    roleSelect: {
      padding: '8px 12px',
      fontSize: '13px',
      border: '1.5px solid #E5E7EB',
      borderRadius: '10px',
      backgroundColor: '#FAFAFA',
      color: '#1F2937',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s ease',
      minWidth: '140px',
    },
    roleSelectDisabled: {
      backgroundColor: '#F3F4F6',
      color: '#9CA3AF',
      cursor: 'not-allowed',
    },
    deleteButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      backgroundColor: '#FEF2F2',
      color: '#DC2626',
      border: 'none',
      borderRadius: '10px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    deleteButtonHover: {
      backgroundColor: '#FEE2E2',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
    },
    statusSuccess: {
      backgroundColor: '#ECFDF5',
      color: '#059669',
    },
    statusRefunded: {
      backgroundColor: '#FEF2F2',
      color: '#DC2626',
    },
    statusPending: {
      backgroundColor: '#FFFBEB',
      color: '#D97706',
    },
    youBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      backgroundColor: '#F5F3FF',
      color: '#7C5CFC',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      marginLeft: '8px',
    },
    distributionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    },
    distributionCard: {
      padding: '20px',
      borderRadius: '14px',
      textAlign: 'center',
      border: '1px solid',
    },
    distributionValue: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '4px',
    },
    distributionLabel: {
      fontSize: '13px',
      fontWeight: '500',
    },
    transactionCountGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    },
    countCard: {
      padding: '20px',
      backgroundColor: '#FFFFFF',
      borderRadius: '14px',
      textAlign: 'center',
      border: '1px solid #F3F4F6',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    },
    countValue: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '4px',
    },
    countLabel: {
      fontSize: '13px',
      color: '#6B7280',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '16px',
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
    },
    transactionId: {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: '12px',
      color: '#6B7280',
      backgroundColor: '#F3F4F6',
      padding: '4px 8px',
      borderRadius: '6px',
    },
    shareCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    shareDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
  };

  // Access denied states
  if (!isLoggedIn) {
    return (
      <div style={styles.accessDenied}>
        <div style={styles.accessDeniedCard}>
          <div style={{ marginBottom: '20px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 style={styles.accessDeniedTitle}>Authentication Required</h2>
          <p style={styles.accessDeniedText}>Please login as Admin to access this dashboard.</p>
          <button style={styles.loginButton} onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={styles.accessDenied}>
        <div style={styles.accessDeniedCard}>
          <div style={{ marginBottom: '20px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
          </div>
          <h2 style={styles.accessDeniedTitle}>Access Denied</h2>
          <p style={styles.accessDeniedText}>You do not have permission to access this page. Admin access required.</p>
          <button style={styles.loginButton} onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Success': return styles.statusSuccess;
      case 'Refunded': return styles.statusRefunded;
      default: return styles.statusPending;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return { bg: '#FEF2F2', color: '#DC2626' };
      case 'groundManager': return { bg: '#ECFDF5', color: '#059669' };
      case 'paymentManager': return { bg: '#EFF6FF', color: '#2563EB' };
      default: return { bg: '#F3F4F6', color: '#4B5563' };
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Header Bar */}
      <header style={styles.headerBar}>
        <h1 style={styles.headerTitle}>
          <span style={styles.headerTitleAccent}>Admin</span> Dashboard
        </h1>
        <div style={styles.headerRight}>
          <div style={styles.userBadge}>
            <div style={styles.userAvatar}>
              <UserIcon />
            </div>
            <div>
              <div style={styles.userName}>{user?.name || 'Admin'}</div>
              <div style={styles.userRole}>{user?.role || 'Administrator'}</div>
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
            <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#F5F3FF' }}>
              <UsersIcon />
            </div>
            <div style={styles.summaryValue}>{stats?.users?.total || 0}</div>
            <div style={styles.summaryLabel}>Total Users</div>
            {stats?.users?.byRole && (
              <div style={styles.summaryBreakdown}>
                <div style={styles.breakdownItem}>
                  <span>Regular Users</span>
                  <span style={styles.breakdownValue}>{stats.users.byRole.user || 0}</span>
                </div>
                <div style={styles.breakdownItem}>
                  <span>Admins</span>
                  <span style={styles.breakdownValue}>{stats.users.byRole.admin || 0}</span>
                </div>
                <div style={styles.breakdownItem}>
                  <span>Ground Managers</span>
                  <span style={styles.breakdownValue}>{stats.users.byRole.groundManager || 0}</span>
                </div>
                <div style={styles.breakdownItem}>
                  <span>Payment Managers</span>
                  <span style={styles.breakdownValue}>{stats.users.byRole.paymentManager || 0}</span>
                </div>
              </div>
            )}
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#ECFDF5' }}>
              <GroundsIcon />
            </div>
            <div style={styles.summaryValue}>{stats?.grounds?.total || 0}</div>
            <div style={styles.summaryLabel}>Total Grounds</div>
            <div style={styles.summaryBreakdown}>
              <div style={styles.breakdownItem}>
                <span>Active Grounds</span>
                <span style={styles.breakdownValue}>{stats?.grounds?.total || 0}</span>
              </div>
            </div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#FFF7ED' }}>
              <BookingsIcon />
            </div>
            <div style={styles.summaryValue}>{stats?.bookings?.total || 0}</div>
            <div style={styles.summaryLabel}>Total Bookings</div>
            {stats?.bookings && (
              <div style={styles.summaryBreakdown}>
                <div style={styles.breakdownItem}>
                  <span>Approved</span>
                  <span style={{ ...styles.breakdownValue, color: '#059669' }}>{stats.bookings.approved || 0}</span>
                </div>
                <div style={styles.breakdownItem}>
                  <span>Pending</span>
                  <span style={{ ...styles.breakdownValue, color: '#D97706' }}>{stats.bookings.pending || 0}</span>
                </div>
                <div style={styles.breakdownItem}>
                  <span>Rejected</span>
                  <span style={{ ...styles.breakdownValue, color: '#DC2626' }}>{stats.bookings.rejected || 0}</span>
                </div>
              </div>
            )}
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#ECFDF5' }}>
              <PaymentsIcon />
            </div>
            <div style={styles.summaryValue}>{stats?.payments?.total || 0}</div>
            <div style={styles.summaryLabel}>Total Payments</div>
            {stats?.payments && (
              <div style={styles.summaryBreakdown}>
                <div style={styles.breakdownItem}>
                  <span>Verified</span>
                  <span style={{ ...styles.breakdownValue, color: '#059669' }}>{stats.payments.verified || 0}</span>
                </div>
                <div style={styles.breakdownItem}>
                  <span>Refunded</span>
                  <span style={{ ...styles.breakdownValue, color: '#DC2626' }}>{stats.payments.refunded || 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation Card */}
        <div style={styles.contentCard}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                {activeTab === 'stats' ? 'System Statistics' : 
                 activeTab === 'users' ? 'User Management' : 'Financial Analytics'}
              </h2>
              {activeTab === 'users' && (
                <p style={styles.cardSubtitle}>Manage user roles and access permissions</p>
              )}
            </div>
            <div style={styles.tabGroup}>
              <button
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'stats' ? styles.tabButtonActive : styles.tabButtonInactive),
                }}
                onClick={() => setActiveTab('stats')}
              >
                <ChartIcon />
                Statistics
              </button>
              <button
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'users' ? styles.tabButtonActive : styles.tabButtonInactive),
                }}
                onClick={() => setActiveTab('users')}
              >
                <UserManageIcon />
                Users
              </button>
              <button
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'financial' ? styles.tabButtonActive : styles.tabButtonInactive),
                }}
                onClick={() => setActiveTab('financial')}
              >
                <WalletIcon />
                Financial
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

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div>
                {loadingStats ? (
                  <p style={styles.loadingText}>Loading statistics...</p>
                ) : stats ? (
                  <div style={styles.statsGrid} className="stats-grid">
                    {/* Users Card */}
                    <div style={styles.statCard}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', backgroundColor: '#F5F3FF', borderRadius: '10px' }}>
                          <UsersIcon />
                        </div>
                        <div>
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937' }}>{stats.users.total}</div>
                          <div style={{ fontSize: '13px', color: '#6B7280' }}>Total Users</div>
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px' }}>
                        <div style={styles.breakdownItem}><span>Regular Users</span><span style={styles.breakdownValue}>{stats.users.byRole.user}</span></div>
                        <div style={styles.breakdownItem}><span>Admins</span><span style={styles.breakdownValue}>{stats.users.byRole.admin}</span></div>
                        <div style={styles.breakdownItem}><span>Ground Managers</span><span style={styles.breakdownValue}>{stats.users.byRole.groundManager}</span></div>
                        <div style={styles.breakdownItem}><span>Payment Managers</span><span style={styles.breakdownValue}>{stats.users.byRole.paymentManager}</span></div>
                      </div>
                    </div>

                    {/* Grounds Card */}
                    <div style={styles.statCard}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', backgroundColor: '#ECFDF5', borderRadius: '10px' }}>
                          <GroundsIcon />
                        </div>
                        <div>
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937' }}>{stats.grounds.total}</div>
                          <div style={{ fontSize: '13px', color: '#6B7280' }}>Active Grounds</div>
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px' }}>
                        <div style={styles.breakdownItem}><span>Available for Booking</span><span style={styles.breakdownValue}>{stats.grounds.total}</span></div>
                      </div>
                    </div>

                    {/* Bookings Card */}
                    <div style={styles.statCard}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', backgroundColor: '#FFF7ED', borderRadius: '10px' }}>
                          <BookingsIcon />
                        </div>
                        <div>
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937' }}>{stats.bookings.total}</div>
                          <div style={{ fontSize: '13px', color: '#6B7280' }}>Total Bookings</div>
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px' }}>
                        <div style={styles.breakdownItem}><span>Pending</span><span style={{ ...styles.breakdownValue, color: '#D97706' }}>{stats.bookings.pending}</span></div>
                        <div style={styles.breakdownItem}><span>Approved</span><span style={{ ...styles.breakdownValue, color: '#059669' }}>{stats.bookings.approved}</span></div>
                        <div style={styles.breakdownItem}><span>Rejected</span><span style={{ ...styles.breakdownValue, color: '#DC2626' }}>{stats.bookings.rejected}</span></div>
                        <div style={{ ...styles.breakdownItem, marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #E5E7EB' }}>
                          <span>Paid</span><span style={{ ...styles.breakdownValue, color: '#059669' }}>{stats.bookings.paid}</span>
                        </div>
                        <div style={styles.breakdownItem}><span>Unpaid</span><span style={{ ...styles.breakdownValue, color: '#F97316' }}>{stats.bookings.unpaid}</span></div>
                      </div>
                    </div>

                    {/* Payments Card */}
                    <div style={styles.statCard}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', backgroundColor: '#ECFDF5', borderRadius: '10px' }}>
                          <PaymentsIcon />
                        </div>
                        <div>
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937' }}>{stats.payments.total}</div>
                          <div style={{ fontSize: '13px', color: '#6B7280' }}>Total Payments</div>
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px' }}>
                        <div style={styles.breakdownItem}><span>Verified</span><span style={{ ...styles.breakdownValue, color: '#059669' }}>{stats.payments.verified}</span></div>
                        <div style={styles.breakdownItem}><span>Refunded</span><span style={{ ...styles.breakdownValue, color: '#DC2626' }}>{stats.payments.refunded}</span></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={styles.emptyText}>No statistics available</p>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                {loading ? (
                  <p style={styles.loadingText}>Loading users...</p>
                ) : users.length === 0 ? (
                  <p style={styles.emptyText}>No users found.</p>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead style={styles.tableHeader}>
                        <tr>
                          <th style={styles.tableHeaderCell}>User</th>
                          <th style={styles.tableHeaderCell}>Email</th>
                          <th style={styles.tableHeaderCell}>Role</th>
                          <th style={styles.tableHeaderCell}>Status</th>
                          <th style={styles.tableHeaderCell}>Joined</th>
                          <th style={styles.tableHeaderCell}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, index) => {
                          const createdDate = new Date(u.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          });
                          const isCurrentUser = u._id === user._id;
                          const roleColors = getRoleBadgeColor(u.role);

                          return (
                            <tr
                              key={u._id}
                              style={{
                                ...styles.tableRow,
                                ...(hoveredRow === index ? styles.tableRowHover : {}),
                                ...(index % 2 === 1 ? styles.tableRowAlt : {}),
                              }}
                              onMouseEnter={() => setHoveredRow(index)}
                              onMouseLeave={() => setHoveredRow(null)}
                            >
                              <td style={styles.tableCell}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    backgroundColor: roleColors.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: roleColors.color,
                                    fontSize: '14px',
                                    fontWeight: '600',
                                  }}>
                                    {u.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: '500', color: '#1F2937' }}>
                                      {u.name}
                                      {isCurrentUser && <span style={styles.youBadge}>You</span>}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td style={styles.tableCell}>
                                <span style={{ color: '#6B7280' }}>{u.email}</span>
                              </td>
                              <td style={styles.tableCell}>
                                <select
                                  value={u.role}
                                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                  disabled={isCurrentUser}
                                  style={{
                                    ...styles.roleSelect,
                                    ...(isCurrentUser ? styles.roleSelectDisabled : {}),
                                  }}
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                  <option value="groundManager">Ground Manager</option>
                                  <option value="paymentManager">Payment Manager</option>
                                </select>
                              </td>
                              <td style={styles.tableCell}>
                                {u.role === 'admin' ? (
                                  <span style={{ color: '#9CA3AF', fontSize: '13px' }}>—</span>
                                ) : u.approved === false ? (
                                  <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    backgroundColor: '#FEF3C7',
                                    color: '#D97706',
                                  }}>Pending</span>
                                ) : (
                                  <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    backgroundColor: '#D1FAE5',
                                    color: '#059669',
                                  }}>Approved</span>
                                )}
                              </td>
                              <td style={styles.tableCell}>
                                <span style={{ color: '#6B7280', fontSize: '13px' }}>{createdDate}</span>
                              </td>
                              <td style={styles.tableCell}>
                                {!isCurrentUser ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    {u.role !== 'admin' && u.approved === false && (
                                      <button
                                        type="button"
                                        onClick={() => handleApproveUser(u._id)}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          padding: '6px 12px',
                                          fontSize: '13px',
                                          fontWeight: '600',
                                          color: '#059669',
                                          backgroundColor: '#D1FAE5',
                                          border: 'none',
                                          borderRadius: '8px',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <CheckIcon />
                                        Approve
                                      </button>
                                    )}
                                    {u.role !== 'admin' && u.approved === true && (
                                      <button
                                        type="button"
                                        onClick={() => handleRejectUser(u._id)}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          padding: '6px 12px',
                                          fontSize: '13px',
                                          fontWeight: '600',
                                          color: '#D97706',
                                          backgroundColor: '#FEF3C7',
                                          border: 'none',
                                          borderRadius: '8px',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <XCircleIcon />
                                        Revoke
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteUser(u._id)}
                                      style={{
                                        ...styles.deleteButton,
                                        ...(hoveredButton === `delete-${u._id}` ? styles.deleteButtonHover : {}),
                                      }}
                                      onMouseEnter={() => setHoveredButton(`delete-${u._id}`)}
                                      onMouseLeave={() => setHoveredButton(null)}
                                    >
                                      <TrashIcon />
                                      Delete
                                    </button>
                                  </div>
                                ) : (
                                  <span style={{ color: '#9CA3AF', fontSize: '13px' }}>—</span>
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

            {/* Financial Tab */}
            {activeTab === 'financial' && (
              <div>
                {loadingFinancial ? (
                  <p style={styles.loadingText}>Loading financial data...</p>
                ) : financialStats ? (
                  <>
                    {/* Key Financial Metrics */}
                    <div style={styles.summaryGrid} className="financial-grid">
                      <div style={styles.summaryCard}>
                        <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#ECFDF5' }}>
                          <RevenueIcon />
                        </div>
                        <div style={{ ...styles.summaryValue, color: '#059669' }}>
                          ₹{financialStats.totalRevenue?.toLocaleString() || '0'}
                        </div>
                        <div style={styles.summaryLabel}>Total Platform Revenue</div>
                      </div>
                      <div style={styles.summaryCard}>
                        <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#FFF7ED' }}>
                          <CommissionIcon />
                        </div>
                        <div style={{ ...styles.summaryValue, color: '#F97316' }}>
                          ₹{financialStats.distribution?.totalPlatformCommission?.toLocaleString() || '0'}
                        </div>
                        <div style={styles.summaryLabel}>Platform Commission ({financialStats.percentages?.admin || 5}%)</div>
                      </div>
                      <div style={styles.summaryCard}>
                        <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#FFFBEB' }}>
                          <RetainedIcon />
                        </div>
                        <div style={{ ...styles.summaryValue, color: '#D97706' }}>
                          ₹{financialStats.totalRetainedFromRefunds?.toLocaleString() || '0'}
                        </div>
                        <div style={styles.summaryLabel}>Retained from Refunds ({financialStats.percentages?.retainedOnRefund || 20}%)</div>
                      </div>
                      <div style={styles.summaryCard}>
                        <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#FEF2F2' }}>
                          <RefundIcon />
                        </div>
                        <div style={{ ...styles.summaryValue, color: '#DC2626' }}>
                          ₹{financialStats.totalRefundedAmount?.toLocaleString() || '0'}
                        </div>
                        <div style={styles.summaryLabel}>Total Refunded to Users</div>
                      </div>
                    </div>

                    {/* Distribution Summary */}
                    <h3 style={styles.sectionTitle}>Revenue Distribution Summary</h3>
                    <div style={styles.distributionGrid} className="distribution-grid">
                      <div style={{ ...styles.distributionCard, backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }}>
                        <div style={{ ...styles.distributionValue, color: '#059669' }}>
                          ₹{financialStats.distribution?.totalGroundManagerShare?.toLocaleString() || '0'}
                        </div>
                        <div style={{ ...styles.distributionLabel, color: '#047857' }}>
                          To Ground Managers (90%)
                        </div>
                      </div>
                      <div style={{ ...styles.distributionCard, backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
                        <div style={{ ...styles.distributionValue, color: '#2563EB' }}>
                          ₹{financialStats.distribution?.totalPaymentManagerShare?.toLocaleString() || '0'}
                        </div>
                        <div style={{ ...styles.distributionLabel, color: '#1D4ED8' }}>
                          To Payment Managers (5%)
                        </div>
                      </div>
                      <div style={{ ...styles.distributionCard, backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }}>
                        <div style={{ ...styles.distributionValue, color: '#EA580C' }}>
                          ₹{financialStats.distribution?.totalAdminShare?.toLocaleString() || '0'}
                        </div>
                        <div style={{ ...styles.distributionLabel, color: '#C2410C' }}>
                          Platform Commission (5%)
                        </div>
                      </div>
                    </div>

                    {/* Transaction Counts */}
                    <h3 style={styles.sectionTitle}>Transaction Overview</h3>
                    <div style={styles.transactionCountGrid} className="transaction-grid">
                      <div style={styles.countCard}>
                        <div style={{ ...styles.countValue, color: '#1F2937' }}>
                          {financialStats.totalSuccessfulTransactions || 0}
                        </div>
                        <div style={styles.countLabel}>Total Transactions</div>
                      </div>
                      <div style={styles.countCard}>
                        <div style={{ ...styles.countValue, color: '#059669' }}>
                          {financialStats.currentActivePayments || 0}
                        </div>
                        <div style={styles.countLabel}>Active Payments</div>
                      </div>
                      <div style={styles.countCard}>
                        <div style={{ ...styles.countValue, color: '#D97706' }}>
                          {financialStats.pendingVerificationCount || 0}
                        </div>
                        <div style={styles.countLabel}>Pending Verification</div>
                      </div>
                      <div style={styles.countCard}>
                        <div style={{ ...styles.countValue, color: '#DC2626' }}>
                          {financialStats.refundedCount || 0}
                        </div>
                        <div style={styles.countLabel}>Refunded</div>
                      </div>
                    </div>

                    {/* Transactions Table */}
                    <h3 style={styles.sectionTitle}>Recent Transactions</h3>
                    {payments.length === 0 ? (
                      <p style={styles.emptyText}>No transactions found.</p>
                    ) : (
                      <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                          <thead style={styles.tableHeader}>
                            <tr>
                              <th style={styles.tableHeaderCell}>Transaction ID</th>
                              <th style={styles.tableHeaderCell}>Ground</th>
                              <th style={{ ...styles.tableHeaderCell, textAlign: 'right' }}>Amount</th>
                              <th style={{ ...styles.tableHeaderCell, textAlign: 'center' }}>Distribution</th>
                              <th style={styles.tableHeaderCell}>Status</th>
                              <th style={styles.tableHeaderCell}>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.slice(0, 15).map((payment, index) => (
                              <tr
                                key={payment._id}
                                style={{
                                  ...styles.tableRow,
                                  ...(hoveredRow === `payment-${index}` ? styles.tableRowHover : {}),
                                }}
                                onMouseEnter={() => setHoveredRow(`payment-${index}`)}
                                onMouseLeave={() => setHoveredRow(null)}
                              >
                                <td style={styles.tableCell}>
                                  <span style={styles.transactionId}>{payment.transactionID}</span>
                                </td>
                                <td style={styles.tableCell}>
                                  {payment.bookingID?.groundID?.groundName || 'N/A'}
                                </td>
                                <td style={{ ...styles.tableCell, textAlign: 'right', fontWeight: '600' }}>
                                  ₹{Number(payment.amount).toLocaleString('en-IN')}
                                </td>
                                <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                                    <div style={styles.shareCell}>
                                      <span style={{ ...styles.shareDot, backgroundColor: '#059669' }}></span>
                                      <span style={{ color: '#059669', fontSize: '12px' }}>₹{payment.groundManagerShare || '-'}</span>
                                    </div>
                                    <div style={styles.shareCell}>
                                      <span style={{ ...styles.shareDot, backgroundColor: '#2563EB' }}></span>
                                      <span style={{ color: '#2563EB', fontSize: '12px' }}>₹{payment.paymentManagerShare || '-'}</span>
                                    </div>
                                    <div style={styles.shareCell}>
                                      <span style={{ ...styles.shareDot, backgroundColor: '#EA580C' }}></span>
                                      <span style={{ color: '#EA580C', fontSize: '12px' }}>₹{payment.adminShare || '-'}</span>
                                    </div>
                                  </div>
                                </td>
                                <td style={styles.tableCell}>
                                  <span style={{ ...styles.statusBadge, ...getStatusBadgeStyle(payment.paymentStatus) }}>
                                    {payment.paymentStatus}
                                  </span>
                                </td>
                                <td style={styles.tableCell}>
                                  <span style={{ color: '#6B7280', fontSize: '13px' }}>
                                    {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {payments.length > 15 && (
                          <div style={{ padding: '16px', textAlign: 'center', color: '#6B7280', fontSize: '14px', borderTop: '1px solid #F3F4F6' }}>
                            Showing 15 of {payments.length} transactions
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p style={styles.emptyText}>No financial data available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1200px) {
          .summary-grid, .stats-grid, .financial-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .distribution-grid {
            grid-template-columns: 1fr !important;
          }
          .transaction-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 768px) {
          .summary-grid, .stats-grid, .financial-grid, .transaction-grid {
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
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          height: 8px;
          width: 8px;
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
        
        select:focus {
          border-color: #7C5CFC;
          box-shadow: 0 0 0 3px rgba(124, 92, 252, 0.1);
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
