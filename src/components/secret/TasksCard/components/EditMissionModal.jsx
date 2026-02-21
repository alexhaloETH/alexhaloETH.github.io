import MissionFormModal from './MissionFormModal';

function EditMissionModal({ mission, onClose, onSave, onDelete }) {
  return (
    <MissionFormModal
      mission={mission}
      title="🎯 Edit Mission"
      submitLabel="Save Changes"
      onClose={onClose}
      onSubmit={onSave}
      onDelete={onDelete}
      modalClassName="edit-mission-modal"
      namePlaceholder="Enter mission name..."
    />
  );
}

export default EditMissionModal;
