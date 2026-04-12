import { motion } from 'framer-motion';
import { getDayName, getDayTypeLabel } from '../GymCard.constants';

const formatReps = (min, max) => {
  if (!min && !max) return '';
  if (min === max || !max) return `${min}`;
  return `${min}-${max}`;
};

function GymDashboardView({ gymData, canWrite }) {
  const {
    stats,
    todaysWorkout,
    todaysSession,
    activePlan,
    plans,
    startWorkout,
    resumeWorkout,
    assignPlan,
  } = gymData;

  const handleStartWorkout = async () => {
    if (todaysWorkout) {
      await startWorkout(todaysWorkout.id);
    } else {
      await startWorkout();
    }
  };

  const handleResumeWorkout = async () => {
    if (todaysSession) {
      await resumeWorkout(todaysSession.id);
    }
  };

  return (
    <motion.div
      className="gym-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Stats */}
      <div className="gym-stats-grid">
        <div className="gym-stat-card accent">
          <span>Streak</span>
          <strong>{stats.workoutStreak}</strong>
        </div>
        <div className="gym-stat-card">
          <span>This Week</span>
          <strong>{stats.workoutsThisWeek}</strong>
        </div>
        <div className="gym-stat-card">
          <span>This Month</span>
          <strong>{stats.workoutsThisMonth}</strong>
        </div>
        <div className="gym-stat-card">
          <span>Total</span>
          <strong>{stats.totalWorkouts}</strong>
        </div>
      </div>

      {/* Today's Workout */}
      {activePlan && todaysWorkout ? (
        <div className="gym-today-workout">
          <div className="gym-today-header">
            <div>
              <h4>{todaysWorkout.name}</h4>
              <span>
                {getDayName(todaysWorkout.dayNumber)} - {getDayTypeLabel(todaysWorkout.dayType)}
                {todaysWorkout.estimatedMinutes && ` - ${todaysWorkout.estimatedMinutes} min`}
              </span>
            </div>
          </div>

          {todaysWorkout.dayType === 'rest' ? (
            <div className="gym-rest-day">
              <h4>Rest Day</h4>
              <p>Take it easy, recover, and come back stronger.</p>
            </div>
          ) : (
            <>
              {todaysWorkout.exercises?.length > 0 && (
                <div className="gym-today-exercises">
                  {todaysWorkout.exercises.slice(0, 5).map((item) => (
                    <div key={item.id} className="gym-exercise-preview">
                      <span className="name">{item.exercise.name}</span>
                      <span className="details">
                        {item.sets} x {formatReps(item.repsMin, item.repsMax)}
                      </span>
                    </div>
                  ))}
                  {todaysWorkout.exercises.length > 5 && (
                    <div className="gym-exercise-preview">
                      <span className="name">
                        +{todaysWorkout.exercises.length - 5} more
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : activePlan ? (
        <div className="gym-today-workout">
          <div className="gym-rest-day">
            <h4>No Workout Scheduled</h4>
            <p>Enjoy your rest day or do some light activity.</p>
          </div>
        </div>
      ) : null}

      {/* Quick Actions */}
      <div className="gym-quick-actions">
        {canWrite && todaysSession && !todaysSession.completed && (
          <button
            type="button"
            className="gym-primary-btn"
            onClick={handleResumeWorkout}
          >
            Resume Workout
          </button>
        )}

        {canWrite && !todaysSession && todaysWorkout && todaysWorkout.dayType !== 'rest' && (
          <button
            type="button"
            className="gym-primary-btn"
            onClick={handleStartWorkout}
          >
            Start Today's Workout
          </button>
        )}

        {canWrite && !todaysSession && (!todaysWorkout || todaysWorkout.dayType === 'rest') && (
          <button
            type="button"
            className="gym-secondary-btn"
            onClick={() => startWorkout()}
          >
            Start Custom Workout
          </button>
        )}

        {canWrite && !activePlan && plans.length > 0 && (
          <button
            type="button"
            className="gym-secondary-btn"
            onClick={() => assignPlan(plans[0].id)}
          >
            Assign Plan
          </button>
        )}
      </div>

      {/* No Plan Message */}
      {!activePlan && (
        <div className="gym-empty-state">
          <h4>No Active Plan</h4>
          <p>
            {plans.length > 0
              ? 'Assign a workout plan to get structured training.'
              : 'Seed the gym data to get started with exercises and a workout plan.'}
          </p>
        </div>
      )}

      {/* Recent PRs */}
      {stats.personalRecords.length > 0 && (
        <div>
          <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
            Recent PRs
          </h4>
          <div className="gym-prs-list">
            {stats.personalRecords.slice(0, 3).map((pr) => (
              <div key={pr.exerciseId} className="gym-pr-item">
                <span className="exercise">{pr.exerciseName}</span>
                <span className="record">
                  {pr.weight}kg x {pr.reps} ({Math.round(pr.estimated1rm)}kg est. 1RM)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default GymDashboardView;
