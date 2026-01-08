import NoteFormModal from './NoteFormModal';

function EditNoteModal({ note, onClose, onSave, onDelete }) {
  const isIdea = note.category === 'ideas';

  return (
    <NoteFormModal
      note={note}
      isIdea={isIdea}
      onClose={onClose}
      onSubmit={onSave}
      onDelete={onDelete}
      submitLabel="Save Changes"
      titleLabel={`Edit ${isIdea ? 'Idea' : 'Note'}`}
      showExistingImages
    />
  );
}

export default EditNoteModal;
