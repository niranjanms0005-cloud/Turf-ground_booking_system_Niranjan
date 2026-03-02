import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// Icon Components
const GroundsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
  </svg>
);

const BookingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ApprovedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const EarningsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const FieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <circle cx="12" cy="12" r="3"/>
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

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

function GroundManagerDashboard() {
  const { user, token, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [myGrounds, setMyGrounds] = useState([]);
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState({});
  const [error, setError] = useState('');
  const [earnings, setEarnings] = useState(null);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [activeTab, setActiveTab] = useState('grounds');
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [expandedGround, setExpandedGround] = useState(null);

  const [form, setForm] = useState({
    groundName: '',
    location: '',
    pricePerSlot: '',
    availableSlots: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [reviewsExpanded, setReviewsExpanded] = useState({}); // groundId -> true when reviews are shown

  const isManager = isLoggedIn && (user?.role === 'groundManager' || user?.role === 'admin');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const loadMyGrounds = async () => {
    if (!isManager) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/grounds/manager/my-grounds', {
        headers: authHeaders,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to load your grounds');
      } else {
        setMyGrounds(data);
      }
    } catch (err) {
      setError('Something went wrong while loading your grounds');
    } finally {
      setLoading(false);
    }
  };

  const loadBookingsForGround = async (groundId) => {
    setLoadingBookings((prev) => ({ ...prev, [groundId]: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/ground/${groundId}`, {
        headers: authHeaders,
      });
      const data = await res.json();
      console.debug(`Bookings for ground ${groundId}:`, data);
      if (res.ok) {
        setBookings((prev) => ({ ...prev, [groundId]: data.data || [] }));
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoadingBookings((prev) => ({ ...prev, [groundId]: false }));
    }
  };

  const handleApprove = async (bookingId, groundId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/approve`, {
        method: 'PUT',
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        loadBookingsForGround(groundId);
      } else {
        setError(data.message || 'Failed to approve booking');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleReject = async (bookingId, groundId) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/reject`, {
        method: 'PUT',
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        loadBookingsForGround(groundId);
      } else {
        setError(data.message || 'Failed to reject booking');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const loadEarnings = async () => {
    if (!isManager) return;
    setLoadingEarnings(true);
    try {
      const res = await fetch('http://localhost:5000/api/payments/manager-earnings', {
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setEarnings(data.data);
      }
    } catch (err) {
      console.error('Failed to load earnings', err);
    } finally {
      setLoadingEarnings(false);
    }
  };

  useEffect(() => {
    loadMyGrounds();
    loadEarnings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManager]);

  useEffect(() => {
    myGrounds.forEach((ground) => {
      loadBookingsForGround(ground._id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myGrounds.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      groundName: '',
      location: '',
      pricePerSlot: '',
      availableSlots: '',
    });
    setEditingId(null);
    setPhotoPreview('');
    setPhotoFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      groundName: form.groundName,
      location: form.location,
      pricePerSlot: Number(form.pricePerSlot),
      availableSlots: form.availableSlots
        ? form.availableSlots.split(',').map((s) => s.trim())
        : [],
      photo: photoPreview || '',
    };

    const url = editingId
      ? `http://localhost:5000/api/grounds/${editingId}`
      : 'http://localhost:5000/api/grounds';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to save ground');
      } else {
        resetForm();
        loadMyGrounds();
      }
    } catch (err) {
      setError('Something went wrong while saving ground');
    }
  };

  const handleEdit = (ground) => {
    setEditingId(ground._id);
    setForm({
      groundName: ground.groundName,
      location: ground.location,
      pricePerSlot: ground.pricePerSlot,
      availableSlots: (ground.availableSlots || []).join(', '),
    });
    setPhotoPreview(ground.photo || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete (deactivate) this ground?')) return;

    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/grounds/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to delete ground');
      } else {
        loadMyGrounds();
      }
    } catch (err) {
      setError('Something went wrong while deleting ground');
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  const toggleSelectAll = () => {
    if (!selectAll) {
      const allIds = myGrounds.map((g) => g._id);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return alert('No grounds selected');
    if (!window.confirm(`Are you sure you want to deactivate ${selectedIds.length} selected ground(s)?`)) return;
    try {
      const promises = selectedIds.map((id) =>
        fetch(`http://localhost:5000/api/grounds/${id}`, { method: 'DELETE', headers: authHeaders })
      );
      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map((r) => r.json().catch(() => ({}))));
      const failed = responses.map((r, i) => (!r.ok ? results[i]?.message || 'Failed' : null)).filter(Boolean);
      if (failed.length) {
        alert(`Some deletions failed: ${failed.join('; ')}`);
      }
      setSelectedIds([]);
      setSelectAll(false);
      loadMyGrounds();
    } catch (err) {
      alert('Error deleting selected grounds');
    }
  };

  const enterSelectionMode = () => {
    setIsSelectionMode(true);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
    setSelectAll(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const refreshAll = () => {
    loadMyGrounds();
    loadEarnings();
  };

  // Calculate summary stats
  const totalGrounds = myGrounds.length;
  const totalActiveBookings = Object.values(bookings).flat().filter(b => b.status === 'Pending').length;
  const totalApprovedBookings = Object.values(bookings).flat().filter(b => b.status === 'Approved').length;
  const totalEarningsAmount = earnings?.totalEarnings || 0;

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
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
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
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    inputLabel: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#4B5563',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '14px',
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
    fileInput: {
      padding: '12px 16px',
      fontSize: '14px',
      border: '1.5px dashed #E5E7EB',
      borderRadius: '12px',
      backgroundColor: '#FAFAFA',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    submitButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '14px 28px',
      backgroundColor: '#7C5CFC',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    submitButtonHover: {
      backgroundColor: '#6B4EE6',
      transform: 'translateY(-1px)',
    },
    cancelButton: {
      padding: '14px 28px',
      backgroundColor: '#F3F4F6',
      color: '#4B5563',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    groundCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      marginBottom: '20px',
      border: '1px solid #F3F4F6',
      transition: 'all 0.2s ease',
    },
    groundCardHeader: {
      display: 'flex',
      gap: '20px',
      padding: '20px',
      borderBottom: '1px solid #F3F4F6',
    },
    groundImage: {
      width: '180px',
      height: '120px',
      borderRadius: '12px',
      objectFit: 'cover',
      flexShrink: 0,
    },
    groundImagePlaceholder: {
      width: '180px',
      height: '120px',
      borderRadius: '12px',
      backgroundColor: '#F3F4F6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9CA3AF',
      fontSize: '13px',
      flexShrink: 0,
    },
    groundInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    groundName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '8px',
    },
    groundMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      color: '#6B7280',
      marginBottom: '4px',
    },
    groundPrice: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#059669',
      marginTop: '8px',
    },
    groundActions: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px',
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },
    editButton: {
      backgroundColor: '#EFF6FF',
      color: '#2563EB',
    },
    deleteButton: {
      backgroundColor: '#FEF2F2',
      color: '#DC2626',
    },
    refreshBookingsButton: {
      backgroundColor: '#F0FDF4',
      color: '#059669',
    },
    sectionCard: {
      margin: '0 20px 20px',
      backgroundColor: '#F9FAFB',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      overflow: 'hidden',
    },
    sectionHeader: {
      padding: '16px 20px',
      backgroundColor: '#F3F4F6',
      borderBottom: '1px solid #E5E7EB',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
    },
    sectionContent: {
      padding: '16px 20px',
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
      padding: '12px 16px',
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
    tableCell: {
      padding: '14px 16px',
      fontSize: '14px',
      color: '#1F2937',
      borderBottom: '1px solid #F3F4F6',
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
    statusApproved: {
      backgroundColor: '#ECFDF5',
      color: '#059669',
    },
    statusRejected: {
      backgroundColor: '#FEF2F2',
      color: '#DC2626',
    },
    statusPending: {
      backgroundColor: '#FFFBEB',
      color: '#D97706',
    },
    paymentPaid: {
      backgroundColor: '#ECFDF5',
      color: '#059669',
    },
    paymentUnpaid: {
      backgroundColor: '#FFF7ED',
      color: '#EA580C',
    },
    approveButton: {
      padding: '6px 12px',
      backgroundColor: '#059669',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      marginRight: '6px',
    },
    rejectButton: {
      padding: '6px 12px',
      backgroundColor: '#DC2626',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    reviewCard: {
      padding: '14px',
      backgroundColor: '#FFFFFF',
      borderRadius: '10px',
      marginBottom: '10px',
      border: '1px solid #E5E7EB',
    },
    reviewStars: {
      display: 'flex',
      gap: '2px',
      marginBottom: '8px',
    },
    reviewText: {
      fontSize: '14px',
      color: '#374151',
      marginBottom: '8px',
      lineHeight: '1.5',
    },
    reviewMeta: {
      fontSize: '12px',
      color: '#9CA3AF',
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
    selectionBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '12px 20px',
      backgroundColor: '#FEF2F2',
      borderRadius: '12px',
      marginBottom: '20px',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      accentColor: '#7C5CFC',
      cursor: 'pointer',
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
          <p style={styles.accessDeniedText}>Please login as Ground Manager or Admin to access this dashboard.</p>
          <button style={styles.loginButton} onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isManager) {
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
          <p style={styles.accessDeniedText}>You do not have permission to access this page.</p>
          <button style={styles.loginButton} onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Approved': return styles.statusApproved;
      case 'Rejected': return styles.statusRejected;
      default: return styles.statusPending;
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Header Bar */}
      <header style={styles.headerBar}>
        <h1 style={styles.headerTitle}>
          <span style={styles.headerTitleAccent}>Ground Manager</span> Dashboard
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
              <GroundsIcon />
            </div>
            <div style={styles.summaryValue}>{totalGrounds}</div>
            <div style={styles.summaryLabel}>Total Grounds</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#F5F3FF' }}>
              <BookingsIcon />
            </div>
            <div style={styles.summaryValue}>{totalActiveBookings}</div>
            <div style={styles.summaryLabel}>Pending Bookings</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#ECFDF5' }}>
              <ApprovedIcon />
            </div>
            <div style={styles.summaryValue}>{totalApprovedBookings}</div>
            <div style={styles.summaryLabel}>Approved Bookings</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryIconWrapper, backgroundColor: '#FFF7ED' }}>
              <EarningsIcon />
            </div>
            <div style={styles.summaryValue}>₹{totalEarningsAmount.toLocaleString()}</div>
            <div style={styles.summaryLabel}>Total Earnings (90%)</div>
          </div>
        </div>

        {/* Tab Navigation Card */}
        <div style={styles.contentCard}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              {activeTab === 'grounds' ? 'Manage Grounds' : 'My Earnings'}
            </h2>
            <div style={styles.tabGroup}>
              <button
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'grounds' ? styles.tabButtonActive : styles.tabButtonInactive),
                }}
                onClick={() => setActiveTab('grounds')}
              >
                <FieldIcon />
                Grounds
              </button>
              <button
                style={{
                  ...styles.tabButton,
                  ...(activeTab === 'earnings' ? styles.tabButtonActive : styles.tabButtonInactive),
                }}
                onClick={() => setActiveTab('earnings')}
              >
                <WalletIcon />
                Earnings
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

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div>
                {loadingEarnings ? (
                  <p style={styles.loadingText}>Loading earnings data...</p>
                ) : earnings ? (
                  <>
                    {/* Earnings Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }} className="earnings-grid">
                      <div style={{ padding: '20px', backgroundColor: '#ECFDF5', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>
                          ₹{earnings.currentWalletBalance?.toLocaleString() || '0'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#047857', marginTop: '4px' }}>Wallet Balance</div>
                      </div>
                      <div style={{ padding: '20px', backgroundColor: '#EFF6FF', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563EB' }}>
                          ₹{earnings.totalEarnings?.toLocaleString() || '0'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#1D4ED8', marginTop: '4px' }}>Total Earnings ({earnings.sharePercentage}%)</div>
                      </div>
                      <div style={{ padding: '20px', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#DC2626' }}>
                          -₹{earnings.totalDeductions?.toLocaleString() || '0'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#B91C1C', marginTop: '4px' }}>Refund Deductions</div>
                      </div>
                      <div style={{ padding: '20px', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#16A34A' }}>
                          ₹{earnings.netEarnings?.toLocaleString() || '0'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#15803D', marginTop: '4px' }}>Net Earnings</div>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div style={{ padding: '16px 20px', backgroundColor: '#F8F5FC', borderRadius: '12px', marginBottom: '24px', border: '1px solid #E8E0F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6B4EE6', fontSize: '14px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="16" x2="12" y2="12"/>
                          <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        You receive <strong style={{ margin: '0 4px' }}>{earnings.sharePercentage}%</strong> of each booking payment after verification. Refunds deduct your share from wallet.
                      </div>
                    </div>

                    {/* Payment History */}
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>Payment History</h3>
                    {earnings.paymentHistory?.length === 0 ? (
                      <p style={styles.emptyText}>No payment history yet.</p>
                    ) : (
                      <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                          <thead style={styles.tableHeader}>
                            <tr>
                              <th style={styles.tableHeaderCell}>Transaction ID</th>
                              <th style={styles.tableHeaderCell}>Ground</th>
                              <th style={styles.tableHeaderCell}>User</th>
                              <th style={styles.tableHeaderCell}>Date / Slot</th>
                              <th style={{ ...styles.tableHeaderCell, textAlign: 'right' }}>Amount</th>
                              <th style={{ ...styles.tableHeaderCell, textAlign: 'right' }}>Your Share</th>
                              <th style={styles.tableHeaderCell}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {earnings.paymentHistory?.map((payment, index) => (
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
                                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '4px 8px', borderRadius: '6px' }}>
                                    {payment.transactionID}
                                  </span>
                                </td>
                                <td style={styles.tableCell}>{payment.groundName || 'N/A'}</td>
                                <td style={styles.tableCell}>{payment.userName || 'N/A'}</td>
                                <td style={styles.tableCell}>
                                  <div>{payment.bookingDate ? new Date(payment.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</div>
                                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{payment.timeSlot || ''}</div>
                                </td>
                                <td style={{ ...styles.tableCell, textAlign: 'right', fontWeight: '600' }}>₹{payment.amount?.toLocaleString()}</td>
                                <td style={{ ...styles.tableCell, textAlign: 'right', fontWeight: '600' }}>
                                  {payment.paymentStatus === 'Refunded' ? (
                                    <span style={{ color: '#DC2626' }}>-₹{payment.groundManagerShare}</span>
                                  ) : payment.distributed ? (
                                    <span style={{ color: '#059669' }}>+₹{payment.groundManagerShare}</span>
                                  ) : (
                                    <span style={{ color: '#9CA3AF' }}>Pending</span>
                                  )}
                                </td>
                                <td style={styles.tableCell}>
                                  <span style={{
                                    ...styles.statusBadge,
                                    ...(payment.paymentStatus === 'Success' && payment.distributed ? styles.statusApproved :
                                       payment.paymentStatus === 'Refunded' ? styles.statusRejected : styles.statusPending),
                                  }}>
                                    {payment.paymentStatus === 'Success' && payment.distributed ? 'Distributed' :
                                     payment.paymentStatus === 'Refunded' ? 'Refunded' : 'Pending'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                ) : (
                  <p style={styles.emptyText}>No earnings data available.</p>
                )}
              </div>
            )}

            {/* Grounds Tab */}
            {activeTab === 'grounds' && (
              <div>
                {/* Create/Edit Ground Form */}
                <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusIcon />
                    {editingId ? 'Edit Ground' : 'Add New Ground'}
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div style={styles.formGrid} className="form-grid">
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Ground Name *</label>
                        <input
                          name="groundName"
                          value={form.groundName}
                          onChange={handleChange}
                          onFocus={() => setFocusedInput('groundName')}
                          onBlur={() => setFocusedInput(null)}
                          required
                          placeholder="Enter ground name"
                          style={{
                            ...styles.input,
                            ...(focusedInput === 'groundName' ? styles.inputFocus : {}),
                          }}
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Location *</label>
                        <input
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          onFocus={() => setFocusedInput('location')}
                          onBlur={() => setFocusedInput(null)}
                          required
                          placeholder="Enter location"
                          style={{
                            ...styles.input,
                            ...(focusedInput === 'location' ? styles.inputFocus : {}),
                          }}
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Price Per Slot (₹) *</label>
                        <input
                          name="pricePerSlot"
                          type="number"
                          value={form.pricePerSlot}
                          onChange={handleChange}
                          onFocus={() => setFocusedInput('pricePerSlot')}
                          onBlur={() => setFocusedInput(null)}
                          required
                          min="0"
                          placeholder="Enter price"
                          style={{
                            ...styles.input,
                            ...(focusedInput === 'pricePerSlot' ? styles.inputFocus : {}),
                          }}
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Available Slots</label>
                        <input
                          name="availableSlots"
                          value={form.availableSlots}
                          onChange={handleChange}
                          onFocus={() => setFocusedInput('availableSlots')}
                          onBlur={() => setFocusedInput(null)}
                          placeholder="09:00-10:00, 10:00-11:00"
                          style={{
                            ...styles.input,
                            ...(focusedInput === 'availableSlots' ? styles.inputFocus : {}),
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ ...styles.inputGroup, marginTop: '16px' }}>
                      <label style={styles.inputLabel}>Photo (optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) {
                            setPhotoFile(null);
                            setPhotoPreview('');
                            return;
                          }
                          setPhotoFile(file);
                          const reader = new FileReader();
                          reader.onload = () => setPhotoPreview(reader.result);
                          reader.readAsDataURL(file);
                        }}
                        style={styles.fileInput}
                      />
                      {photoPreview && (
                        <div style={{ marginTop: '12px' }}>
                          <img src={photoPreview} alt="preview" style={{ maxWidth: '200px', borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                      <button
                        type="submit"
                        style={{
                          ...styles.submitButton,
                          ...(hoveredButton === 'submit' ? styles.submitButtonHover : {}),
                        }}
                        onMouseEnter={() => setHoveredButton('submit')}
                        onMouseLeave={() => setHoveredButton(null)}
                      >
                        <PlusIcon />
                        {editingId ? 'Update Ground' : 'Create Ground'}
                      </button>
                      {editingId && (
                        <button type="button" onClick={resetForm} style={styles.cancelButton}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Grounds List */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                    My Grounds ({myGrounds.length})
                  </h3>
                  {!isSelectionMode ? (
                    <button
                      onClick={enterSelectionMode}
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                    >
                      <TrashIcon />
                      Select to Delete
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4B5563', cursor: 'pointer' }}>
                        <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} style={styles.checkbox} />
                        Select all
                      </label>
                      <button onClick={handleDeleteSelected} style={{ ...styles.actionButton, backgroundColor: '#DC2626', color: '#FFFFFF' }}>
                        <TrashIcon />
                        Delete Selected ({selectedIds.length})
                      </button>
                      <button onClick={exitSelectionMode} style={styles.cancelButton}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {loading ? (
                  <p style={styles.loadingText}>Loading your grounds...</p>
                ) : myGrounds.length === 0 ? (
                  <p style={styles.emptyText}>You do not have any grounds yet. Create one above!</p>
                ) : (
                  <div>
                    {myGrounds.map((ground) => {
                      const groundBookings = bookings[ground._id] || [];
                      const reviews = groundBookings
                        .map((b) => ({ booking: b, review: b.review }))
                        .filter((r) => r.review && r.review.visible);

                      return (
                        <div key={ground._id} style={styles.groundCard}>
                          <div style={styles.groundCardHeader}>
                            {isSelectionMode && (
                              <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(ground._id)}
                                  onChange={() => toggleSelect(ground._id)}
                                  style={styles.checkbox}
                                />
                              </div>
                            )}
                            {ground.photo ? (
                              <img src={ground.photo} alt={ground.groundName} style={styles.groundImage} />
                            ) : (
                              <div style={styles.groundImagePlaceholder}>
                                <FieldIcon />
                                <span style={{ marginLeft: '8px' }}>No Photo</span>
                              </div>
                            )}
                            <div style={styles.groundInfo}>
                              <div>
                                <div style={styles.groundName}>{ground.groundName}</div>
                                <div style={styles.groundMeta}>
                                  <LocationIcon />
                                  {ground.location}
                                </div>
                                <div style={styles.groundMeta}>
                                  <ClockIcon />
                                  Slots: {(ground.availableSlots || []).join(', ') || 'None'}
                                </div>
                              </div>
                              <div>
                                <div style={styles.groundPrice}>₹{ground.pricePerSlot}/slot</div>
                                <div style={styles.groundActions}>
                                  <button
                                    onClick={() => handleEdit(ground)}
                                    style={{ ...styles.actionButton, ...styles.editButton }}
                                  >
                                    <EditIcon />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(ground._id)}
                                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                                  >
                                    <TrashIcon />
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => loadBookingsForGround(ground._id)}
                                    style={{ ...styles.actionButton, ...styles.refreshBookingsButton }}
                                  >
                                    <RefreshIcon />
                                    Refresh
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Reviews Section - click header to show/hide */}
                          {reviews.length > 0 && (
                            <div style={styles.sectionCard}>
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setReviewsExpanded((prev) => ({ ...prev, [ground._id]: !prev[ground._id] }))}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setReviewsExpanded((prev) => ({ ...prev, [ground._id]: !prev[ground._id] })); } }}
                                style={{
                                  ...styles.sectionHeader,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  userSelect: 'none',
                                }}
                              >
                                <span>Reviews ({reviews.length})</span>
                                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                                  {reviewsExpanded[ground._id] ? '▼ Hide' : '▶ Show'}
                                </span>
                              </div>
                              {reviewsExpanded[ground._id] && (
                                <div style={styles.sectionContent}>
                                  {reviews.map(({ booking, review }) => (
                                    <div key={booking._id} style={styles.reviewCard}>
                                      <div style={styles.reviewStars}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <StarIcon key={star} filled={star <= (review.rating || 0)} />
                                        ))}
                                        <span style={{ marginLeft: '8px', fontSize: '13px', color: '#6B7280' }}>({review.rating})</span>
                                      </div>
                                      {review.text && <div style={styles.reviewText}>{review.text}</div>}
                                      <div style={styles.reviewMeta}>
                                        By {booking.userID?.name || 'User'} • {review.reviewedAt ? new Date(review.reviewedAt).toLocaleDateString() : ''}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Bookings Section */}
                          <div style={styles.sectionCard}>
                            <div style={styles.sectionHeader}>Bookings ({groundBookings.length})</div>
                            <div style={styles.sectionContent}>
                              {loadingBookings[ground._id] ? (
                                <p style={{ color: '#6B7280', fontSize: '14px' }}>Loading bookings...</p>
                              ) : groundBookings.length === 0 ? (
                                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>No bookings yet.</p>
                              ) : (
                                <div style={styles.tableWrapper}>
                                  <table style={styles.table}>
                                    <thead style={styles.tableHeader}>
                                      <tr>
                                        <th style={styles.tableHeaderCell}>User</th>
                                        <th style={styles.tableHeaderCell}>Date</th>
                                        <th style={styles.tableHeaderCell}>Time Slot</th>
                                        <th style={styles.tableHeaderCell}>Status</th>
                                        <th style={styles.tableHeaderCell}>Payment</th>
                                        <th style={styles.tableHeaderCell}>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {groundBookings.map((booking, idx) => (
                                        <tr
                                          key={booking._id}
                                          style={{
                                            ...styles.tableRow,
                                            ...(hoveredRow === `booking-${ground._id}-${idx}` ? styles.tableRowHover : {}),
                                          }}
                                          onMouseEnter={() => setHoveredRow(`booking-${ground._id}-${idx}`)}
                                          onMouseLeave={() => setHoveredRow(null)}
                                        >
                                          <td style={styles.tableCell}>
                                            <div style={{ fontWeight: '500' }}>{booking.userID?.name || 'N/A'}</div>
                                            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{booking.userID?.email || ''}</div>
                                          </td>
                                          <td style={styles.tableCell}>
                                            {new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                          </td>
                                          <td style={styles.tableCell}>{booking.timeSlot}</td>
                                          <td style={styles.tableCell}>
                                            <span style={{ ...styles.statusBadge, ...getStatusBadgeStyle(booking.status) }}>
                                              {booking.status}
                                            </span>
                                          </td>
                                          <td style={styles.tableCell}>
                                            <span style={{
                                              ...styles.statusBadge,
                                              ...(booking.paymentStatus === 'Paid' ? styles.paymentPaid : styles.paymentUnpaid),
                                            }}>
                                              {booking.paymentStatus || 'Unpaid'}
                                            </span>
                                          </td>
                                          <td style={styles.tableCell}>
                                            {booking.status === 'Pending' && (
                                              <>
                                                <button
                                                  onClick={() => handleApprove(booking._id, ground._id)}
                                                  style={styles.approveButton}
                                                >
                                                  Approve
                                                </button>
                                                <button
                                                  onClick={() => handleReject(booking._id, ground._id)}
                                                  style={styles.rejectButton}
                                                >
                                                  Reject
                                                </button>
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
          .earnings-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 768px) {
          .summary-grid {
            grid-template-columns: 1fr !important;
          }
          .earnings-grid {
            grid-template-columns: 1fr !important;
          }
          .form-grid {
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
      `}</style>
    </div>
  );
}

export default GroundManagerDashboard;

