// API Configuration
// Change this if your backend runs on a different URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_URL = API_BASE_URL;
export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    me: `${API_BASE_URL}/api/auth/me`,
  },
  grounds: {
    list: `${API_BASE_URL}/api/grounds`,
    detail: (id) => `${API_BASE_URL}/api/grounds/${id}`,
    create: `${API_BASE_URL}/api/grounds`,
    update: (id) => `${API_BASE_URL}/api/grounds/${id}`,
    delete: (id) => `${API_BASE_URL}/api/grounds/${id}`,
    myGrounds: `${API_BASE_URL}/api/grounds/manager/my-grounds`,
  },
  bookings: {
    create: `${API_BASE_URL}/api/bookings`,
    userBookings: `${API_BASE_URL}/api/bookings/user`,
    groundBookings: (groundId) => `${API_BASE_URL}/api/bookings/ground/${groundId}`,
    allBookings: `${API_BASE_URL}/api/bookings`,
    approve: (id) => `${API_BASE_URL}/api/bookings/${id}/approve`,
    reject: (id) => `${API_BASE_URL}/api/bookings/${id}/reject`,
    availability: `${API_BASE_URL}/api/bookings/availability`,
  },
  payments: {
    create: `${API_BASE_URL}/api/payments`,
    userPayments: `${API_BASE_URL}/api/payments/user`,
    allPayments: `${API_BASE_URL}/api/payments`,
    verify: (id) => `${API_BASE_URL}/api/payments/${id}/verify`,
    refund: (id) => `${API_BASE_URL}/api/payments/${id}/refund`,
  },
  admin: {
    users: `${API_BASE_URL}/api/admin/users`,
    updateUserRole: (id) => `${API_BASE_URL}/api/admin/users/${id}/role`,
    deleteUser: (id) => `${API_BASE_URL}/api/admin/users/${id}`,
    stats: `${API_BASE_URL}/api/admin/stats`,
  },
};
