import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

function WorkoutLogger({ gymData, canWrite, onClose }) {
  const {
    activeSession,
    exercises,
    addExerciseToSession,
    logSet,
    completeWorkout,
  } = gymData;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const ratings = {
    energy: 3,
    workout: 3,
    soreness: 3,
    notes: '',
  };

  // Timer
  useEffect(() => {
    if (!activeSession?.startedAt) return;

    const startTime = new Date(activeSession.startedAt).getTime();
    const updateTimer = () => {
      const now = Date.now();
      setElapsedSeconds(Math.floor((now - startTime) / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSession?.startedAt]);

  const handleAddExercise = async (exerciseId) => {
    await addExerciseToSession(exerciseId);
    setShowExercisePicker(false);
  };

  const handleLogSet = async (sessionExerciseId, setData) => {
    await logSet(sessionExerciseId, setData);
  };

  const handleComplete = async () => {
    const success = await completeWorkout(ratings);
    if (success) {
      onClose();
    }
  };

  // Group exercises not yet in session
  const availableExercises = useMemo(() => {
    const sessionExerciseIds = new Set(
      activeSession?.exercises?.map((e) => e.exerciseId) || [],
    );
    return exercises.filter((e) => !sessionExerciseIds.has(e.id));
  }, [exercises, activeSession?.exercises]);

  if (!activeSession) {
    return (
      <div className="gym-empty-state">
        <p>No active workout session.</p>
        <button type="button" className="gym-secondary-btn" onClick={onClose}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="gym-workout-logger"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="gym-logger-header">
        <div>
          <h4>Active Workout</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--gym-muted)' }}>
            {activeSession.sessionDate}
          </span>
        </div>
        <span className="gym-logger-timer">{formatDuration(elapsedSeconds)}</span>
      </div>

      {/* Exercises */}
      <div className="gym-logger-exercises">
        {activeSession.exercises?.length === 0 ? (
          <div className="gym-empty-state">
            <p>No exercises added yet. Add an exercise to start logging sets.</p>
          </div>
        ) : (
          activeSession.exercises?.map((sessionExercise) => (
            <ExerciseLogger
              key={sessionExercise.id}
              sessionExercise={sessionExercise}
              onLogSet={(setData) => handleLogSet(sessionExercise.id, setData)}
              canWrite={canWrite}
            />
          ))
        )}
      </div>

      {/* Actions */}
      <div className="gym-logger-actions">
        {canWrite && (
          <>
            <button
              type="button"
              className="gym-secondary-btn gym-add-exercise-btn"
              onClick={() => setShowExercisePicker(true)}
            >
              + Add Exercise
            </button>
            <button
              type="button"
              className="gym-primary-btn gym-complete-btn"
              onClick={handleComplete}
              disabled={activeSession.exercises?.length === 0}
            >
              Complete Workout
            </button>
          </>
        )}
      </div>

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div
          className="gym-modal-overlay"
          onClick={() => setShowExercisePicker(false)}
        >
          <div className="gym-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gym-modal-header">
              <h3>Add Exercise</h3>
              <button
                type="button"
                className="gym-modal-close"
                onClick={() => setShowExercisePicker(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="gym-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                {availableExercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    type="button"
                    className="gym-secondary-btn"
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                    onClick={() => handleAddExercise(exercise.id)}
                  >
                    {exercise.name}
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--gym-muted)' }}>
                      {exercise.category}
                    </span>
                  </button>
                ))}
                {availableExercises.length === 0 && (
                  <p style={{ color: 'var(--gym-muted)', textAlign: 'center' }}>
                    All exercises already added.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ExerciseLogger({ sessionExercise, onLogSet, canWrite }) {
  const [newSet, setNewSet] = useState({
    reps: '',
    weight: '',
  });

  const sets = sessionExercise.sets || [];
  const nextSetNumber = sets.length + 1;

  const handleAddSet = async () => {
    if (!newSet.reps) return;

    await onLogSet({
      setNumber: nextSetNumber,
      reps: parseInt(newSet.reps, 10),
      weight: newSet.weight ? parseFloat(newSet.weight) : null,
      isWarmup: false,
    });

    setNewSet({ reps: '', weight: '' });
  };

  return (
    <div className="gym-logger-exercise">
      <div className="gym-logger-exercise-header">
        <h5>{sessionExercise.exercise?.name || 'Exercise'}</h5>
        <span style={{ fontSize: '0.75rem', color: 'var(--gym-muted)' }}>
          {sets.length} sets
        </span>
      </div>

      {sets.length > 0 && (
        <table className="gym-sets-table">
          <thead>
            <tr>
              <th>Set</th>
              <th>Weight</th>
              <th>Reps</th>
            </tr>
          </thead>
          <tbody>
            {sets.map((set) => (
              <tr key={set.id}>
                <td>{set.setNumber}</td>
                <td>{set.weight ? `${set.weight} kg` : '-'}</td>
                <td>{set.reps || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {canWrite && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--gym-muted)', width: '2rem' }}>
            #{nextSetNumber}
          </span>
          <input
            type="number"
            placeholder="Weight"
            value={newSet.weight}
            onChange={(e) => setNewSet((s) => ({ ...s, weight: e.target.value }))}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '0.875rem',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--gym-border)',
              borderRadius: '0.25rem',
              color: 'var(--text-color)',
            }}
          />
          <input
            type="number"
            placeholder="Reps"
            value={newSet.reps}
            onChange={(e) => setNewSet((s) => ({ ...s, reps: e.target.value }))}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '0.875rem',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--gym-border)',
              borderRadius: '0.25rem',
              color: 'var(--text-color)',
            }}
          />
          <button
            type="button"
            className="gym-primary-btn"
            style={{ padding: '0.5rem 1rem' }}
            onClick={handleAddSet}
            disabled={!newSet.reps}
          >
            Log
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkoutLogger;
