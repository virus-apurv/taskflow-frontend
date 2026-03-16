import { useNavigate } from 'react-router-dom'

const priorityColors = {
  '#6366f1': 'bg-indigo-500',
  '#10b981': 'bg-emerald-500',
  '#f59e0b': 'bg-amber-500',
  '#ef4444': 'bg-red-500',
  '#8b5cf6': 'bg-violet-500',
  '#06b6d4': 'bg-cyan-500',
}

export default function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()
  const pct = project.taskCount > 0 ? Math.round((project.doneCount / project.taskCount) * 100) : 0
  const color = project.color || '#6366f1'
  const bgClass = priorityColors[color] || 'bg-indigo-500'

  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== 'completed'

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => navigate(`/project/${project._id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-3 h-3 rounded-full ${bgClass} mt-1`} />
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(project._id) }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-lg leading-none"
        >
          ×
        </button>
      </div>

      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{project.name}</h3>
      {project.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>{project.taskCount} task{project.taskCount !== 1 ? 's' : ''}</span>
        {project.deadline && (
          <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
            {isOverdue ? 'Overdue' : new Date(project.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : bgClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-gray-400 mt-1">{pct}% complete</div>
    </div>
  )
}
