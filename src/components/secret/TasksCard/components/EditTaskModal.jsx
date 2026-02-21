import TaskFormModal from './TaskFormModal';

function EditTaskModal({ task, onClose, onSave, onDelete }) {
  return (
    <TaskFormModal
      title="Edit Task"
      submitLabel="Save Changes"
      textPlaceholder="Enter task description..."
      onClose={onClose}
      onSubmit={onSave}
      onDelete={onDelete}
      initialTask={task}
      modalClassName="edit-task-modal"
      disableSubmitWhenEmpty={false}
    />
  );
}

export default EditTaskModal;
