import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES, EQUIPMENT_OPTIONS, getCategoryLabel, getEquipmentLabel } from '../GymCard.constants';

function ExercisesView({ gymData }) {
  const { exercises } = gymData;
  const [categoryFilter, setCategoryFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      if (categoryFilter && exercise.category !== categoryFilter) return false;
      if (equipmentFilter && exercise.equipment !== equipmentFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          exercise.name.toLowerCase().includes(query) ||
          exercise.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [exercises, categoryFilter, equipmentFilter, searchQuery]);

  return (
    <motion.div
      className="gym-exercises-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Filters */}
      <div className="gym-filters">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="gym-filter-select"
          style={{ flex: 1, minWidth: '150px' }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="gym-filter-select"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <select
          value={equipmentFilter}
          onChange={(e) => setEquipmentFilter(e.target.value)}
          className="gym-filter-select"
        >
          <option value="">All Equipment</option>
          {EQUIPMENT_OPTIONS.map((eq) => (
            <option key={eq.value} value={eq.value}>
              {eq.label}
            </option>
          ))}
        </select>
      </div>

      {/* Exercise Grid */}
      {filteredExercises.length === 0 ? (
        <div className="gym-empty-state">
          <h4>No Exercises Found</h4>
          <p>
            {exercises.length === 0
              ? 'Seed the gym data to add exercises.'
              : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div className="gym-exercise-grid">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="gym-exercise-card">
              <h5>{exercise.name}</h5>
              <div className="meta">
                <span className="tag">{getCategoryLabel(exercise.category)}</span>
                {exercise.equipment && (
                  <span className="tag">{getEquipmentLabel(exercise.equipment)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gym-muted)', textAlign: 'center' }}>
        Showing {filteredExercises.length} of {exercises.length} exercises
      </p>
    </motion.div>
  );
}

export default ExercisesView;
