// Privacy utility for hiding/showing sensitive monetary information
const PRIVACY_STORAGE_KEY_PREFIX = 'dashboard_privacy_';

/**
 * Get the current privacy mode state from localStorage for a specific component
 * @param {string} componentId - Unique identifier for the component (e.g., 'exchange', 'trading')
 * @returns {boolean} True if privacy mode is enabled
 */
export const getPrivacyMode = (componentId = 'global') => {
  const stored = localStorage.getItem(`${PRIVACY_STORAGE_KEY_PREFIX}${componentId}`);
  return stored === 'true';
};

/**
 * Set the privacy mode state in localStorage for a specific component
 * @param {boolean} enabled - Whether privacy mode should be enabled
 * @param {string} componentId - Unique identifier for the component
 */
export const setPrivacyMode = (enabled, componentId = 'global') => {
  localStorage.setItem(`${PRIVACY_STORAGE_KEY_PREFIX}${componentId}`, enabled.toString());
};

/**
 * Toggle privacy mode and return the new state for a specific component
 * @param {string} componentId - Unique identifier for the component
 * @returns {boolean} The new privacy mode state
 */
export const togglePrivacyMode = (componentId = 'global') => {
  const newState = !getPrivacyMode(componentId);
  setPrivacyMode(newState, componentId);
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
