import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// For demo purposes, allow selecting role when registering
const ROLE_OPTIONS = [
  { value: 'user', label: 'User (Player)' },
  { value: 'groundManager', label: 'Ground Manager' },
  { value: 'paymentManager', label: 'Payment Manager' },
  { value: 'admin', label: 'Admin' },
];

// Inline SVG illustration component for the left section
const RegisterIllustration = () => (
  <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '400px' }}>
    {/* Background shapes */}
    <ellipse cx="250" cy="360" rx="160" ry="25" fill="#E8E0F0" opacity="0.5"/>
    
    {/* Main form/clipboard */}
    <rect x="140" y="50" width="180" height="240" rx="12" fill="#FFFFFF" stroke="#E2D8F0" strokeWidth="2"/>
    <rect x="155" y="70" width="150" height="20" rx="4" fill="#7C5CFC" opacity="0.8"/>
    
    {/* Form fields */}
    <rect x="155" y="105" width="150" height="16" rx="4" fill="#F0EBF8"/>
    <rect x="155" y="130" width="150" height="16" rx="4" fill="#F0EBF8"/>
    <rect x="155" y="155" width="150" height="16" rx="4" fill="#F0EBF8"/>
    <rect x="155" y="180" width="150" height="16" rx="4" fill="#F0EBF8"/>
    <rect x="155" y="205" width="150" height="16" rx="4" fill="#F0EBF8"/>
    
    {/* Submit button on form */}
    <rect x="155" y="240" width="150" height="28" rx="6" fill="#7C5CFC"/>
    
    {/* Checkmarks */}
    <circle cx="320" cy="113" r="12" fill="#4ADE80" opacity="0.8"/>
    <path d="M314 113 L318 117 L326 109" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="320" cy="138" r="12" fill="#4ADE80" opacity="0.8"/>
    <path d="M314 138 L318 142 L326 134" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Person figure */}
    <ellipse cx="380" cy="260" rx="30" ry="60" fill="#6B4EE6" opacity="0.9"/>
    <circle cx="380" cy="185" r="25" fill="#FFDAB9"/>
    <ellipse cx="368" cy="285" rx="12" ry="35" fill="#4A3A8C"/>
    <ellipse cx="392" cy="285" rx="12" ry="35" fill="#4A3A8C"/>
    
    {/* Arm waving */}
    <ellipse cx="420" cy="230" rx="35" ry="8" fill="#FFDAB9" transform="rotate(-30 420 230)"/>
    
    {/* Decorative elements */}
    <circle cx="100" cy="100" r="35" fill="#7C5CFC" opacity="0.15"/>
    <circle cx="100" cy="100" r="20" fill="#9F8FEF" opacity="0.3"/>
    
    <circle cx="420" cy="80" r="8" fill="#FFB366" opacity="0.7"/>
    <circle cx="80" cy="200" r="6" fill="#7C5CFC" opacity="0.4"/>
    <circle cx="440" cy="320" r="10" fill="#9F8FEF" opacity="0.5"/>
    
    {/* Sports/turf element */}
    <rect x="60" y="280" width="70" height="45" rx="4" fill="#7FD17F" opacity="0.5"/>
    <line x1="70" y1="280" x2="70" y2="325" stroke="#FFFFFF" strokeWidth="1" opacity="0.6"/>
    <line x1="85" y1="280" x2="85" y2="325" stroke="#FFFFFF" strokeWidth="1" opacity="0.6"/>
    <line x1="100" y1="280" x2="100" y2="325" stroke="#FFFFFF" strokeWidth="1" opacity="0.6"/>
    <line x1="115" y1="280" x2="115" y2="325" stroke="#FFFFFF" strokeWidth="1" opacity="0.6"/>
    
    {/* Stars/sparkles */}
    <path d="M350 60 L352 66 L358 68 L352 70 L350 76 L348 70 L342 68 L348 66 Z" fill="#FFD700" opacity="0.8"/>
    <path d="M130 180 L131 184 L135 185 L131 186 L130 190 L129 186 L125 185 L129 184 Z" fill="#7C5CFC" opacity="0.6"/>
  </svg>
);

