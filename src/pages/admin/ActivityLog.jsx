import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

const ROLES = ['All Roles', 'APPLICANT', 'OFFICER', 'ADMIN']

export default function ActivityLog() {
  const navigate = useNavigate()
  const [logs, setLogs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/applications/audit-logs')
      .then(res => {
        setLogs(res.data.data)
        setFiltered(res.data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = logs
    if (roleFilter !== 'All Roles') {
      result = result.filter(l => l.actorRole === roleFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(l =>
        l.actorName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        (l.notes && l.notes.toLowerCase().includes(q)) ||
        String(l.applicationId).includes(q)
      )
    }
    setFiltered(result)
  }, [search, roleFilter, logs])

  const roleColor = (role) => {
    if (role === 'ADMIN') return 'bg-purple-100 text-purple-700'
    if (role === 'OFFICER') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/admin')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
          ← Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Activity Log</h1>
            <p className="text-sm text-gray-400 mt-1">{filtered.length} entries</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name, action, notes, or application ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 mt-20 text-sm">No logs found.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">App #</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actor</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Notes</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <tr key={log.id} className={`border-b border-gray-50 hover:bg-gray-50 transition ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                    <td className="px-5 py-3 font-mono text-xs text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate(`/admin/applications/${log.applicationId}`)}>
                      #{log.applicationId}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-700">{log.actorName}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor(log.actorRole)}`}>
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{log.action.replace(/_/g, ' ')}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs max-w-xs truncate">{log.notes || '—'}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}