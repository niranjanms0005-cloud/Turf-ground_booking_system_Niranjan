import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Inline SVG illustration component for the left section
const BookingIllustration = () => (
  <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '420px' }}>
    {/* Background shapes */}
    <ellipse cx="250" cy="350" rx="180" ry="30" fill="#E8E0F0" opacity="0.5"/>
    
    {/* Main phone/device */}
    <rect x="160" y="60" width="140" height="260" rx="16" fill="#FFFFFF" stroke="#E2D8F0" strokeWidth="2"/>
    <rect x="170" y="80" width="120" height="200" rx="8" fill="#F8F5FC"/>
    
    {/* Calendar/booking UI on phone */}
    <rect x="180" y="95" width="100" height="24" rx="4" fill="#7C5CFC" opacity="0.9"/>
    <rect x="180" y="130" width="45" height="45" rx="6" fill="#9F8FEF" opacity="0.7"/>
    <rect x="235" y="130" width="45" height="45" rx="6" fill="#E8E0F0"/>
    <rect x="180" y="185" width="45" height="45" rx="6" fill="#E8E0F0"/>
    <rect x="235" y="185" width="45" height="45" rx="6" fill="#7C5CFC" opacity="0.6"/>
    <rect x="180" y="240" width="100" height="30" rx="6" fill="#7C5CFC"/>
    
    {/* Person figure */}
    <ellipse cx="100" cy="280" rx="35" ry="70" fill="#6B4EE6" opacity="0.9"/>
    <circle cx="100" cy="195" r="28" fill="#FFDAB9"/>
    <ellipse cx="85" cy="310" rx="15" ry="40" fill="#4A3A8C"/>
    <ellipse cx="115" cy="310" rx="15" ry="40" fill="#4A3A8C"/>
    
    {/* Arm pointing */}
    <ellipse cx="145" cy="250" rx="40" ry="10" fill="#FFDAB9" transform="rotate(-20 145 250)"/>
    
    {/* Sports ball */}
    <circle cx="380" cy="150" r="40" fill="#7C5CFC" opacity="0.2"/>
    <circle cx="380" cy="150" r="30" fill="#9F8FEF" opacity="0.4"/>
    <path d="M365 150 Q380 135 395 150 Q380 165 365 150" fill="#FFFFFF" opacity="0.5"/>
    
    {/* Decorative elements */}
    <circle cx="320" cy="80" r="8" fill="#FFB366" opacity="0.7"/>
    <circle cx="400" cy="250" r="6" fill="#7C5CFC" opacity="0.5"/>
    <circle cx="80" cy="120" r="10" fill="#9F8FEF" opacity="0.4"/>
    
    {/* Turf/field pattern */}
    <rect x="330" y="280" width="80" height="50" rx="4" fill="#7FD17F" opacity="0.6"/>
    <line x1="340" y1="280" x2="340" y2="330" stroke="#FFFFFF" strokeWidth="1" opacity="0.5"/>
    <line x1="360" y1="280" x2="360" y2="330" stroke="#FFFFFF" strokeWidth="1" opacity="0.5"/>
    <line x1="380" y1="280" x2="380" y2="330" stroke="#FFFFFF" strokeWidth="1" opacity="0.5"/>
    <line x1="400" y1="280" x2="400" y2="330" stroke="#FFFFFF" strokeWidth="1" opacity="0.5"/>
    
    {/* Clock/time icon */}
    <circle cx="70" cy="80" r="25" fill="#FFFFFF" stroke="#E2D8F0" strokeWidth="2"/>
    <circle cx="70" cy="80" r="20" fill="#F8F5FC"/>
    <line x1="70" y1="80" x2="70" y2="68" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round"/>
    <line x1="70" y1="80" x2="80" y2="85" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Icon components
