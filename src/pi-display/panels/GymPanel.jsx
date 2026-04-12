import PanelShell from './PanelShell';
import { formatShortDate } from '../piDisplayUtils';

function GymPanel({ data }) {
  const { gym } = data;

  return (
    <PanelShell eyebrow="Gym" title={gym.todaysWorkout ? 'Today' : 'Fitness'}>
      {!gym.ok && (
        <div className="pi-empty">
          <strong>Gym unavailable</strong>
          <span>{gym.error || 'No workout data loaded'}</span>
        </div>
      )}

      {gym.ok && (
        <>
          <div className="pi-focus-card">
            <span>Workout</span>
            <strong>{gym.todaysWorkout?.name || 'No active plan'}</strong>
            <small>
              {gym.todaysWorkout
                ? `${gym.todaysWorkout.estimatedMinutes || 45} min · ${gym.todaysWorkout.dayType}`
                : `${gym.exerciseCount} exercises ready`}
            </small>
          </div>

          <div className="pi-metric-grid">
            <div className="pi-metric">
              <span>Week</span>
              <strong>{gym.analytics?.workoutsThisWeek ?? 0}</strong>
            </div>
            <div className="pi-metric">
              <span>Stretches</span>
              <strong>{gym.stretchLoggedToday ? 'Done' : gym.stretchCount}</strong>
            </div>
          </div>

          <div className="pi-mini-section">
            <span>Last workout</span>
            <strong>{gym.lastSession ? formatShortDate(gym.lastSession.sessionDate) : 'Not logged'}</strong>
          </div>
        </>
      )}
    </PanelShell>
  );
}

export default GymPanel;
