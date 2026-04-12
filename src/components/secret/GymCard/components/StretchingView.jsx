import { motion } from 'framer-motion';
import { getRecommendedUseLabel } from '../GymCard.constants';

const ROUTINE_ORDER = ['pre_workout', 'post_upper', 'post_lower', 'rest_day', 'custom'];

function StretchingView({ gymData, canWrite }) {
  const { stretchesByUse, logStretchSession } = gymData;

  const handleQuickLog = async (routineType) => {
    const stretches = stretchesByUse[routineType] || [];
    if (stretches.length === 0) return;

    const items = stretches.map((stretch) => ({
      stretchId: stretch.id,
      durationSeconds: stretch.holdSeconds,
      sets: 1,
      completed: true,
    }));

    const totalSeconds = items.reduce((sum, item) => sum + (item.durationSeconds || 30), 0);
    const durationMinutes = Math.ceil(totalSeconds / 60);

    await logStretchSession({
      routineType,
      durationMinutes,
      items,
    });
  };

  const hasStretches = Object.values(stretchesByUse).some((list) => list.length > 0);

  if (!hasStretches) {
    return (
      <motion.div
        className="gym-stretching-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="gym-empty-state">
          <h4>No Stretches Found</h4>
          <p>Seed the gym data to add stretching routines.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="gym-stretching-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {ROUTINE_ORDER.map((routineType) => {
        const stretches = stretchesByUse[routineType] || [];
        if (stretches.length === 0) return null;

        return (
          <div key={routineType} className="gym-stretch-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0 }}>{getRecommendedUseLabel(routineType)}</h4>
              {canWrite && (
                <button
                  type="button"
                  className="gym-secondary-btn"
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                  onClick={() => handleQuickLog(routineType)}
                >
                  Log Routine
                </button>
              )}
            </div>
            <div className="gym-stretch-list">
              {stretches.map((stretch) => (
                <div key={stretch.id} className="gym-stretch-item">
                  <span className="name">{stretch.name}</span>
                  <span className="duration">
                    {stretch.holdSeconds ? `${stretch.holdSeconds}s` : `${stretch.reps} reps`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

export default StretchingView;
