import { useState } from 'react';
import { Link } from 'react-router-dom';

// Hero Illustration - Sports/Booking themed
const HeroIllustration = () => (
  <svg viewBox="0 0 500 450" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '480px' }}>
    {/* Background decorative shapes */}
    <circle cx="250" cy="225" r="180" fill="#7C5CFC" opacity="0.08"/>
    <circle cx="250" cy="225" r="140" fill="#9F8FEF" opacity="0.1"/>
    
    {/* Ground/Turf field */}
    <rect x="80" y="280" width="340" height="120" rx="12" fill="#4ADE80" opacity="0.3"/>
    <rect x="100" y="295" width="300" height="90" rx="8" fill="#22C55E" opacity="0.5"/>
    
    {/* Field lines */}
    <line x1="250" y1="295" x2="250" y2="385" stroke="#FFFFFF" strokeWidth="2" opacity="0.7"/>
    <circle cx="250" cy="340" r="30" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.7"/>
    <rect x="100" y="320" width="40" height="40" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.5"/>
    <rect x="360" y="320" width="40" height="40" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.5"/>
    
    {/* Main phone/app mockup */}
    <rect x="180" y="60" width="140" height="260" rx="20" fill="#FFFFFF" stroke="#E2D8F0" strokeWidth="3"/>
    <rect x="195" y="85" width="110" height="200" rx="8" fill="#F8F5FC"/>
    
    {/* App UI elements */}
    <rect x="205" y="100" width="90" height="18" rx="4" fill="#7C5CFC"/>
    <rect x="205" y="128" width="40" height="40" rx="8" fill="#4ADE80" opacity="0.6"/>
    <rect x="255" y="128" width="40" height="40" rx="8" fill="#E8E0F0"/>
    <rect x="205" y="178" width="40" height="40" rx="8" fill="#E8E0F0"/>
    <rect x="255" y="178" width="40" height="40" rx="8" fill="#7C5CFC" opacity="0.6"/>
    <rect x="205" y="230" width="90" height="35" rx="8" fill="#7C5CFC"/>
    <text x="250" y="253" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">Book Now</text>
    
    {/* Checkmark badge */}
    <circle cx="310" cy="100" r="22" fill="#4ADE80"/>
    <path d="M300 100 L307 107 L320 94" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Person 1 - left side */}
    <ellipse cx="95" cy="240" rx="28" ry="55" fill="#6B4EE6"/>
    <circle cx="95" cy="170" r="22" fill="#FFDAB9"/>
    <ellipse cx="82" cy="265" rx="12" ry="32" fill="#4A3A8C"/>
    <ellipse cx="108" cy="265" rx="12" ry="32" fill="#4A3A8C"/>
    
    {/* Person 2 - right side */}
    <ellipse cx="405" cy="240" rx="28" ry="55" fill="#9F8FEF"/>
    <circle cx="405" cy="170" r="22" fill="#FFDAB9"/>
    <ellipse cx="392" cy="265" rx="12" ry="32" fill="#7C5CFC"/>
    <ellipse cx="418" cy="265" rx="12" ry="32" fill="#7C5CFC"/>
    
    {/* Sports ball */}
    <circle cx="420" cy="90" r="28" fill="#FFFFFF" stroke="#E2D8F0" strokeWidth="2"/>
    <path d="M405 90 Q420 75 435 90 Q420 105 405 90" stroke="#7C5CFC" strokeWidth="2" fill="none"/>
    <path d="M420 62 L420 118" stroke="#7C5CFC" strokeWidth="2"/>
    
    {/* Clock icon */}
    <circle cx="80" cy="90" r="25" fill="#FFFFFF" stroke="#E2D8F0" strokeWidth="2"/>
    <circle cx="80" cy="90" r="18" fill="#F8F5FC"/>
    <line x1="80" y1="90" x2="80" y2="78" stroke="#7C5CFC" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="80" y1="90" x2="90" y2="95" stroke="#7C5CFC" strokeWidth="2.5" strokeLinecap="round"/>
    
    {/* Decorative elements */}
    <circle cx="150" cy="50" r="6" fill="#FFB366" opacity="0.8"/>
    <circle cx="380" cy="150" r="5" fill="#7C5CFC" opacity="0.5"/>
    <circle cx="50" cy="180" r="8" fill="#9F8FEF" opacity="0.4"/>
    <circle cx="450" cy="200" r="6" fill="#4ADE80" opacity="0.6"/>
    
    {/* Sparkles */}
    <path d="M350 50 L352 58 L360 60 L352 62 L350 70 L348 62 L340 60 L348 58 Z" fill="#FFD700" opacity="0.9"/>
    <path d="M130 140 L131 145 L136 146 L131 147 L130 152 L129 147 L124 146 L129 145 Z" fill="#7C5CFC" opacity="0.6"/>
  </svg>
);

// Feature Icons
const CalendarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
  </svg>
);

const PaymentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
    <line x1="6" y1="15" x2="10" y2="15"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