const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 6L12 13L2 6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const EyeIcon = ({ visible, onClick }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#9CA3AF" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ cursor: 'pointer' }}
    onClick={onClick}
  >
    {visible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        const { token, ...userData } = data;
        login(userData, token);
        // Redirect to role-specific default page
        const role = userData?.role;
        if (role === 'user') navigate('/grounds');
        else if (role === 'groundManager') navigate('/ground-manager');
        else if (role === 'paymentManager') navigate('/payment-manager');
        else if (role === 'admin') navigate('/admin');
        else navigate('/');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Styles object
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    mainCard: {
      display: 'flex',
      width: '100%',
      maxWidth: '950px',
      minHeight: '580px',
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
    },
    leftSection: {
      flex: '1',
      background: 'linear-gradient(145deg, #F8F5FC 0%, #EDE7F6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      borderRight: '1px solid #F0EBF8',
    },
    rightSection: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '50px 45px',
    },
    welcomeText: {
      fontSize: '14px',
      color: '#9CA3AF',
      marginBottom: '8px',
      fontWeight: '500',
      letterSpacing: '0.5px',
    },
    heading: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: '8px',
      letterSpacing: '-0.5px',
    },
    brandName: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#7C5CFC',
      marginBottom: '35px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#6B7280',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      padding: '14px 16px 14px 48px',
      fontSize: '15px',
      border: '1.5px solid #E5E7EB',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#FAFAFA',
      color: '#1F2937',
      boxSizing: 'border-box',
    },
    inputFocus: {
      borderColor: '#7C5CFC',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 0 3px rgba(124, 92, 252, 0.1)',
    },
    eyeIcon: {
      position: 'absolute',
      right: '16px',
      display: 'flex',
      alignItems: 'center',
    },
    checkboxRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '4px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#6B7280',
      cursor: 'pointer',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      accentColor: '#7C5CFC',
      cursor: 'pointer',
    },
    forgotLink: {
      fontSize: '14px',
      color: '#7C5CFC',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.2s ease',
    },
    submitButton: {
      width: '100%',
      padding: '15px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#FFFFFF',
      backgroundColor: '#7C5CFC',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '10px',
    },
    submitButtonHover: {
      backgroundColor: '#6B4EE6',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(124, 92, 252, 0.4)',
    },
    submitButtonDisabled: {
      backgroundColor: '#C4B5FD',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
    errorMessage: {
      padding: '12px 16px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: '10px',
      color: '#DC2626',
      fontSize: '14px',
      textAlign: 'center',
    },
    registerRow: {
      textAlign: 'center',
      marginTop: '28px',
      fontSize: '14px',
      color: '#6B7280',
    },
    registerLink: {
      color: '#7C5CFC',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '4px',
      transition: 'color 0.2s ease',
    },
  };

  // State for input focus
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainCard}>
        {/* Left Section - Illustration */}
        <div style={styles.leftSection} className="login-left-section">
          <BookingIllustration />
        </div>

        {/* Right Section - Login Form */}
        <div style={styles.rightSection}>
          <p style={styles.welcomeText}>Welcome to</p>
          <h1 style={styles.heading}>Welcome Back</h1>
          <p style={styles.brandName}>Turf Booking</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <EmailIcon />
                Email
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <EmailIcon />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="Enter your email"
                  required
                  style={{
                    ...styles.input,
                    ...(emailFocused ? styles.inputFocus : {}),
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <LockIcon />
                Password
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Enter your password"
                  required
                  style={{
                    ...styles.input,
                    paddingRight: '48px',
                    ...(passwordFocused ? styles.inputFocus : {}),
                  }}
                />
                <span style={styles.eyeIcon}>
                  <EyeIcon 
                    visible={showPassword} 
                    onClick={() => setShowPassword(!showPassword)} 
                  />
                </span>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={styles.checkboxRow}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                />
                Remember me
              </label>
              <Link to="#" style={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>

            {/* Error Message */}
            {error && <div style={styles.errorMessage}>{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {}),
                ...(!loading && buttonHovered ? styles.submitButtonHover : {}),
              }}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {/* Register Link */}
          <p style={styles.registerRow}>
            Don't have an account?
            <Link to="/register" style={styles.registerLink}>
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Responsive styles injected via style tag */}
      <style>{`
        @media (max-width: 768px) {
          .login-left-section {
            display: none !important;
          }
        }
        
        input::placeholder {
          color: #9CA3AF;
        }
        
        input:focus::placeholder {
          color: #C4B5FD;
        }
      `}</style>
    </div>
  );
}

export default Login;


