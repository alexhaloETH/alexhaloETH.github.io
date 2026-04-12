import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getDayName, getDayTypeLabel, getCategoryLabel } from '../GymCard.constants';

const formatReps = (min, max) => {
  if (!min && !max) return '';
  if (min === max || !max) return `${min}`;
  return `${min}-${max}`;
};

const getCurrentDayOfWeek = () => {
  const day = new Date().getDay();
  return day === 0 ? 7 : day;
};

function WorkoutPlanView({ gymData, canWrite }) {
  const { activePlan, plans, assignPlan, startWorkout } = gymData;
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  const today = getCurrentDayOfWeek();

  // Set default selected day to today
  const currentSelectedIndex = useMemo(() => {
    if (selectedDayIndex !== null) return selectedDayIndex;
    if (!activePlan?.days) return 0;
    const todayIndex = activePlan.days.findIndex((d) => d.dayNumber === today);
    return todayIndex >= 0 ? todayIndex : 0;
  }, [selectedDayIndex, activePlan, today]);

  const selectedDay = activePlan?.days?.[currentSelectedIndex];

  if (!activePlan) {
    return (
      <motion.div
        className="gym-plan-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="gym-empty-state">
          <h4>No Active Plan</h4>
          <p>
            {plans.length > 0
              ? 'Select a workout plan to view your weekly schedule.'
              : 'Seed the gym data to create a workout plan.'}
          </p>
          {canWrite && plans.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  className="gym-secondary-btn"
                  onClick={() => assignPlan(plan.id)}
                >
                  {plan.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="gym-plan-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Plan Info */}
      <div style={{ marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
          {activePlan.name}
        </h4>
        {activePlan.description && (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--gym-muted)' }}>
            {activePlan.description}
          </p>
        )}
      </div>

      {/* Week Selector */}
      <div className="gym-week-selector">
        {activePlan.days?.map((day, index) => (
          <button
            key={day.id}
            type="button"
            className={[
              'gym-day-btn',
              currentSelectedIndex === index ? 'active' : '',
              day.dayNumber === today ? 'today' : '',
              day.dayType === 'rest' ? 'rest' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => setSelectedDayIndex(index)}
          >
            <strong>{getDayName(day.dayNumber).slice(0, 3)}</strong>
            <span>{day.dayType === 'rest' ? 'Rest' : day.exercises?.length || 0}</span>
          </button>
        ))}
      </div>

      {/* Day Detail */}
      {selectedDay && (
        <div className="gym-day-detail">
          <h4>{selectedDay.name}</h4>
          <p>
            {getDayTypeLabel(selectedDay.dayType)}
            {selectedDay.estimatedMinutes && ` - ${selectedDay.estimatedMinutes} min`}
          </p>

          {selectedDay.dayType === 'rest' ? (
            <div className="gym-rest-day">
              <p>Rest day. Focus on recovery, mobility, or light activity.</p>
            </div>
          ) : selectedDay.exercises?.length > 0 ? (
            <>
              <div className="gym-day-exercises-list">
                {selectedDay.exercises.map((item) => (
                  <div key={item.id} className="gym-plan-exercise">
                    <div className="info">
                      <span className="name">{item.exercise.name}</span>
                      <span className="meta">
                        {getCategoryLabel(item.exercise.category)}
                        {item.restSeconds && ` - ${item.restSeconds}s rest`}
                      </span>
                    </div>
                    <span className="sets-reps">
                      {item.sets} x {formatReps(item.repsMin, item.repsMax) || 'AMRAP'}
                    </span>
                  </div>
                ))}
              </div>

              {canWrite && selectedDay.dayNumber === today && (
                <button
                  type="button"
                  className="gym-primary-btn"
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => startWorkout(selectedDay.id)}
                >
                  Start This Workout
                </button>
              )}
            </>
          ) : (
            <div className="gym-empty-state">
              <p>No exercises added to this day yet.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default WorkoutPlanView;
