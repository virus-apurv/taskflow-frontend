import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
            <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
            <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
            <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.4"/>
          </svg>
        </div>
        <span className="font-semibold text-gray-900 text-sm">TaskFlow</span>
      </Link>

      <div className="flex items-center gap-3">
        <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
          <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-semibold text-indigo-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">{user?.name}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
