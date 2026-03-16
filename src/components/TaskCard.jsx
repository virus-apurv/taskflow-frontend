const priorityConfig = {
  high:   { label: 'High',   cls: 'bg-red-50 text-red-600 border-red-100' },
  medium: { label: 'Medium', cls: 'bg-amber-50 text-amber-600 border-amber-100' },
  low:    { label: 'Low',    cls: 'bg-gray-50 text-gray-500 border-gray-100' },
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const p = priorityConfig[task.priority] || priorityConfig.medium
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'

  const statusOptions = ['todo', 'inprogress', 'done']
  const nextStatus = statusOptions[(statusOptions.indexOf(task.status) + 1) % 3]
  const statusLabel = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' }

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-gray-800 leading-snug flex-1">{task.title}</p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-indigo-500 text-xs px-1">✎</button>
          <button onClick={() => onDelete(task._id)} className="text-gray-400 hover:text-red-500 text-lg leading-none">×</button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${p.cls}`}>
          {p.label}
        </span>
        {task.dueDate && (
          <span className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
            {isOverdue ? '⚠ ' : ''}{new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      <button
        onClick={() => onStatusChange(task._id, nextStatus)}
        className="mt-2 w-full text-xs text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 py-1 rounded transition-colors text-left px-1"
      >
        → Move to {statusLabel[nextStatus]}
      </button>
    </div>
  )
}
