// Measurement units mapping
export const measurements = [
  'pcs',
  'g',
  'ml',
  'kg',
  'L',
  'slices',
  'cloves',
  'cobs',
  'heads',
  'bunches',
  'head',
];

// Emoji mapping
export const emojis = [
  '🥚',
  '🥛',
  '🧈',
  '🍞',
  '🧀',
  '🥓',
  '🍅',
  '🧅',
  '🧄',
  '🍝',
  '🍚',
  '🍗',
  '🫑',
  '🍄',
  '🫒',
  '🥔',
  '🥕',
  '🥒',
  '🥬',
  '🌽',
  '🥦',
  '🍎',
  '🍌',
  '🍊',
  '🍓',
  '🍇',
  '🥩',
  '🦐',
  '🌾',
  '🧂',
  '🌶️',
  '🫗',
  '🍯',
  '🥑',
  '🍋',
  '🐟',
  '☕',
  '🥜',
  '🥥',
  '🫘',
  '📦', // default icon
];

// Convert backend pantry item to frontend format
export const transformPantryItem = (backendItem) => {
  return {
    id: backendItem.id,
    name: backendItem.name,
    quantity: backendItem.amount,
    unit: measurements[backendItem.measurement_id] || 'pcs',
    icon: emojis[backendItem.icon_id] || '📦',
    category: 'pantry', // Backend doesn't have category yet
  };
};

// Convert frontend pantry item to backend format
export const transformToBackendFormat = (frontendItem) => {
  const measurementId = measurements.indexOf(frontendItem.unit);
  const iconId = emojis.indexOf(frontendItem.icon);

  return {
    name: frontendItem.name,
    amount: frontendItem.quantity,
    measurement_id: measurementId >= 0 ? measurementId : 0,
    icon_id: iconId >= 0 ? iconId : emojis.length - 1, // Default to 📦
  };
};
