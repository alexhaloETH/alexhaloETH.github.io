import { motion } from 'framer-motion';

const formatVolume = (volume) => {
  if (typeof volume !== 'number' || !Number.isFinite(volume)) {
    return '0';
  }

  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k`;
  }
  return Math.round(volume).toString();
};

const formatDecimal = (value) => (
  typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(1)
    : null
);

function AnalyticsView({ gymData }) {
  const { stats } = gymData;

  return (
    <motion.div
      className="gym-analytics-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Stats Overview */}
      <div className="gym-stats-grid">
        <div className="gym-stat-card accent">
          <span>Workout Streak</span>
          <strong>{stats.workoutStreak}</strong>
        </div>
        <div className="gym-stat-card">
          <span>This Week</span>
          <strong>{stats.workoutsThisWeek}</strong>
        </div>
        <div className="gym-stat-card">
          <span>Volume (Week)</span>
          <strong>{formatVolume(stats.totalVolumeThisWeek)}</strong>
        </div>
        <div className="gym-stat-card">
          <span>Total Workouts</span>
          <strong>{stats.totalWorkouts}</strong>
        </div>
      </div>

      {/* Bodyweight Summary */}
      {formatDecimal(stats.recentBodyweight) !== null && (
        <div className="gym-chart-container">
          <h4>Bodyweight</h4>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700 }}>
              {formatDecimal(stats.recentBodyweight)} kg
            </span>
            {formatDecimal(stats.bodyweightChange30d) !== null && (
              <span
                style={{
                  fontSize: '0.875rem',
                  color: stats.bodyweightChange30d > 0 ? '#ef4444' : stats.bodyweightChange30d < 0 ? 'var(--gym-accent)' : 'var(--gym-muted)',
                }}
              >
                {stats.bodyweightChange30d > 0 ? '+' : ''}
                {formatDecimal(stats.bodyweightChange30d)} kg (30d)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Personal Records */}
      {stats.personalRecords.length > 0 && (
        <div className="gym-chart-container">
          <h4>Personal Records</h4>
          <div className="gym-prs-list">
            {stats.personalRecords.map((pr) => (
              <div key={pr.exerciseId} className="gym-pr-item">
                <div>
                  <span className="exercise">{pr.exerciseName}</span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: 'var(--gym-muted)',
                    }}
                  >
                    {pr.achievedAt}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="record">
                    {pr.weight}kg x {pr.reps}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: 'var(--gym-muted)',
                    }}
                  >
                    Est. 1RM: {Math.round(pr.estimated1rm)}kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart Placeholder */}
      <div className="gym-chart-container">
        <h4>Progress Charts</h4>
        <div className="gym-chart-placeholder">
          <p>
            Charts will display here with more workout data.
            <br />
            Add recharts to package.json for visualizations.
          </p>
        </div>
      </div>

      {stats.totalWorkouts === 0 && stats.personalRecords.length === 0 && (
        <div className="gym-empty-state">
          <h4>No Analytics Yet</h4>
          <p>Complete some workouts to see your progress and stats here.</p>
        </div>
      )}
    </motion.div>
  );
}

export default AnalyticsView;
