import TaskFormModal from './TaskFormModal';

function AddTaskModal({ onClose, onAdd }) {
  return (
    <TaskFormModal
      title="Add New Task"
      submitLabel="Add Task"
      textPlaceholder="What needs to be done?"
      onClose={onClose}
      onSubmit={onAdd}
      modalClassName="add-task-modal"
    />
  );
}

export default AddTaskModal;
