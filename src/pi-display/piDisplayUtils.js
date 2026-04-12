const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export const PANEL_IDS = ['now', 'garden', 'daily', 'library', 'system', 'gym'];

export const PANEL_LABELS = {
  alerts: 'Alerts',
  now: 'Now',
  garden: 'Garden',
  daily: 'Daily Ops',
  library: 'Library',
  system: 'System',
  gym: 'Gym',
};

export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatShortDate = (value) => {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

export const formatClock = (date) => new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(date);

export const formatDisplayDate = (date) => new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
}).format(date).toUpperCase();

export const getDaysBetween = (start, end) => {
  if (!start || !end) {
    return null;
  }

  return Math.ceil((start - end) / MILLISECONDS_PER_DAY);
};

export const addDays = (value, days) => {
  const date = parseDate(value);
  if (!date) {
    return null;
  }

  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const pluralize = (value, singular, plural = `${singular}s`) => (
  `${value} ${value === 1 ? singular : plural}`
);

export const formatPercent = (value) => (
  typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value)}%` : 'n/a'
);

export const formatTemperature = (value) => (
  typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value)}°C` : 'n/a'
);

export const formatUptime = (value) => (
  typeof value === 'string' && value.trim() ? value : 'n/a'
);

export const getCurrentDayNumber = () => {
  const day = new Date().getDay();
  return day === 0 ? 7 : day;
};
