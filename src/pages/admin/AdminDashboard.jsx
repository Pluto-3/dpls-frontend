import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-600',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-700',
    NEEDS_CORRECTION: 'bg-orange-100 text-orange-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    PERMIT_ISSUED: 'bg-purple-100 text-purple-700',
    EXPIRED: 'bg-gray-100 text-gray-400',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : stats ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-sm text-gray-400">Total Applications</p>
                <p className="text-4xl font-bold text-gray-800 mt-1">{stats.totalApplications}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-sm text-gray-400">Avg Processing Time</p>
                <p className="text-4xl font-bold text-gray-800 mt-1">
                  {stats.averageProcessingTimeInDays.toFixed(1)}
                  <span className="text-lg font-normal text-gray-400 ml-1">days</span>
                </p>
              </div>
            </div>

            {/* Applications by Status */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-gray-700 mb-4">Applications by Status</h2>
              <div className="space-y-3">
                {Object.entries(stats.applicationByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
                      {status.replace(/_/g, ' ')}
                    </span>
                    <span className="font-semibold text-gray-700">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-sm">No statistics available.</p>
        )}

        {/* Management Links */}
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => navigate('/admin/departments')}
            className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-700">Departments</h2>
            <p className="text-sm text-gray-400 mt-1">Manage government departments</p>
          </div>
          <div
            onClick={() => navigate('/admin/permit-types')}
            className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-700">Permit Types</h2>
            <p className="text-sm text-gray-400 mt-1">Manage available permit types</p>
          </div>
        </div>
      </div>
    </div>
  )
}