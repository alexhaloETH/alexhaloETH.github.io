import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned' },
  { value: 'seedling', label: 'Seedling' },
  { value: 'growing', label: 'Growing' },
  { value: 'ready', label: 'Ready to harvest' },
  { value: 'finished', label: 'Finished' },
];

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createInitialState = (plant) => ({
  name: plant?.name || '',
  variety: plant?.variety || '',
  location: plant?.location || '',
  status: plant?.status || 'growing',
  plantedOn: plant?.plantedOn || getTodayDateString(),
  harvestStartOn: plant?.harvestStartOn || '',
  harvestEndOn: plant?.harvestEndOn || '',
  wateringIntervalDays: String(plant?.wateringIntervalDays || 3),
  lastWateredOn: plant?.lastWateredOn || getTodayDateString(),
  isHarvestable: plant?.isHarvestable ?? true,
  notes: plant?.notes || '',
});

function PlantModal({
  plant,
  onClose,
  onSubmit,
  onDelete,
}) {
  const [formData, setFormData] = useState(() => createInitialState(plant));

  const modalTitle = useMemo(() => (plant ? 'Edit Garden Plant' : 'Add Garden Plant'), [plant]);
  const submitLabel = plant ? 'Save Plant' : 'Add Plant';

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...plant,
      name: formData.name.trim(),
      variety: formData.variety,
      location: formData.location,
      status: formData.status,
      plantedOn: formData.plantedOn,
      harvestStartOn: formData.isHarvestable ? formData.harvestStartOn : '',
      harvestEndOn: formData.isHarvestable ? formData.harvestEndOn : '',
      wateringIntervalDays: Number(formData.wateringIntervalDays) || 1,
      lastWateredOn: formData.lastWateredOn,
      isHarvestable: formData.isHarvestable,
      notes: formData.notes,
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!plant || !onDelete) {
      return;
    }

    const success = await onDelete(plant.id);
    if (success) {
      onClose();
    }
  };

  return (
    <motion.div
      className="garden-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="garden-modal"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="garden-modal-header">
          <h3>{modalTitle}</h3>
          <button type="button" className="garden-modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="garden-modal-body">
          <div className="garden-form-grid two-up">
            <label className="garden-form-group">
              <span>Plant</span>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Tomatoes"
                autoFocus
              />
            </label>

            <label className="garden-form-group">
              <span>Variety</span>
              <input
                type="text"
                value={formData.variety}
                onChange={(event) => handleChange('variety', event.target.value)}
                placeholder="San Marzano"
              />
            </label>
          </div>

          <div className="garden-form-grid two-up">
            <label className="garden-form-group">
              <span>Location</span>
              <input
                type="text"
                value={formData.location}
                onChange={(event) => handleChange('location', event.target.value)}
                placeholder="Greenhouse bed 1"
              />
            </label>

            <label className="garden-form-group">
              <span>Status</span>
              <select
                value={formData.status}
                onChange={(event) => handleChange('status', event.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="garden-form-grid three-up">
            <label className="garden-form-group">
              <span>Planted on</span>
              <input
                type="date"
                value={formData.plantedOn}
                onChange={(event) => handleChange('plantedOn', event.target.value)}
              />
            </label>

            <label className="garden-form-group">
              <span>Last watered</span>
              <input
                type="date"
                value={formData.lastWateredOn}
                onChange={(event) => handleChange('lastWateredOn', event.target.value)}
              />
            </label>

            <label className="garden-form-group">
              <span>Water every days</span>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.wateringIntervalDays}
                onChange={(event) => handleChange('wateringIntervalDays', event.target.value)}
              />
            </label>
          </div>

          <label className="garden-toggle">
            <input
              type="checkbox"
              checked={formData.isHarvestable}
              onChange={(event) => handleChange('isHarvestable', event.target.checked)}
            />
            <span>This plant should be tracked for harvest timing</span>
          </label>

          <div className="garden-form-grid two-up">
            <label className="garden-form-group">
              <span>Harvest starts</span>
              <input
                type="date"
                value={formData.harvestStartOn}
                onChange={(event) => handleChange('harvestStartOn', event.target.value)}
                disabled={!formData.isHarvestable}
              />
            </label>

            <label className="garden-form-group">
              <span>Harvest ends</span>
              <input
                type="date"
                value={formData.harvestEndOn}
                onChange={(event) => handleChange('harvestEndOn', event.target.value)}
                disabled={!formData.isHarvestable}
              />
            </label>
          </div>

          <label className="garden-form-group">
            <span>Notes</span>
            <textarea
              value={formData.notes}
              onChange={(event) => handleChange('notes', event.target.value)}
              placeholder="Prune side shoots, move outside after frost, feed weekly..."
              rows="4"
            />
          </label>
        </div>

        <div className="garden-modal-footer">
          {plant && (
            <button type="button" className="garden-delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
          <div className="garden-modal-actions">
            <button type="button" className="garden-secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="garden-primary-btn"
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PlantModal;
