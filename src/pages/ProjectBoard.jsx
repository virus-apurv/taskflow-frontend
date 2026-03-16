import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import KanbanColumn from '../components/KanbanColumn'
import API from '../api/axios'

const STATUSES = ['todo', 'inprogress', 'done']

export default function ProjectBoard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [defaultStatus, setDefaultStatus] = useState('todo')
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proj, taskRes] = await Promise.all([
          API.get(`/api/projects/${id}`),
          API.get(`/api/tasks/project/${id}`)
        ])
        setProject(proj.data)
        setTasks(taskRes.data)
      } catch {
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const openAdd = (status) => {
    setEditTask(null)
    setDefaultStatus(status)
    setForm({ title: '', description: '', priority: 'medium', dueDate: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (task) => {
    setEditTask(task)
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0,10) : ''
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Title is required')
    setSaving(true)
    try {
      if (editTask) {
        const { data } = await API.put(`/api/tasks/${editTask._id}`, form)
        setTasks(prev => prev.map(t => t._id === editTask._id ? data : t))
      } else {
        const { data } = await API.post('/api/tasks', { ...form, projectId: id, status: defaultStatus })
        setTasks(prev => [data, ...prev])
      }
      setShowModal(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return
    try {
      await API.delete(`/api/tasks/${taskId}`)
      setTasks(prev => prev.filter(t => t._id !== taskId))
    } catch { alert('Failed to delete task') }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await API.patch(`/api/tasks/${taskId}/status`, { status: newStatus })
      setTasks(prev => prev.map(t => t._id === taskId ? data : t))
    } catch { alert('Failed to update status') }
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.priority === filter)
  const byStatus = (s) => filtered.filter(t => t.status === s)

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-6" />
        <div className="flex gap-4">
          {[1,2,3].map(i => <div key={i} className="flex-1 h-96 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 text-sm">← Back</button>
            <div className="w-3 h-3 rounded-full" style={{ background: project?.color || '#6366f1' }} />
            <h1 className="font-bold text-gray-900 text-lg">{project?.name}</h1>
            <span className="text-sm text-gray-500">{tasks.length} tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              onClick={() => openAdd('todo')}
              className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              + Add Task
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={byStatus(status)}
              onAdd={() => openAdd(status)}
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>

      {/* Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">{editTask ? 'Edit Task' : 'New Task'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Task title *</label>
                <input
                  type="text" required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="e.g. Design homepage"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                  rows={2} placeholder="Optional details"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Due date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-700 rounded-lg py-2.5 text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60">
                  {saving ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
