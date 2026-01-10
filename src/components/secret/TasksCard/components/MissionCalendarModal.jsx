import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { formatAmount, formatPeriodTitle, formatShortDate } from '../TasksCard.utils';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const startOfDay = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const formatKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatRange = (start, end) => {
  const startLabel = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endLabel = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startLabel} - ${endLabel}`;
};

const buildCalendarDays = (mission) => {
  const today = startOfDay(new Date());
  const createdAt = mission.createdAt ? startOfDay(new Date(mission.createdAt)) : null;
  const dayIndex = (today.getDay() + 6) % 7;
  const gridStart = startOfDay(new Date(today));
  gridStart.setDate(today.getDate() - (dayIndex + 35));
  const gridEnd = startOfDay(new Date(gridStart));
  gridEnd.setDate(gridStart.getDate() + 41);

  const periodMap = new Map();
  const periods = mission.recentPeriods || [];

  periods.forEach((period) => {
    const start = period.periodStart ? startOfDay(new Date(period.periodStart)) : null;
    const end = period.periodEnd ? startOfDay(new Date(period.periodEnd)) : null;
    if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return;
    }

    const cursor = new Date(start);
    while (cursor < end) {
      if (createdAt && cursor < createdAt) {
        cursor.setDate(cursor.getDate() + 1);
        continue;
      }
      if (cursor >= gridStart && cursor <= gridEnd) {
        periodMap.set(formatKey(cursor), {
          completed: period.completed,
          isCurrent: period.isCurrent,
          periodStart: period.periodStart,
          periodEnd: period.periodEnd,
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const key = formatKey(date);
    const period = periodMap.get(key);
    const isFuture = date > today;
    const isInactive = createdAt && date < createdAt;
    const isToday = key === formatKey(today);

    let status = 'empty';
    if (isInactive) {
      status = 'inactive';
    } else if (period) {
      status = period.completed ? 'completed' : period.isCurrent ? 'current' : 'missed';
    } else if (isFuture) {
      status = 'future';
    }

    days.push({
      key,
      date,
      status,
      isToday,
      period,
    });
  }

  return {
    days,
    rangeLabel: formatRange(gridStart, gridEnd),
  };
};

function MissionCalendarModal({ mission, onClose }) {
  const isAmount = mission.missionType === 'amount';
  const [showFullHistory, setShowFullHistory] = useState(false);
  const { days, rangeLabel } = useMemo(() => (
    isAmount ? { days: [], rangeLabel: '' } : buildCalendarDays(mission)
  ), [mission, isAmount]);
  const completedPeriods = (mission.recentPeriods || []).filter((period) => period.completed).length;
  const totalPeriods = mission.recentPeriods ? mission.recentPeriods.length : 0;
  const consistency = totalPeriods ? Math.round((completedPeriods / totalPeriods) * 100) : 0;
  const unitLabel = mission.unit?.trim() || 'count';
  const amountSeries = useMemo(() => {
    if (!isAmount) {
      return { series: [], maxValue: 1, totalEntries: 0 };
    }
    const allSeries = mission.recentAmounts || [];
    const series = showFullHistory ? allSeries : allSeries.slice(-12);
    const maxValue = Math.max(
      1,
      ...series.map((period) => period.amount ?? 0),
      mission.targetAmount || 0
    );
    return { series, maxValue, totalEntries: allSeries.length };
  }, [isAmount, mission, showFullHistory]);
  const formatWithUnit = (value) => {
    const formatted = formatAmount(value);
    return formatted === '—' ? formatted : `${formatted} ${unitLabel}`;
  };

  if (isAmount) {
    const targetAmount = mission.targetAmount ?? null;
    const targetLinePosition = targetAmount
      ? Math.min(100, (targetAmount / amountSeries.maxValue) * 100)
      : null;
    const entriesLabel = targetAmount ? 'Target hits' : 'Entries';

    return (
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content mission-calendar-modal amount-modal"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="calendar-title">
              <span className="calendar-subtitle">Mission Tracker</span>
              <h3 title={mission.name}>{mission.name}</h3>
              <div className="mission-footer-tags">
                <span className={`recurrence-badge ${mission.recurrenceType}`}>{mission.recurrenceType}</span>
                <span className="mission-type-badge">Amount</span>
              </div>
            </div>
            <button className="modal-close" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="modal-body">
            <div className="calendar-stats">
              <div className="calendar-stat">
                <span>Current</span>
                <strong>{formatWithUnit(mission.currentAmount)}</strong>
              </div>
              <div className="calendar-stat">
                <span>Best</span>
                <strong>{formatWithUnit(mission.bestAmount)}</strong>
              </div>
              <div className="calendar-stat">
                <span>Avg</span>
                <strong>{formatWithUnit(mission.averageAmount)}</strong>
              </div>
            </div>

            <div className="amount-chart-panel">
              <div className="amount-chart-header">
                <div>
                  <span className="calendar-range">
                    {showFullHistory ? `All ${amountSeries.totalEntries} entries` : `Recent ${amountSeries.series.length}`}
                  </span>
                  <span className="calendar-caption">
                    Track your logged amounts per period
                  </span>
                </div>
                <div className="amount-chart-controls">
                  {amountSeries.totalEntries > 12 && (
                    <button
                      className={`view-toggle-btn ${showFullHistory ? 'active' : ''}`}
                      onClick={() => setShowFullHistory(!showFullHistory)}
                      title={showFullHistory ? 'Show recent 12' : 'Show full history'}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {showFullHistory ? (
                          <>
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M9 9h6v6H9z" />
                          </>
                        ) : (
                          <>
                            <path d="M3 3h18v18H3z" />
                            <path d="M7 7h10" />
                            <path d="M7 12h10" />
                            <path d="M7 17h10" />
                          </>
                        )}
                      </svg>
                      🔄
                    </button>
                  )}
                  {targetAmount !== null && targetAmount !== undefined && (
                    <div className="amount-target-badge">
                      Target {formatWithUnit(targetAmount)}
                    </div>
                  )}
                </div>
              </div>
              <div className={`amount-chart ${showFullHistory ? 'full-history' : ''}`}>
                {targetLinePosition !== null && (
                  <span
                    className="amount-target-line"
                    style={{ bottom: `${targetLinePosition}%` }}
                  />
                )}
                {amountSeries.series.map((period, index) => {
                  const height = period.amount ? (period.amount / amountSeries.maxValue) * 100 : 0;
                  return (
                    <span
                      key={period.periodEnd || `${mission.id}-${index}`}
                      className={`amount-bar ${period.amount ? 'has-value' : 'empty'} ${period.isCurrent ? 'current' : ''}`}
                      style={{ height: `${height}%` }}
                      title={`${formatPeriodTitle(period, mission.recurrenceType)}${period.amount ? ` • ${formatWithUnit(period.amount)}` : ''}`}
                    />
                  );
                })}
              </div>
            </div>
            {targetAmount !== null && targetAmount !== undefined && (
              <div className="amount-streak-summary">
                Target streak: <strong>{mission.currentStreak || 0}</strong>
                <span>Best {mission.bestStreak || 0}</span>
              </div>
            )}
          </div>

          <div className="modal-footer amount-footer">
            <div className="calendar-footer-meta">
              Total logged: <strong>{formatWithUnit(mission.totalAmount)}</strong>
            </div>
            <div className="calendar-footer-meta">
              {entriesLabel}: <strong>{mission.totalCompletions || 0}</strong>
            </div>
            <div className="calendar-footer-meta">
              Last log: <strong>{formatShortDate(mission.lastCompletedAt)}</strong>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={onClose}>Close</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content mission-calendar-modal"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="calendar-title">
            <span className="calendar-subtitle">Mission Calendar</span>
            <h3 title={mission.name}>{mission.name}</h3>
            <span className={`recurrence-badge ${mission.recurrenceType}`}>{mission.recurrenceType}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="calendar-stats">
            <div className="calendar-stat">
              <span>Streak</span>
              <strong>{mission.currentStreak || 0}</strong>
            </div>
            <div className="calendar-stat">
              <span>Best</span>
              <strong>{mission.bestStreak || 0}</strong>
            </div>
            <div className="calendar-stat">
              <span>Cons.</span>
              <strong>{consistency}%</strong>
            </div>
          </div>

          <div className="calendar-panel">
            <div className="calendar-panel-header">
              <div>
                <span className="calendar-range">{rangeLabel}</span>
                <span className="calendar-caption">Last 6 weeks</span>
              </div>
              <div className="calendar-legend">
                <span className="legend-item">
                  <span className="legend-dot completed" />
                  Completed
                </span>
                <span className="legend-item">
                  <span className="legend-dot current" />
                  Now
                </span>
                <span className="legend-item">
                  <span className="legend-dot missed" />
                  Missed
                </span>
                <span className="legend-item">
                  <span className="legend-dot inactive" />
                  New
                </span>
              </div>
            </div>

            <div className="calendar-weekdays">
              {WEEKDAYS.map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>

            <div className="calendar-days">
              {days.map((day) => (
                <button
                  key={day.key}
                  type="button"
                  className={`calendar-day ${day.status} ${day.isToday ? 'today' : ''}`}
                  title={`${day.date.toDateString()}${day.period ? ` • ${day.period.completed ? 'Completed' : 'Missed'}` : ''}`}
                >
                  <span>{day.date.getDate()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="calendar-footer-meta">
            Total completions: <strong>{mission.totalCompletions || 0}</strong>
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Close</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default MissionCalendarModal;
