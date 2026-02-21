import MissionFormModal from './MissionFormModal';

function AddMissionModal({ onClose, onAdd }) {
  return (
    <MissionFormModal
      title="🎯 Add New Mission"
      submitLabel="Add Mission"
      onClose={onClose}
      onSubmit={onAdd}
      forceCheckboxRecurrenceDaily
      modalClassName="add-mission-modal"
    />
  );
}

export default AddMissionModal;
