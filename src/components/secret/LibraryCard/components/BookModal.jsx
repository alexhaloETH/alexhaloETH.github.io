import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const STATUS_OPTIONS = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'reading', label: 'Reading' },
  { value: 'paused', label: 'Paused' },
  { value: 'finished', label: 'Finished' },
  { value: 'dnf', label: 'Did not finish' },
];

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createInitialState = (book) => ({
  title: book?.title || '',
  author: book?.author || '',
  format: book?.format || '',
  totalPages: book?.totalPages ? String(book.totalPages) : '',
  currentPage: String(book?.currentPage ?? 0),
  dailyGoalPages: book?.dailyGoalPages ? String(book.dailyGoalPages) : '',
  status: book?.status || 'backlog',
  startedOn: book?.startedOn || '',
  finishedOn: book?.finishedOn || '',
  notes: book?.notes || '',
});

const toOptionalInteger = (value) => {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(0, Math.floor(parsed));
};

function BookModal({
  book,
  onClose,
  onSubmit,
  onDelete,
}) {
  const [formData, setFormData] = useState(() => createInitialState(book));

  const modalTitle = useMemo(() => (book ? 'Edit Book' : 'Add Book'), [book]);
  const submitLabel = book ? 'Save Book' : 'Add Book';

  const handleChange = (field, value) => {
    setFormData((current) => {
      if (field === 'status') {
        const nextState = {
          ...current,
          status: value,
        };

        if (value === 'finished' && !current.finishedOn) {
          nextState.finishedOn = getTodayDateString();
        }

        if (value === 'reading' && Number(current.currentPage) > 0 && !current.startedOn) {
          nextState.startedOn = getTodayDateString();
        }

        return nextState;
      }

      return {
        ...current,
        [field]: value,
      };
    });
  };

  const handleSubmit = async () => {
    const payload = {
      ...book,
      title: formData.title.trim(),
      author: formData.author,
      format: formData.format,
      totalPages: toOptionalInteger(formData.totalPages),
      currentPage: Math.max(0, Number(formData.currentPage) || 0),
      dailyGoalPages: toOptionalInteger(formData.dailyGoalPages),
      status: formData.status,
      startedOn: formData.startedOn,
      finishedOn: formData.status === 'finished' ? formData.finishedOn : '',
      notes: formData.notes,
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!book || !onDelete) {
      return;
    }

    const success = await onDelete(book.id);
    if (success) {
      onClose();
    }
  };

  return (
    <motion.div
      className="library-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="library-modal"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="library-modal-header">
          <h3>{modalTitle}</h3>
          <button type="button" className="library-modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="library-modal-body">
          <div className="library-form-grid two-up">
            <label className="library-form-group">
              <span>Title</span>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => handleChange('title', event.target.value)}
                placeholder="The Left Hand of Darkness"
                autoFocus
              />
            </label>

            <label className="library-form-group">
              <span>Author</span>
              <input
                type="text"
                value={formData.author}
                onChange={(event) => handleChange('author', event.target.value)}
                placeholder="Ursula K. Le Guin"
              />
            </label>
          </div>

          <div className="library-form-grid three-up">
            <label className="library-form-group">
              <span>Format</span>
              <input
                type="text"
                value={formData.format}
                onChange={(event) => handleChange('format', event.target.value)}
                placeholder="Paperback"
              />
            </label>

            <label className="library-form-group">
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

            <label className="library-form-group">
              <span>Total pages</span>
              <input
                type="number"
                min="1"
                value={formData.totalPages}
                onChange={(event) => handleChange('totalPages', event.target.value)}
                placeholder="320"
              />
            </label>
          </div>

          <div className="library-form-grid three-up">
            <label className="library-form-group">
              <span>Current page</span>
              <input
                type="number"
                min="0"
                value={formData.currentPage}
                onChange={(event) => handleChange('currentPage', event.target.value)}
              />
            </label>

            <label className="library-form-group">
              <span>Daily goal</span>
              <input
                type="number"
                min="1"
                value={formData.dailyGoalPages}
                onChange={(event) => handleChange('dailyGoalPages', event.target.value)}
                placeholder="25"
              />
            </label>

            <label className="library-form-group">
              <span>Started on</span>
              <input
                type="date"
                value={formData.startedOn}
                onChange={(event) => handleChange('startedOn', event.target.value)}
              />
            </label>
          </div>

          <div className="library-form-grid two-up">
            <label className="library-form-group">
              <span>Finished on</span>
              <input
                type="date"
                value={formData.finishedOn}
                onChange={(event) => handleChange('finishedOn', event.target.value)}
                disabled={formData.status !== 'finished'}
              />
            </label>

            <label className="library-form-group">
              <span>Reading pace</span>
              <div className="library-inline-note">
                {formData.dailyGoalPages.trim()
                  ? `${formData.dailyGoalPages} pages per day target`
                  : 'Optional daily target for progress tracking'}
              </div>
            </label>
          </div>

          <label className="library-form-group">
            <span>Notes</span>
            <textarea
              value={formData.notes}
              onChange={(event) => handleChange('notes', event.target.value)}
              placeholder="Favourite quotes, key themes, context, where you left off..."
              rows="5"
            />
          </label>
        </div>

        <div className="library-modal-footer">
          {book && (
            <button type="button" className="library-delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
          <div className="library-modal-actions">
            <button type="button" className="library-secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="library-primary-btn"
              onClick={handleSubmit}
              disabled={!formData.title.trim()}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BookModal;
