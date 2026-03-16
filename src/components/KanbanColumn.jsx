import TaskCard from './TaskCard'

const colConfig = {
  todo:       { label: 'To Do',       dot: 'bg-gray-400',    header: 'bg-gray-50'    },
  inprogress: { label: 'In Progress', dot: 'bg-amber-400',   header: 'bg-amber-50'   },
  done:       { label: 'Done',        dot: 'bg-emerald-500', header: 'bg-emerald-50' },
}

export default function KanbanColumn({ status, tasks, onAdd, onEdit, onDelete, onStatusChange }) {
  const cfg = colConfig[status]

  return (
    <div className="flex-1 min-w-[260px] max-w-sm">
      <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg ${cfg.header}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className="text-sm font-semibold text-gray-700">{cfg.label}</span>
          <span className="text-xs bg-white text-gray-500 px-1.5 py-0.5 rounded-full border border-gray-100">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          className="text-gray-400 hover:text-indigo-500 text-xl leading-none transition-colors"
          title="Add task"
        >
          +
        </button>
      </div>

      <div className="bg-gray-50 rounded-b-lg p-2 min-h-[400px] flex flex-col gap-2 border border-t-0 border-gray-100">
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-gray-300 text-center">No tasks yet<br />Click + to add</p>
          </div>
        )}
        {tasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  )
}
