import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// For demo purposes, allow selecting role when registering
const ROLE_OPTIONS = [
  { value: 'user', label: 'User (Player)' },
  { value: 'groundManager', label: 'Ground Manager' },
  { value: 'paymentManager', label: 'Payment Manager' },
  { value: 'admin', label: 'Admin' },
];

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
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), phone, password, role }),
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

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Name <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              border: errors.name ? '1px solid red' : '1px solid #ddd',
            }}
          />
          {errors.name && <p style={{ color: 'red', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>{errors.name}</p>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            Email <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              border: errors.email ? '1px solid red' : '1px solid #ddd',
            }}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>{errors.email}</p>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            Phone Number <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="10 digits only"
            maxLength={10}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              border: errors.phone ? '1px solid red' : '1px solid #ddd',
            }}
          />
          {errors.phone && <p style={{ color: 'red', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>{errors.phone}</p>}
          {!errors.phone && phone.length > 0 && phone.length < 10 && (
            <p style={{ color: '#666', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              {10 - phone.length} more digit(s) required
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            Password <span style={{ color: 'red' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                paddingRight: '2.5rem',
                border: errors.password ? '1px solid red' : '1px solid #ddd',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#666',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p style={{ color: 'red', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>{errors.password}</p>}
          {!errors.password && password && (
            <p style={{ color: '#28a745', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              ✓ Password meets requirements
            </p>
          )}
          <p style={{ color: '#666', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            Confirm Password <span style={{ color: 'red' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                paddingRight: '2.5rem',
                border: errors.confirmPassword ? '1px solid red' : '1px solid #ddd',
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#666',
              }}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirmPassword && <p style={{ color: 'red', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>{errors.confirmPassword}</p>}
          {!errors.confirmPassword && confirmPassword && password === confirmPassword && (
            <p style={{ color: '#28a745', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              ✓ Passwords match
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Role (for demo)</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        
        <button 
          type="submit" 
          disabled={loading || !isFormValid()}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: (loading || !isFormValid()) ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (loading || !isFormValid()) ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;
