import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ projects: 0, tasks: 0, done: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: projects } = await API.get('/api/projects')
        const totalTasks = projects.reduce((s, p) => s + (p.taskCount || 0), 0)
        const doneTasks  = projects.reduce((s, p) => s + (p.doneCount  || 0), 0)
        setStats({ projects: projects.length, tasks: totalTasks, done: doneTasks })
      } catch {}
    }
    fetchStats()
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-700 mb-3">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-bold text-gray-900 text-xl">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">Member since {joined}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: 'Projects', value: stats.projects },
              { label: 'Total Tasks', value: stats.tasks },
              { label: 'Completed', value: stats.done },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {stats.tasks > 0 && (
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Overall progress</span>
                <span>{Math.round((stats.done / stats.tasks) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.round((stats.done / stats.tasks) * 100)}%` }}
                />
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-5">
            <table className="w-full text-sm">
              <tbody>
                <tr><td className="text-gray-500 py-2">Name</td><td className="text-right text-gray-900 font-medium">{user?.name}</td></tr>
                <tr><td className="text-gray-500 py-2">Email</td><td className="text-right text-gray-900">{user?.email}</td></tr>
                <tr><td className="text-gray-500 py-2">Role</td><td className="text-right"><span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">Developer</span></td></tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-6 border border-red-100 text-red-500 rounded-xl py-2.5 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
