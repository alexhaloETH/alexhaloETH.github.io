const getStreakUnit = (recurrenceType, count) => {
  const plural = count === 1 ? '' : 's';
  if (recurrenceType === 'daily') return `day${plural}`;
  if (recurrenceType === 'weekly') return `week${plural}`;
  if (recurrenceType === 'biweekly') return `cycle${plural}`;
  if (recurrenceType === 'monthly') return `month${plural}`;
  return `streak${plural}`;
};

const formatPeriodTitle = (period, recurrenceType) => {
  if (!period) return '';
  const start = period.periodStart ? new Date(period.periodStart) : null;
  const end = period.periodEnd ? new Date(period.periodEnd) : null;
  if (!start || Number.isNaN(start.getTime())) return '';

  if (recurrenceType === 'daily') {
    return start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  if (!end || Number.isNaN(end.getTime())) {
    return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const startLabel = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endLabel = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startLabel} - ${endLabel}`;
};

const formatTimeUntil = (isoString) => {
  if (!isoString) return '—';
  const target = new Date(isoString).getTime();
  if (Number.isNaN(target)) return '—';
  const diffMs = target - Date.now();
  if (diffMs <= 0) return 'Now';
  const totalMinutes = Math.ceil(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const formatShortDate = (isoString) => {
  if (!isoString) return '---';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '---';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatAmount = (value) => {
  if (value === null || value === undefined) return '—';
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(numberValue);
};

export { formatAmount, formatPeriodTitle, formatShortDate, formatTimeUntil, getStreakUnit };
