/**
 * Utility functions for role-based routing
 */

/**
 * Get the dashboard path for a specific role
 * @param {string} role - User role
 * @returns {string} Dashboard path
 */
export const getDashboardPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'groundManager':
      return '/ground-manager';
    case 'paymentManager':
      return '/payment-manager';
    case 'user':
      return '/my-bookings';
    default:
      return '/login';
  }
};

/**
 * Get allowed routes for a specific role
 * @param {string} role - User role
 * @returns {string[]} Array of allowed route paths
 */
export const getAllowedRoutes = (role) => {
  switch (role) {
    case 'admin':
      return ['/admin'];
    case 'groundManager':
      return ['/ground-manager'];
    case 'paymentManager':
      return ['/payment-manager'];
    case 'user':
      return ['/grounds', '/book', '/my-bookings', '/payment'];
    default:
      return [];
  }
};

/**
 * Check if a route is allowed for a role
 * @param {string} role - User role
 * @param {string} path - Route path
 * @returns {boolean} True if route is allowed
 */
export const isRouteAllowed = (role, path) => {
  const allowedRoutes = getAllowedRoutes(role);
  
  // Check exact matches
  if (allowedRoutes.includes(path)) {
    return true;
  }

  // Check dynamic routes (e.g., /book/:id, /payment/:id)
  if (role === 'user') {
    if (path.startsWith('/book/')) return true;
    if (path.startsWith('/payment/')) return true;
  }

  return false;
};

/**
 * Get navigation links for a specific role
 * @param {string} role - User role
 * @returns {Array} Array of navigation link objects {to, label}
 */
export const getNavLinks = (role) => {
  switch (role) {
    case 'admin':
      return [{ to: '/admin', label: 'Admin Dashboard' }];
    case 'groundManager':
      return [{ to: '/ground-manager', label: 'Ground Manager Dashboard' }];
    case 'paymentManager':
      return [{ to: '/payment-manager', label: 'Payment Manager Dashboard' }];
    case 'user':
      return [
        { to: '/grounds', label: 'Browse Grounds' },
        { to: '/my-bookings', label: 'My Bookings' },
      ];
    default:
      return [];
  }
};
