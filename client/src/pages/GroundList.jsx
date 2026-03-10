import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api.js';

// Icon Components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const PriceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const ResetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>
);

const FieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

function GroundList() {
  const { isLoggedIn } = useAuth();
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Filters / search state
  const [search, setSearch] = useState('');
  // Location filter is driven by a debounced typeahead input
  const [locationInput, setLocationInput] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Debounce location typing (small delay before applying filter)
  useEffect(() => {
    const t = setTimeout(() => {
      setLocationFilter(locationInput.trim());
    }, 250);
    return () => clearTimeout(t);
  }, [locationInput]);

  useEffect(() => {
    const fetchGrounds = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(API_ENDPOINTS.grounds.list);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to load grounds');
        } else {
          setGrounds(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError('Something went wrong while loading grounds');
      } finally {
        setLoading(false);
      }
    };

    fetchGrounds();
  }, []);

  const uniqueLocations = useMemo(() => {
    const s = new Set(grounds.map((g) => g.location).filter(Boolean));
    return Array.from(s);
  }, [grounds]);

  const filteredGrounds = useMemo(() => {
    return grounds.filter((g) => {
      if (search && !g.groundName.toLowerCase().includes(search.toLowerCase())) return false;
      if (locationFilter && !String(g.location || '').toLowerCase().includes(locationFilter.toLowerCase())) return false;
      if (minPrice && Number(g.pricePerSlot) < Number(minPrice)) return false;
      if (maxPrice && Number(g.pricePerSlot) > Number(maxPrice)) return false;
      return true;
    });
  }, [grounds, search, locationFilter, minPrice, maxPrice]);

  const locationSuggestions = useMemo(() => {
    const q = locationInput.trim().toLowerCase();
    if (!q) return [];
    return uniqueLocations
      .filter((loc) => String(loc).toLowerCase().includes(q))
      .slice(0, 8);
  }, [uniqueLocations, locationInput]);

  const resetFilters = () => {
    setSearch('');
    setLocationInput('');
    setLocationFilter('');
    setMinPrice('');
    setMaxPrice('');
  };

  const hasActiveFilters = search || locationFilter || minPrice || maxPrice;

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
    resultCount: {
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
    filterCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '24px 28px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      marginBottom: '32px',
    },
    filterHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px',
    },
    filterTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F2937',
      margin: 0,
    },
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
      gap: '16px',
      alignItems: 'center',
    },
    inputWrapper: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      padding: '14px 14px 14px 44px',
      fontSize: '14px',
      border: '1.5px solid #E5E7EB',
      borderRadius: '12px',
      backgroundColor: '#FAFAFA',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
    },
    selectInput: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '14px',
      border: '1.5px solid #E5E7EB',
      borderRadius: '12px',
      backgroundColor: '#FAFAFA',
      outline: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 14px center',
      paddingRight: '40px',
    },
    suggestionBox: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      left: 0,
      right: 0,
      backgroundColor: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      zIndex: 50,
    },
    suggestionItem: {
      width: '100%',
      textAlign: 'left',
      padding: '10px 12px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#1F2937',
    },
    priceInput: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '14px',
      border: '1.5px solid #E5E7EB',
      borderRadius: '12px',
      backgroundColor: '#FAFAFA',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
    },
    resetButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '14px 24px',
      backgroundColor: '#F3F4F6',
      color: '#6B7280',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
    },
    resetButtonActive: {
      backgroundColor: '#FEF2F2',
      color: '#DC2626',
    },
    resetButtonHover: {
      backgroundColor: '#E5E7EB',
    },
    groundsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
    },
    groundCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    groundCardHover: {
      transform: 'translateY(-6px)',
      boxShadow: '0 12px 40px rgba(124, 92, 252, 0.15)',
    },
    groundImageWrapper: {
      position: 'relative',
      height: '180px',
      overflow: 'hidden',
    },
    groundImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    },
    groundImageHover: {
      transform: 'scale(1.05)',
    },
    noPhotoPlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: '#F3F4F6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    noPhotoText: {
      fontSize: '13px',
      color: '#9CA3AF',
    },
    priceBadge: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      padding: '8px 14px',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '700',
      color: '#059669',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    groundInfo: {
      padding: '20px',
    },
    groundName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '8px',
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    groundLocation: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '16px',
    },
    groundFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '16px',
      borderTop: '1px solid #F3F4F6',
    },
    priceText: {
      fontSize: '13px',
      color: '#9CA3AF',
    },
    priceValue: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1F2937',
    },
    priceUnit: {
      fontSize: '13px',
      color: '#6B7280',
      fontWeight: '400',
    },
    bookButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#7C5CFC',
      color: '#FFFFFF',
      textDecoration: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      border: 'none',
      cursor: 'pointer',
    },
    bookButtonHover: {
      backgroundColor: '#6B4FE0',
      transform: 'translateY(-1px)',
    },
    loginPrompt: {
      fontSize: '13px',
      color: '#6B7280',
    },
    loginLink: {
      color: '#7C5CFC',
      fontWeight: '600',
      textDecoration: 'none',
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
    errorWrapper: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      borderRadius: '20px',
      padding: '60px 40px',
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
      margin: '0 auto 20px',
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '8px',
    },
    emptyText: {
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '24px',
    },
    clearFiltersButton: {
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
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading grounds...</p>
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
      <div style={styles.errorWrapper}>
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

  // Empty state (no grounds at all)
  if (!grounds.length) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.loadingCard}>
          <div style={styles.emptyIcon}>
            <FieldIcon />
          </div>
          <h3 style={styles.emptyTitle}>No Grounds Available</h3>
          <p style={{ ...styles.emptyText, marginBottom: 0 }}>Check back later for new grounds.</p>
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
              <FieldIcon />
            </div>
            <div>
              <h1 style={styles.headerTitle}>
                <span style={styles.headerTitleAccent}>Available</span> Grounds
              </h1>
              <p style={styles.headerSubtitle}>Find and book the perfect ground for your game</p>
            </div>
          </div>
          <div style={styles.resultCount}>
            <FieldIcon />
            {filteredGrounds.length} {filteredGrounds.length === 1 ? 'Ground' : 'Grounds'} found
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.mainContainer}>
        {/* Filter Card */}
        <div style={styles.filterCard}>
          <div style={styles.filterHeader}>
            <FilterIcon />
            <h3 style={styles.filterTitle}>Search & Filter</h3>
          </div>
          <div style={styles.filterGrid} className="filter-grid">
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search by ground name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search location..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                style={styles.selectInput}
              />
              {locationSuggestions.length > 0 && (
                <div style={styles.suggestionBox}>
                  {locationSuggestions.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setLocationInput(loc);
                        setLocationFilter(loc);
                      }}
                      style={styles.suggestionItem}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={styles.priceInput}
              min="0"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={styles.priceInput}
              min="0"
            />
            <button
              onClick={resetFilters}
              style={{
                ...styles.resetButton,
                ...(hasActiveFilters ? styles.resetButtonActive : {}),
                ...(hoveredButton === 'reset' ? styles.resetButtonHover : {}),
              }}
              onMouseEnter={() => setHoveredButton('reset')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <ResetIcon />
              Reset
            </button>
          </div>
        </div>

        {/* Grounds Grid */}
        <div style={styles.groundsGrid} className="grounds-grid">
          {filteredGrounds.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <SearchIcon />
              </div>
              <h3 style={styles.emptyTitle}>No Grounds Found</h3>
              <p style={styles.emptyText}>No grounds match your current filters. Try adjusting your search criteria.</p>
              <button onClick={resetFilters} style={styles.clearFiltersButton}>
                <ResetIcon />
                Clear Filters
              </button>
            </div>
          ) : (
            filteredGrounds.map((ground) => (
              <div
                key={ground._id}
                style={{
                  ...styles.groundCard,
                  ...(hoveredCard === ground._id ? styles.groundCardHover : {}),
                }}
                onMouseEnter={() => setHoveredCard(ground._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.groundImageWrapper}>
                  {ground.photo ? (
                    <img
                      src={ground.photo}
                      alt={ground.groundName}
                      style={{
                        ...styles.groundImage,
                        ...(hoveredCard === ground._id ? styles.groundImageHover : {}),
                      }}
                    />
                  ) : (
                    <div style={styles.noPhotoPlaceholder}>
                      <ImageIcon />
                      <span style={styles.noPhotoText}>No Photo Available</span>
                    </div>
                  )}
                  <div style={styles.priceBadge}>
                    ₹{Number(ground.pricePerSlot).toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={styles.groundInfo}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={styles.groundName}>{ground.groundName}</h3>
                    {ground.isActive === false && (
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: '#FEF3C7',
                        color: '#D97706',
                      }}>
                        Under maintenance
                      </span>
                    )}
                  </div>
                  <div style={styles.groundLocation}>
                    <LocationIcon />
                    {ground.location}
                  </div>
                  <div style={styles.groundFooter}>
                    <div>
                      <div style={styles.priceText}>Starting from</div>
                      <div style={styles.priceValue}>
                        ₹{Number(ground.pricePerSlot).toLocaleString('en-IN')}
                        <span style={styles.priceUnit}>/slot</span>
                      </div>
                    </div>
                    {ground.isActive === false ? (
                      <span style={{
                        ...styles.bookButton,
                        opacity: 0.8,
                        cursor: 'not-allowed',
                        pointerEvents: 'none',
                        backgroundColor: '#9CA3AF',
                      }}>
                        Unavailable
                      </span>
                    ) : isLoggedIn ? (
                      <Link
                        to={`/book/${ground._id}`}
                        style={{
                          ...styles.bookButton,
                          ...(hoveredButton === `book-${ground._id}` ? styles.bookButtonHover : {}),
                        }}
                        onMouseEnter={() => setHoveredButton(`book-${ground._id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                      >
                        Book Now
                      </Link>
                    ) : (
                      <div style={styles.loginPrompt}>
                        <Link to="/login" style={styles.loginLink}>Login</Link> to book
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Responsive Styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .filter-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr auto !important;
          gap: 16px;
          align-items: center;
        }
        
        .grounds-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 24px;
        }
        
        @media (max-width: 1200px) {
          .grounds-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .filter-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        
        @media (max-width: 768px) {
          .grounds-grid {
            grid-template-columns: 1fr !important;
          }
          .filter-grid {
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
        
        input:focus, select:focus {
          border-color: #7C5CFC;
          box-shadow: 0 0 0 3px rgba(124, 92, 252, 0.1);
        }
        
        /* Hide number input spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
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

export default GroundList;


