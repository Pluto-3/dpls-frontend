import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import StatusBadge from '../../components/StatusBadge'
import api from '../../api/axios'

export default function OfficerDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/applications/submitted')
      .then(res => setApplications(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Submitted Applications</h1>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm">No submitted applications at the moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map(app => (
              <div
                key={app.id}
                onClick={() => navigate(`/officer/applications/${app.id}`)}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-800">{app.permitTypeName}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {app.applicantName} · {app.applicantEmail}
                  </p>
                  <p className="text-xs text-gray-400">
                    Submitted {new Date(app.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}