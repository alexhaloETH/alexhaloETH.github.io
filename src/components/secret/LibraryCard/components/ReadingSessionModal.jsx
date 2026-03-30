import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getSuggestedEndPage = (book) => {
  if (!book) {
    return 0;
  }

  const currentPage = Math.max(0, Number(book.currentPage) || 0);
  const goal = Math.max(0, Number(book.dailyGoalPages) || 0);
  const suggested = goal > 0 ? currentPage + goal : currentPage;

  if (typeof book.totalPages === 'number') {
    return Math.min(book.totalPages, suggested);
  }

  return suggested;
};

const createInitialState = (book) => ({
  bookId: book ? String(book.id) : '',
  sessionDate: getTodayDateString(),
  startPage: String(book?.currentPage ?? 0),
  endPage: String(getSuggestedEndPage(book)),
  notes: '',
});

function ReadingSessionModal({
  books,
  defaultBook,
  onClose,
  onSubmit,
}) {
  const fallbackBook = defaultBook || books[0] || null;
  const [formData, setFormData] = useState(() => createInitialState(fallbackBook));

  const selectedBook = useMemo(() => (
    books.find((book) => String(book.id) === formData.bookId) || null
  ), [books, formData.bookId]);

  const pagesRead = useMemo(() => {
    const startPage = Number(formData.startPage);
    const endPage = Number(formData.endPage);

    if (!Number.isFinite(startPage) || !Number.isFinite(endPage) || endPage < startPage) {
      return 0;
    }

    return endPage - startPage;
  }, [formData.endPage, formData.startPage]);

  const handleBookChange = (bookId) => {
    const nextBook = books.find((book) => String(book.id) === bookId) || null;
    setFormData((current) => ({
      ...current,
      bookId,
      startPage: String(nextBook?.currentPage ?? 0),
      endPage: String(getSuggestedEndPage(nextBook)),
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      bookId: Number(formData.bookId),
      sessionDate: formData.sessionDate,
      startPage: Math.max(0, Number(formData.startPage) || 0),
      endPage: Math.max(0, Number(formData.endPage) || 0),
      notes: formData.notes,
    };

    const success = await onSubmit(payload);
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
        className="library-modal compact"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="library-modal-header">
          <h3>Log Reading Session</h3>
          <button type="button" className="library-modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="library-modal-body">
          {books.length === 0 ? (
            <div className="library-empty-state compact">
              <h4>No books to log yet</h4>
              <p>Add a book first, then come back here to track pages and reading notes.</p>
            </div>
          ) : (
            <>
              <div className="library-form-grid two-up">
                <label className="library-form-group">
                  <span>Book</span>
                  <select
                    value={formData.bookId}
                    onChange={(event) => handleBookChange(event.target.value)}
                  >
                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="library-form-group">
                  <span>Date</span>
                  <input
                    type="date"
                    value={formData.sessionDate}
                    onChange={(event) => setFormData((current) => ({
                      ...current,
                      sessionDate: event.target.value,
                    }))}
                  />
                </label>
              </div>

              {selectedBook && (
                <div className="library-session-preview">
                  <div>
                    <strong>{selectedBook.title}</strong>
                    <p>
                      {[selectedBook.author, selectedBook.format].filter(Boolean).join(' • ') || 'Reading tracker entry'}
                    </p>
                  </div>
                  <div className="library-session-preview-meta">
                    <span>
                      {typeof selectedBook.totalPages === 'number'
                        ? `${selectedBook.currentPage}/${selectedBook.totalPages} pages`
                        : `Current page ${selectedBook.currentPage}`}
                    </span>
                    <span>
                      {typeof selectedBook.dailyGoalPages === 'number'
                        ? `${selectedBook.dailyGoalPages}/day goal`
                        : 'No daily goal'}
                    </span>
                  </div>
                </div>
              )}

              <div className="library-form-grid two-up">
                <label className="library-form-group">
                  <span>Start page</span>
                  <input
                    type="number"
                    min="0"
                    max={typeof selectedBook?.totalPages === 'number' ? selectedBook.totalPages : undefined}
                    value={formData.startPage}
                    onChange={(event) => setFormData((current) => ({
                      ...current,
                      startPage: event.target.value,
                    }))}
                  />
                </label>

                <label className="library-form-group">
                  <span>End page</span>
                  <input
                    type="number"
                    min="0"
                    max={typeof selectedBook?.totalPages === 'number' ? selectedBook.totalPages : undefined}
                    value={formData.endPage}
                    onChange={(event) => setFormData((current) => ({
                      ...current,
                      endPage: event.target.value,
                    }))}
                  />
                </label>
              </div>

              <div className="library-inline-note strong">
                {pagesRead > 0
                  ? `${pagesRead} pages will be added to today's total`
                  : 'You can leave the page range unchanged and save a note-only session'}
              </div>

              <label className="library-form-group">
                <span>Session notes</span>
                <textarea
                  value={formData.notes}
                  onChange={(event) => setFormData((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))}
                  placeholder="Key ideas, quotes, questions, or where to pick up next..."
                  rows="5"
                />
              </label>
            </>
          )}
        </div>

        <div className="library-modal-footer">
          <button type="button" className="library-secondary-btn" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="library-primary-btn"
            onClick={handleSubmit}
            disabled={!books.length || !formData.bookId || !formData.sessionDate}
          >
            Save session
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ReadingSessionModal;
