import { useEffect, useState } from 'react';
import ImageGallery from './ImageGallery';
import {
  formatAmount,
  formatPeriodTitle,
  formatShortDate,
  formatTimeUntil,
  getStreakUnit,
} from '../TasksCard.utils';

function MissionsView({
  missions,
  onShowAddMission,
  onToggleMission,
  onEditMission,
  onOpenCalendar,
  onLogAmount,
}) {
  const [amountInputs, setAmountInputs] = useState({});

  useEffect(() => {
    setAmountInputs((prev) => {
      const next = { ...prev };
      missions.forEach((mission) => {
        if (mission.missionType !== 'amount') return;
        if (next[mission.id] === undefined) {
          next[mission.id] = mission.currentAmount !== null && mission.currentAmount !== undefined
            ? String(mission.currentAmount)
            : '';
        }
      });
      return next;
    });
  }, [missions]);

  const handleAmountChange = (id, value) => {
    setAmountInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogAmount = (missionId) => {
    if (!onLogAmount) return;
    const rawValue = amountInputs[missionId];
    if (rawValue === undefined) return;
    const trimmed = String(rawValue).trim();
    if (!trimmed) return;
    const numericValue = Number(trimmed);
    if (Number.isNaN(numericValue)) return;
    onLogAmount(missionId, numericValue);
    setAmountInputs((prev) => ({
      ...prev,
      [missionId]: String(numericValue),
    }));
  };

  const handleAmountKeyDown = (event, missionId) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLogAmount(missionId);
    }
  };

  return (
    <>
      <button className="add-mission-btn" onClick={onShowAddMission}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Add new mission</span>
      </button>
      <div className="missions-grid">
        {missions.map((mission) => {
          const isAmount = mission.missionType === 'amount';
          const unitLabel = mission.unit?.trim() || 'count';
          const currentAmount = mission.currentAmount ?? null;
          const targetAmount = mission.targetAmount ?? null;
          const progressValue = targetAmount
            ? Math.min(100, ((currentAmount ?? 0) / targetAmount) * 100)
            : 0;
          const amountHistory = mission.recentAmounts || [];
          const amountPreview = amountHistory.slice(-12);
          const amountMax = Math.max(
            1,
            ...amountPreview.map((period) => period.amount ?? 0),
            targetAmount || 0
          );
          const amountInputValue = amountInputs[mission.id]
            ?? (currentAmount !== null && currentAmount !== undefined ? String(currentAmount) : '');
          const periodsForStats = mission.recentPeriods || [];
          const createdAt = mission.createdAt ? new Date(mission.createdAt) : null;
          const validPeriods = createdAt && !Number.isNaN(createdAt.getTime())
            ? periodsForStats.filter((period) => {
              if (!period.periodEnd) return false;
              const end = new Date(period.periodEnd);
              return !Number.isNaN(end.getTime()) && end >= createdAt;
            })
            : periodsForStats;
          const historyPreview = validPeriods.slice(-12);
          const completedCount = validPeriods.filter((period) => period.completed).length;
          const consistency = validPeriods.length
            ? Math.round((completedCount / validPeriods.length) * 100)
            : 0;
          const streakUnit = getStreakUnit(mission.recurrenceType, mission.currentStreak || 0);
          const resetsIn = formatTimeUntil(mission.nextResetAt);
          const lastDone = formatShortDate(mission.lastCompletedAt);
          const entriesLabel = targetAmount ? 'Hits' : 'Entries';
          const formattedAmount = (value) => {
            const formatted = formatAmount(value);
            return formatted === '—' ? formatted : `${formatted} ${unitLabel}`;
          };

          return (
            <div
              key={mission.id}
              className={`mission-card ${!isAmount && mission.completed ? 'completed' : ''} ${isAmount ? 'amount' : ''}`}
              onClick={() => onOpenCalendar(mission)}
            >
              <div className="mission-header">
                {isAmount ? (
                  <div className="mission-type-indicator amount">#</div>
                ) : (
                  <button
                    className={`mission-checkbox ${mission.completed ? 'checked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMission(mission.id);
                    }}
                  >
                    {mission.completed && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    )}
                  </button>
                )}
                <h4>{mission.name}</h4>
              </div>
              {mission.description && (
                <p className="mission-description">{mission.description}</p>
              )}
              {isAmount ? (
                <div className="mission-amount-panel">
                  <div
                    className="amount-input-row"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="number"
                      className="amount-input"
                      value={amountInputValue}
                      onChange={(e) => handleAmountChange(mission.id, e.target.value)}
                      onKeyDown={(e) => handleAmountKeyDown(e, mission.id)}
                      placeholder={`Enter ${unitLabel}`}
                      min="0"
                    />
                    <button
                      className="amount-log-btn"
                      onClick={() => handleLogAmount(mission.id)}
                    >
                      Log
                    </button>
                  </div>
                  <div className="amount-metrics-grid">
                    <div className="amount-metric">
                      <span>Current</span>
                      <strong>{formattedAmount(currentAmount)}</strong>
                    </div>
                    <div className="amount-metric">
                      <span>Best</span>
                      <strong>{formattedAmount(mission.bestAmount)}</strong>
                    </div>
                    <div className="amount-metric">
                      <span>Avg</span>
                      <strong>{formattedAmount(mission.averageAmount)}</strong>
                    </div>
                    <div className="amount-metric">
                      <span>{entriesLabel}</span>
                      <strong>{mission.totalCompletions || 0}</strong>
                    </div>
                  </div>
                  {targetAmount !== null && targetAmount !== undefined && (
                    <div className="amount-target">
                      <div className="amount-target-bar">
                        <span
                          className="amount-target-fill"
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>
                    <div className="amount-target-meta">
                      Target {formattedAmount(targetAmount)}
                      {currentAmount !== null && currentAmount !== undefined && currentAmount >= targetAmount
                          ? ' met'
                          : ''}
                    </div>
                  </div>
                  )}
                  {amountPreview.length > 0 && (
                    <div className="amount-history">
                      <span className="amount-history-label">
                        Recent {amountPreview.length}
                      </span>
                      <div className="amount-history-bars">
                        {amountPreview.map((period, index) => {
                          const height = period.amount ? (period.amount / amountMax) * 100 : 0;
                          return (
                            <span
                              key={period.periodEnd || `${mission.id}-${index}`}
                              className={`amount-history-bar ${period.amount ? 'has-value' : 'empty'} ${period.isCurrent ? 'current' : ''}`}
                              style={{ height: `${height}%` }}
                              title={`${formatPeriodTitle(period, mission.recurrenceType)}${period.amount ? ` • ${formatAmount(period.amount)} ${unitLabel}` : ''}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mission-metrics">
                  <div className="streak-core">
                    <div className="streak-core-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-4 4-8 4-8z" />
                        <path d="M6 18a6 6 0 0 0 12 0" />
                      </svg>
                    </div>
                    <div className="streak-core-value">{mission.currentStreak || 0}</div>
                    <div className="streak-core-label">{streakUnit}</div>
                  </div>
                  <div className="mission-metrics-right">
                    <div className="metric-grid">
                      <div className="metric-item">
                        <span>Best</span>
                        <strong>{mission.bestStreak || 0}</strong>
                      </div>
                      <div className="metric-item">
                        <span>Total</span>
                        <strong>{mission.totalCompletions || 0}</strong>
                      </div>
                      <div className="metric-item">
                        <span>Cons.</span>
                        <strong>{consistency}%</strong>
                      </div>
                    </div>
                    <div className="consistency-bar">
                      <span className="consistency-fill" style={{ width: `${consistency}%` }} />
                    </div>
                  </div>
                </div>
              )}
              <div className="mission-meta">
                <div>
                  <span className="meta-label">Reset</span>
                  <span className="meta-value">{resetsIn}</span>
                </div>
                <div>
                  <span className="meta-label">{isAmount ? 'Last log' : 'Last'}</span>
                  <span className="meta-value">{lastDone}</span>
                </div>
              </div>
              {!isAmount && historyPreview.length > 0 && (
                <div className="mission-history">
                  <span className="mission-history-label">
                    Recent {historyPreview.length}
                  </span>
                  <div className="mission-history-dots">
                    {historyPreview.map((period, index) => (
                      <span
                        key={period.periodEnd || `${mission.id}-${index}`}
                        className={`mission-history-dot ${
                          period.completed ? 'completed' : period.isCurrent ? 'current' : 'missed'
                        }`}
                        title={formatPeriodTitle(period, mission.recurrenceType)}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="mission-gallery" onClick={(e) => e.stopPropagation()}>
                <ImageGallery
                  entityType="mission"
                  entityId={mission.id}
                />
              </div>
              <div className="mission-footer">
                <div className="mission-footer-tags">
                  <span className={`recurrence-badge ${mission.recurrenceType}`}>
                    {mission.recurrenceType}
                  </span>
                  {isAmount && (
                    <span className="mission-type-badge">
                      Amount
                    </span>
                  )}
                </div>
                <button
                  className="edit-mission-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditMission(mission);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default MissionsView;