// Icon components
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 6L12 13L2 6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const RoleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const EyeIcon = ({ visible, onClick }) => (
  <svg 
    width="18" 
    height="18" 
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

// Validation functions
const validateEmail = (email) => {
  // Email must contain @ symbol and a valid domain (e.g., gmail.com, mail.com)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email must be in a valid format (e.g., user@example.com)';
  }
  
  // Check for proper domain (at least one dot after @)
  const domainRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(email)) {
    return 'Email must have a valid domain (e.g., gmail.com, mail.com)';
  }
  
  return '';
};

const validatePhone = (phone) => {
  // Remove any non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (!digitsOnly) {
    return 'Phone number is required';
  }
  
  if (digitsOnly.length !== 10) {
    return 'Phone number must be exactly 10 digits';
  }
  
  return '';
};

const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return '';
};

const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return '';
};

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  
  // Error states for each field
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  // Toggle states for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState(''); // General error
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validate phone input - only allow digits
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (digitsOnly.length <= 10) {
      setPhone(digitsOnly);
      
      // Clear error if valid
      if (digitsOnly.length === 10) {
        setErrors((prev) => ({ ...prev, phone: '' }));
      } else {
        setErrors((prev) => ({ ...prev, phone: 'Phone number must be exactly 10 digits' }));
      }
    }
  };

  // Validate email on change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value) {
      const emailError = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: emailError }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  // Validate password on change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value) {
      const passwordError = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: passwordError }));
      
      // Also validate confirm password if it has a value
      if (confirmPassword) {
        const confirmError = validateConfirmPassword(value, confirmPassword);
        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
      }
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  // Validate confirm password on change
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value) {
      const confirmError = validateConfirmPassword(password, value);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      name.trim() &&
      email &&
      phone.length === 10 &&
      password &&
      confirmPassword &&
      !errors.name &&
      !errors.email &&
      !errors.phone &&
      !errors.password &&
      !errors.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields before submission
    const validationErrors = {
      name: !name.trim() ? 'Name is required' : '',
      email: email ? validateEmail(email) : 'Email is required',
      phone: validatePhone(phone),
      password: password ? validatePassword(password) : 'Password is required',
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    
    setErrors(validationErrors);
    
    // Block submission if any validation fails
    if (!isFormValid()) {
      setError('Please fix all errors before submitting');
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), phone, password, confirmPassword, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        const { token, ...userData } = data;
        login(userData, token);
        navigate('/');
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
      maxWidth: '1000px',
      minHeight: '650px',
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
    },
    leftSection: {
      flex: '0 0 42%',
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
      padding: '40px 45px',
      overflowY: 'auto',
    },
    welcomeText: {
      fontSize: '14px',
      color: '#9CA3AF',
      marginBottom: '6px',
      fontWeight: '500',
      letterSpacing: '0.5px',
    },
    heading: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: '6px',
      letterSpacing: '-0.5px',
    },
    brandName: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#7C5CFC',
      marginBottom: '25px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    label: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#6B7280',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    required: {
      color: '#EF4444',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      padding: '12px 14px 12px 42px',
      fontSize: '14px',
      border: '1.5px solid #E5E7EB',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#FAFAFA',
      color: '#1F2937',
      boxSizing: 'border-box',
    },
    inputError: {
      borderColor: '#EF4444',
      backgroundColor: '#FEF2F2',
    },
    inputFocus: {
      borderColor: '#7C5CFC',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 0 3px rgba(124, 92, 252, 0.1)',
    },
    eyeIcon: {
      position: 'absolute',
      right: '14px',
      display: 'flex',
      alignItems: 'center',
    },
    select: {
      width: '100%',
      padding: '12px 14px 12px 42px',
      fontSize: '14px',
      border: '1.5px solid #E5E7EB',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#FAFAFA',
      color: '#1F2937',
      boxSizing: 'border-box',
      cursor: 'pointer',
      appearance: 'none',
    },
    fieldError: {
      fontSize: '12px',
      color: '#EF4444',
      marginTop: '4px',
    },
    fieldSuccess: {
      fontSize: '12px',
      color: '#10B981',
      marginTop: '4px',
    },
    fieldHint: {
      fontSize: '11px',
      color: '#9CA3AF',
      marginTop: '4px',
    },
    submitButton: {
      width: '100%',
      padding: '14px',
      fontSize: '15px',
      fontWeight: '600',
      color: '#FFFFFF',
      backgroundColor: '#7C5CFC',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '8px',
    },
    submitButtonDisabled: {
      backgroundColor: '#C4B5FD',
      cursor: 'not-allowed',
    },
    errorMessage: {
      padding: '10px 14px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: '8px',
      color: '#DC2626',
      fontSize: '13px',
      textAlign: 'center',
    },
    loginRow: {
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '14px',
      color: '#6B7280',
    },
    loginLink: {
      color: '#7C5CFC',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '4px',
    },
  };

  // Focus states
  const [focusedField, setFocusedField] = useState('');

  const getInputStyle = (fieldName, hasError) => ({
    ...styles.input,
    ...(hasError ? styles.inputError : {}),
    ...(focusedField === fieldName ? styles.inputFocus : {}),
  });

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainCard}>
        {/* Left Section - Illustration */}
        <div style={styles.leftSection} className="register-left-section">
          <RegisterIllustration />
        </div>

        {/* Right Section - Register Form */}
        <div style={styles.rightSection}>
          <p style={styles.welcomeText}>Join us today</p>
          <h1 style={styles.heading}>Create Account</h1>
          <p style={styles.brandName}>Turf Booking</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Name Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <UserIcon />
                Name <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}><UserIcon /></span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Enter your full name"
                  style={getInputStyle('name', errors.name)}
                />
              </div>
              {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
            </div>

            {/* Email Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <EmailIcon />
                Email <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}><EmailIcon /></span>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Enter your email"
                  style={getInputStyle('email', errors.email)}
                />
              </div>
              {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
            </div>

            {/* Phone Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <PhoneIcon />
                Phone Number <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}><PhoneIcon /></span>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField('')}
                  placeholder="10 digit phone number"
                  maxLength={10}
                  style={getInputStyle('phone', errors.phone)}
                />
              </div>
              {errors.phone && <span style={styles.fieldError}>{errors.phone}</span>}
              {!errors.phone && phone.length > 0 && phone.length < 10 && (
                <span style={styles.fieldHint}>{10 - phone.length} more digit(s) required</span>
              )}
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <LockIcon />
                Password <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}><LockIcon /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Create a password"
                  style={{
                    ...getInputStyle('password', errors.password),
                    paddingRight: '42px',
                  }}
                />
                <span style={styles.eyeIcon}>
                  <EyeIcon visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
                </span>
              </div>
              {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
              {!errors.password && password && (
                <span style={styles.fieldSuccess}>✓ Password meets requirements</span>
              )}
              <span style={styles.fieldHint}>Min 8 chars with uppercase, lowercase & number</span>
            </div>

            {/* Confirm Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <LockIcon />
                Confirm Password <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}><LockIcon /></span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Confirm your password"
                  style={{
                    ...getInputStyle('confirmPassword', errors.confirmPassword),
                    paddingRight: '42px',
                  }}
                />
                <span style={styles.eyeIcon}>
                  <EyeIcon visible={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                </span>
              </div>
              {errors.confirmPassword && <span style={styles.fieldError}>{errors.confirmPassword}</span>}
              {!errors.confirmPassword && confirmPassword && password === confirmPassword && (
                <span style={styles.fieldSuccess}>✓ Passwords match</span>
              )}
            </div>

            {/* Role Select */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <RoleIcon />
                Role (for demo)
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}><RoleIcon /></span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onFocus={() => setFocusedField('role')}
                  onBlur={() => setFocusedField('')}
                  style={{
                    ...styles.select,
                    ...(focusedField === 'role' ? styles.inputFocus : {}),
                  }}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && <div style={styles.errorMessage}>{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              style={{
                ...styles.submitButton,
                ...((loading || !isFormValid()) ? styles.submitButtonDisabled : {}),
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p style={styles.loginRow}>
            Already have an account?
            <Link to="/login" style={styles.loginLink}>Login</Link>
          </p>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .register-left-section {
            display: none !important;
          }
        }
        
        input::placeholder, select::placeholder {
          color: #9CA3AF;
        }
        
        input:focus::placeholder {
          color: #C4B5FD;
        }
      `}</style>
    </div>
  );
}

export default Register;