function Home() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const styles = {
    pageWrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 50px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
    },
    logo: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#7C5CFC',
      textDecoration: 'none',
      letterSpacing: '-0.5px',
    },
    navLinks: {
      display: 'flex',
      gap: '35px',
      alignItems: 'center',
    },
    navLink: {
      color: '#6B7280',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'color 0.2s ease',
      padding: '8px 0',
      borderBottom: '2px solid transparent',
    },
    heroSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '60px',
      padding: '60px 50px 80px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    heroLeft: {
      flex: '1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroRight: {
      flex: '1',
      maxWidth: '500px',
    },
    heroTitle: {
      fontSize: '48px',
      fontWeight: '800',
      color: '#FFFFFF',
      lineHeight: '1.15',
      marginBottom: '20px',
      letterSpacing: '-1px',
    },
    heroTitleAccent: {
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    heroSubtitle: {
      fontSize: '18px',
      color: 'rgba(255, 255, 255, 0.85)',
      lineHeight: '1.7',
      marginBottom: '35px',
      fontWeight: '400',
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
    },
    primaryButton: {
      padding: '16px 36px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#7C5CFC',
      backgroundColor: '#FFFFFF',
      border: 'none',
      borderRadius: '14px',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.25s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
    },
    primaryButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    },
    secondaryButton: {
      padding: '16px 36px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#FFFFFF',
      backgroundColor: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      borderRadius: '14px',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.25s ease',
      cursor: 'pointer',
    },
    secondaryButtonHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderColor: 'rgba(255, 255, 255, 0.6)',
      transform: 'translateY(-2px)',
    },
    featuresSection: {
      backgroundColor: '#FFFFFF',
      padding: '80px 50px',
      borderTopLeftRadius: '40px',
      borderTopRightRadius: '40px',
    },
    featuresHeader: {
      textAlign: 'center',
      marginBottom: '50px',
    },
    featuresTitle: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: '12px',
      letterSpacing: '-0.5px',
    },
    featuresSubtitle: {
      fontSize: '16px',
      color: '#6B7280',
      maxWidth: '500px',
      margin: '0 auto',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '24px',
      maxWidth: '1100px',
      margin: '0 auto',
    },
    featureCard: {
      backgroundColor: '#FFFFFF',
      padding: '32px 28px',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      border: '1px solid #F3F4F6',
      transition: 'all 0.3s ease',
      cursor: 'default',
    },
    featureCardHover: {
      transform: 'translateY(-6px)',
      boxShadow: '0 12px 40px rgba(124, 92, 252, 0.12)',
      borderColor: '#E8E0F0',
    },
    featureIconWrapper: {
      width: '60px',
      height: '60px',
      borderRadius: '16px',
      backgroundColor: '#F8F5FC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    featureTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '10px',
    },
    featureDescription: {
      fontSize: '14px',
      color: '#6B7280',
      lineHeight: '1.6',
    },
    footer: {
      backgroundColor: '#FFFFFF',
      padding: '30px 50px',
      textAlign: 'center',
      borderTop: '1px solid #F3F4F6',
    },
    footerText: {
      fontSize: '14px',
      color: '#9CA3AF',
    },
  };

  const features = [
    {
      icon: <CalendarIcon />,
      title: 'Easy Booking',
      description: 'Browse available grounds and book your preferred time slots with just a few clicks.',
    },
    {
      icon: <PaymentIcon />,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with automatic revenue distribution.',
    },
    {
      icon: <ClockIcon />,
      title: 'Real-time Availability',
      description: 'Check slot availability instantly and never double-book again.',
    },
    {
      icon: <UsersIcon />,
      title: 'Role-Based Access',
      description: 'Dedicated dashboards for players, ground managers, and administrators.',
    },
  ];

  return (
    <div style={styles.pageWrapper}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <Link to="/" style={styles.logo}>Turf Booking</Link>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <Link 
            to="/login" 
            style={{
              ...styles.navLink,
              color: '#7C5CFC',
              fontWeight: '600',
            }}
          >
            Login
          </Link>
          <Link 
            to="/register" 
            style={{
              padding: '10px 24px',
              backgroundColor: '#7C5CFC',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.heroSection} className="hero-section">
        <div style={styles.heroLeft} className="hero-left">
          <HeroIllustration />
        </div>
        <div style={styles.heroRight} className="hero-right">
          <h1 style={styles.heroTitle}>
            Book Your Perfect
            <br />
            <span style={styles.heroTitleAccent}>Sports Ground</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Find and reserve sports turfs and grounds near you. 
            Simple booking, secure payments, and real-time availability 
            all in one place.
          </p>
          <div style={styles.buttonGroup}>
            <Link
              to="/register"
              style={{
                ...styles.primaryButton,
                ...(hoveredButton === 'register' ? styles.primaryButtonHover : {}),
              }}
              onMouseEnter={() => setHoveredButton('register')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Create Account
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12,5 19,12 12,19"/>
              </svg>
            </Link>
            <Link
              to="/login"
              style={{
                ...styles.secondaryButton,
                ...(hoveredButton === 'login' ? styles.secondaryButtonHover : {}),
              }}
              onMouseEnter={() => setHoveredButton('login')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.featuresHeader}>
          <h2 style={styles.featuresTitle}>Why Choose Us</h2>
          <p style={styles.featuresSubtitle}>
            Everything you need to manage sports ground bookings efficiently
          </p>
        </div>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                ...styles.featureCard,
                ...(hoveredFeature === index ? styles.featureCardHover : {}),
              }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div style={styles.featureIconWrapper}>
                {feature.icon}
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2024 Turf Booking System. Built for sports enthusiasts.
        </p>
      </footer>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          .hero-section {
            flex-direction: column !important;
            text-align: center;
            padding: 40px 24px 60px !important;
          }
          .hero-left {
            order: 1;
            margin-bottom: 30px;
          }
          .hero-right {
            order: 2;
          }
          .hero-section h1 {
            font-size: 36px !important;
          }
          .hero-section p {
            font-size: 16px !important;
          }
        }
        
        @media (max-width: 600px) {
          nav {
            padding: 16px 20px !important;
            flex-wrap: wrap;
            gap: 12px;
          }
          nav > div {
            gap: 16px !important;
          }
          section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
        
        a:hover {
          opacity: 0.95;
        }
        
        nav a[href="#features"]:hover {
          color: #7C5CFC !important;
        }
      `}</style>
    </div>
  );
}

export default Home;
