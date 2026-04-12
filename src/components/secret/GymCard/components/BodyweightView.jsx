import { useState } from 'react';
import { motion } from 'framer-motion';

const getTodayDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const formatDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

function BodyweightView({ gymData, canWrite }) {
  const { bodyweightLogs, logBodyweight, removeBodyweightLog, stats } = gymData;
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight || isSubmitting) return;

    setIsSubmitting(true);
    const success = await logBodyweight({
      logDate: getTodayDateString(),
      weight: parseFloat(weight),
      bodyFatPercent: bodyFat ? parseFloat(bodyFat) : null,
      notes: notes || null,
    });

    if (success) {
      setWeight('');
      setBodyFat('');
      setNotes('');
    }
    setIsSubmitting(false);
  };

  // Calculate change from previous entry
  const getChange = (index) => {
    if (index >= bodyweightLogs.length - 1) return null;
    const current = bodyweightLogs[index].weight;
    const previous = bodyweightLogs[index + 1].weight;
    return current - previous;
  };

  return (
    <motion.div
      className="gym-bodyweight-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Current Stats */}
      <div className="gym-stats-grid">
        <div className="gym-stat-card accent">
          <span>Current</span>
          <strong>
            {stats.recentBodyweight ? `${stats.recentBodyweight.toFixed(1)}` : '--'}
          </strong>
        </div>
        <div className="gym-stat-card">
          <span>30d Change</span>
          <strong
            style={{
              color: stats.bodyweightChange30d > 0
                ? '#ef4444'
                : stats.bodyweightChange30d < 0
                  ? 'var(--gym-accent)'
                  : undefined,
            }}
          >
            {stats.bodyweightChange30d !== null
              ? `${stats.bodyweightChange30d > 0 ? '+' : ''}${stats.bodyweightChange30d.toFixed(1)}`
              : '--'}
          </strong>
        </div>
        <div className="gym-stat-card">
          <span>Entries</span>
          <strong>{bodyweightLogs.length}</strong>
        </div>
      </div>

      {/* Log Form */}
      {canWrite && (
        <form className="gym-bodyweight-form" onSubmit={handleSubmit}>
          <div className="gym-form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="500"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="80.5"
              required
            />
          </div>
          <div className="gym-form-group">
            <label>Body Fat %</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              placeholder="15"
            />
          </div>
          <div className="gym-form-group" style={{ flex: 1 }}>
            <label>Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
            />
          </div>
          <button
            type="submit"
            className="gym-primary-btn"
            disabled={!weight || isSubmitting}
          >
            {isSubmitting ? 'Logging...' : 'Log Weight'}
          </button>
        </form>
      )}

      {/* History */}
      {bodyweightLogs.length === 0 ? (
        <div className="gym-empty-state">
          <h4>No Bodyweight Logs</h4>
          <p>Start tracking your bodyweight to see trends over time.</p>
        </div>
      ) : (
        <div className="gym-bodyweight-history">
          {bodyweightLogs.slice(0, 20).map((log, index) => {
            const change = getChange(index);
            return (
              <div key={log.id} className="gym-bodyweight-entry">
                <span className="date">{formatDate(log.logDate)}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="weight">{log.weight.toFixed(1)} kg</span>
                  {change !== null && (
                    <span className={`change ${change > 0 ? 'positive' : change < 0 ? 'negative' : ''}`}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)}
                    </span>
                  )}
                  {log.bodyFatPercent && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--gym-muted)' }}>
                      {log.bodyFatPercent}% BF
                    </span>
                  )}
                </div>
                {canWrite && (
                  <button
                    type="button"
                    className="gym-icon-btn"
                    onClick={() => removeBodyweightLog(log.id)}
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

export default BodyweightView;
