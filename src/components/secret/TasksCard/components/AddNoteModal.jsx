import NoteFormModal from './NoteFormModal';

function AddNoteModal({ onClose, onAdd, isIdea = false }) {
  return (
    <NoteFormModal
      isIdea={isIdea}
      onClose={onClose}
      onSubmit={onAdd}
      submitLabel={`Add ${isIdea ? 'Idea' : 'Note'}`}
      titleLabel={`Add New ${isIdea ? 'Idea' : 'Note'}`}
    />
  );
}

export default AddNoteModal;
