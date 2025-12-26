// Authentication utility functions
// This file provides helper functions for including JWT tokens in API requests

/**
 * Get authorization headers with JWT token
 * @returns {Object} Headers object with Authorization header if token exists
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('dashboard_token');

  if (!token) {
    return {
      'Content-Type': 'application/json',
    };
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Get authorization headers without Content-Type (for requests that don't send JSON)
 * @returns {Object} Headers object with Authorization header if token exists
 */
export const getAuthHeadersOnly = () => {
  const token = localStorage.getItem('dashboard_token');

  if (!token) {
    return {};
  }

  return {
    'Authorization': `Bearer ${token}`,
  };
};
