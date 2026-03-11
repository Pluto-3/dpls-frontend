import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <span className="text-lg font-bold text-blue-600">DPLS</span>
      <div className="flex items-center gap-4">
        <Link to="/verify" className="text-sm text-gray-400 hover:text-blue-600 transition">
          Verify Permit
        </Link>
        <span className="text-sm text-gray-500">{user?.name}</span>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
          {user?.role}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}