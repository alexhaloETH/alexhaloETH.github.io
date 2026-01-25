const TASK_TABS = [
  { id: 'tasks', label: 'Tasks', icon: '✓', resource: 'tasks' },
  { id: 'missions', label: 'Missions', icon: '🎯', resource: 'missions' },
  { id: 'notes', label: 'Notes', icon: '📝', resource: 'notes' },
  { id: 'ideas', label: 'Ideas', icon: '💡', resource: 'notes' },
];

const RECURRENCE_OPTIONS = [
  { value: 'daily', label: 'Daily', icon: '📅' },
  { value: 'weekly', label: 'Weekly', icon: '📆' },
  { value: 'biweekly', label: 'Every 2 Weeks', icon: '🗓️' },
  { value: 'monthly', label: 'Monthly', icon: '📊' },
];

const MISSION_TYPE_OPTIONS = [
  { value: 'streak', label: 'Streak', icon: '🔥' },
  { value: 'amount', label: 'Amount', icon: '🔢' },
  { value: 'checkbox', label: 'Checkbox', icon: '✅' },
];

export { TASK_TABS, RECURRENCE_OPTIONS, MISSION_TYPE_OPTIONS };
