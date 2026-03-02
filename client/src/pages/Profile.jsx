import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Profile() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Please log in to view your profile.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  const roleLabel = {
    user: 'User / Player',
    groundManager: 'Ground Manager',
    paymentManager: 'Payment Manager',
    admin: 'Admin',
  }[user.role] || user.role;

  const dashboardLink = {
    user: { to: '/grounds', label: 'Go to Grounds' },
    groundManager: { to: '/ground-manager', label: 'Ground Manager Dashboard' },
    paymentManager: { to: '/payment-manager', label: 'Payment Manager Dashboard' },
    admin: { to: '/admin', label: 'Admin Dashboard' },
  }[user.role] || { to: '/', label: 'Home' };

  const styles = {
    page: {
      maxWidth: '480px',
      margin: '0 auto',
      padding: '2rem 1rem',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    },
    header: {
      padding: '24px 24px 20px',
      borderBottom: '1px solid #E5E7EB',
      backgroundColor: '#F9FAFB',
    },
    title: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1F2937',
      margin: 0,
    },
    subtitle: {
      fontSize: '14px',
      color: '#6B7280',
      marginTop: '4px',
    },
    body: {
      padding: '24px',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #F3F4F6',
    },
    rowLast: {
      borderBottom: 'none',
    },
    label: {
      fontSize: '13px',
      color: '#6B7280',
      fontWeight: '500',
    },
    value: {
      fontSize: '15px',
      color: '#1F2937',
      fontWeight: '500',
    },
    roleBadge: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      backgroundColor: '#EEF2FF',
      color: '#4F46E5',
    },
    actions: {
      marginTop: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    linkButton: {
      display: 'block',
      padding: '12px 20px',
      textAlign: 'center',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      textDecoration: 'none',
      backgroundColor: '#7C5CFC',
      color: '#FFFFFF',
      border: 'none',
      cursor: 'pointer',
    },
    logoutButton: {
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: '#FEE2E2',
      color: '#B91C1C',
      border: '1px solid #FECACA',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Profile</h1>
          <p style={styles.subtitle}>Your account details</p>
        </div>
        <div style={styles.body}>
          <div style={styles.row}>
            <span style={styles.label}>Name</span>
            <span style={styles.value}>{user.name || '—'}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Email</span>
            <span style={styles.value}>{user.email || '—'}</span>
          </div>
          <div style={{ ...styles.row, ...styles.rowLast }}>
            <span style={styles.label}>Role</span>
            <span style={styles.roleBadge}>{roleLabel}</span>
          </div>

          <div style={styles.actions}>
            <Link to={dashboardLink.to} style={styles.linkButton}>
              {dashboardLink.label}
            </Link>
            <button
              type="button"
              style={styles.logoutButton}
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
