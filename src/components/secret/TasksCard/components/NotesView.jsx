import ImageGallery from './ImageGallery';

function NotesView({
  activeTab,
  currentNotes,
  onShowAddNote,
  onEditNote,
  onTogglePin,
}) {
  return (
    <>
      <button className="add-note-btn" onClick={onShowAddNote}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Add new {activeTab === 'notes' ? 'note' : 'idea'}</span>
      </button>
      <div className="notes-grid">
        {currentNotes.map((note) => (
          <div
            key={note.id}
            className="note-card"
            style={{ borderLeftColor: note.color }}
            onClick={() => onEditNote(note)}
          >
            <div className="note-header">
              <h4>{note.title}</h4>
              <button
                className={`pin-btn ${note.pinned ? 'pinned' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
              >
                <svg viewBox="0 0 24 24" fill={note.pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            </div>
            <p className="note-content">{note.content}</p>
            <ImageGallery
              entityType={note.category === 'ideas' ? 'idea' : 'note'}
              entityId={note.id}
            />
            <div className="note-footer">
              <span className="note-date">
                {new Date(note.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default NotesView;
