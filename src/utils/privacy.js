// Privacy utility for hiding/showing sensitive monetary information
const PRIVACY_STORAGE_KEY = 'dashboard_privacy_mode';

/**
 * Get the current privacy mode state from localStorage
 * @returns {boolean} True if privacy mode is enabled
 */
export const getPrivacyMode = () => {
  const stored = localStorage.getItem(PRIVACY_STORAGE_KEY);
  return stored === 'true';
};

/**
 * Set the privacy mode state in localStorage
 * @param {boolean} enabled - Whether privacy mode should be enabled
 */
export const setPrivacyMode = (enabled) => {
  localStorage.setItem(PRIVACY_STORAGE_KEY, enabled.toString());
};

/**
 * Toggle privacy mode and return the new state
 * @returns {boolean} The new privacy mode state
 */
export const togglePrivacyMode = () => {
  const newState = !getPrivacyMode();
  setPrivacyMode(newState);
  return newState;
};

/**
 * Format a monetary value, hiding it if privacy mode is enabled
 * @param {number} value - The monetary value to format
 * @param {boolean} isPrivate - Whether privacy mode is enabled
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted or hidden value
 */
export const formatMoney = (value, isPrivate, currency = '$') => {
  if (isPrivate) {
    return `${currency}${'*'.repeat(6)}`;
  }
  return `${currency}${value.toLocaleString()}`;
};

/**
 * Format a percentage value, hiding it if privacy mode is enabled
 * @param {number} value - The percentage value to format
 * @param {boolean} isPrivate - Whether privacy mode is enabled
 * @returns {string} Formatted or hidden percentage
 */
export const formatPercentage = (value, isPrivate) => {
  if (isPrivate) {
    return '***%';
  }
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value}%`;
};

/**
 * Format a numeric value, hiding it if privacy mode is enabled
 * @param {number} value - The numeric value to format
 * @param {boolean} isPrivate - Whether privacy mode is enabled
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted or hidden number
 */
export const formatNumber = (value, isPrivate, decimals = 2) => {
  if (isPrivate) {
    return '*'.repeat(4);
  }
  return value.toFixed(decimals);
};
