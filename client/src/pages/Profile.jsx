import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { API_ENDPOINTS } from '../config/api.js';

function Profile() {
  const { user, token, isLoggedIn, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

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

  const startEditing = () => {
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      currentPassword: '',
      newPassword: '',
    });
    setError('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.replace(/\D/g, '').slice(0, 10),
      };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const res = await fetch(API_ENDPOINTS.auth.profile, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to update profile');
        return;
      }
      updateUser({ name: data.name, email: data.email, phone: data.phone });
      setIsEditing(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
    editButton: {
      padding: '10px 18px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: '#E0E7FF',
      color: '#4338CA',
      border: '1px solid #C7D2FE',
      cursor: 'pointer',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    formGroup: {
      marginBottom: '16px',
    },
    formLabel: {
      display: 'block',
      fontSize: '13px',
      color: '#6B7280',
      fontWeight: '500',
      marginBottom: '6px',
    },
    formActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
    },
    saveButton: {
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: '#7C5CFC',
      color: '#FFFFFF',
      border: 'none',
      cursor: 'pointer',
    },
    cancelButton: {
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: '#F3F4F6',
      color: '#374151',
      border: '1px solid #E5E7EB',
      cursor: 'pointer',
    },
    passwordWrap: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    passwordInput: {
      width: '100%',
      padding: '10px 44px 10px 12px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    eyeToggle: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6B7280',
    },
    error: {
      color: '#B91C1C',
      fontSize: '14px',
      marginBottom: '12px',
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
          {!isEditing ? (
            <>
              <div style={styles.row}>
                <span style={styles.label}>Name</span>
                <span style={styles.value}>{user.name || '—'}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Email</span>
                <span style={styles.value}>{user.email || '—'}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Phone</span>
                <span style={styles.value}>{user.phone || '—'}</span>
              </div>
              <div style={{ ...styles.row, ...styles.rowLast }}>
                <span style={styles.label}>Role</span>
                <span style={styles.roleBadge}>{roleLabel}</span>
              </div>

              <div style={styles.actions}>
                <button type="button" style={styles.editButton} onClick={startEditing}>
                  Edit profile
                </button>
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
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div style={styles.error}>{error}</div>}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  style={styles.input}
                  placeholder="Your name"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="your@email.com"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Phone (10 digits)</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  style={styles.input}
                  placeholder="9876543210"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>New password (optional)</label>
                <div style={styles.passwordWrap}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    style={styles.passwordInput}
                    placeholder="Leave blank to keep current"
                  />
                  <button
                    type="button"
                    style={styles.eyeToggle}
                    onClick={() => setShowNewPassword((v) => !v)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {form.newPassword && (
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Current password (required to change password)</label>
                  <div style={styles.passwordWrap}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={handleChange}
                      style={styles.passwordInput}
                      placeholder="Current password"
                    />
                    <button
                      type="button"
                      style={styles.eyeToggle}
                      onClick={() => setShowCurrentPassword((v) => !v)}
                      aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
              <div style={styles.formActions}>
                <button type="submit" style={styles.saveButton} disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button type="button" style={styles.cancelButton} onClick={cancelEditing} disabled={saving}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
