import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import StatusBadge from '../../components/StatusBadge'
import api from '../../api/axios'

function DocList({ documents }) {
  if (documents.length === 0) {
    return <p className="text-sm text-gray-400">No documents submitted.</p>
  }
  return (
    <ul className="space-y-2">
      {documents.map(doc => {
        const filename = doc.fileUrl.split(/[\\/]/).pop()
        const url = `${import.meta.env.VITE_FILES_BASE_URL}/${filename}`
        return (
          <li key={doc.id} className="text-sm text-gray-600 flex items-center gap-2">
            <span className="text-blue-400">📄</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {doc.fileName}
            </a>
            <span className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default function ReviewApplication() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [documents, setDocuments] = useState([])
  const [timeline, setTimeline] = useState([])
  const [comments, setComments] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchAll = () => {
    api.get(`/applications/officer/${id}`).then(res => setApplication(res.data.data)).catch(console.error)
    api.get(`/applications/officer/${id}/documents`).then(res => setDocuments(res.data.data)).catch(console.error)
    api.get(`/applications/${id}/timeline`).then(res => setTimeline(res.data.data)).catch(console.error)
  }

  useEffect(() => { fetchAll() }, [id])

  const handleAction = async (action) => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await api.post(`/applications/${id}/${action}`, { comments })
      setSuccess(`Application ${action.replace('-', ' ')} successfully.`)
      setComments('')
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  const handleIssuePermit = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await api.post(`/permits/${id}/issue`)
      setSuccess('Permit issued successfully.')
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue permit')
    } finally {
      setLoading(false)
    }
  }

  if (!application) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="text-center text-gray-400 mt-20">Loading...</p>
    </div>
  )

  const canReview = ['SUBMITTED', 'UNDER_REVIEW'].includes(application.status)
  const canIssue = application.status === 'APPROVED'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/officer')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
          ← Back
        </button>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">{success}</div>}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{application.permitTypeName}</h1>
              <p className="text-sm text-gray-400 mt-1">Application #{application.id}</p>
            </div>
            <StatusBadge status={application.status} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Applicant</p>
              <p className="font-medium text-gray-700">{application.applicantName}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="font-medium text-gray-700">{application.applicantEmail}</p>
            </div>
            <div>
              <p className="text-gray-400">Submitted</p>
              <p className="font-medium text-gray-700">{new Date(application.submittedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="font-semibold text-gray-700 mb-3">Submitted Documents</h2>
          <DocList documents={documents} />
        </div>

        {canReview && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
            <h2 className="font-semibold text-gray-700 mb-3">Review Decision</h2>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add comments (required for rejection and correction requests)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
              rows={3}
            />
            <div className="flex gap-3">
              <button onClick={() => handleAction('approve')} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition">
                Approve
              </button>
              <button onClick={() => handleAction('request-correction')} disabled={loading} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition">
                Request Correction
              </button>
              <button onClick={() => handleAction('reject')} disabled={loading} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition">
                Reject
              </button>
            </div>
          </div>
        )}

        {canIssue && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
            <h2 className="font-semibold text-gray-700 mb-2">Issue Permit</h2>
            <p className="text-sm text-gray-400 mb-4">This application has been approved. Issue the digital permit now.</p>
            <button onClick={handleIssuePermit} disabled={loading} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition">
              Issue Permit
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Activity Timeline</h2>
          {timeline.length === 0 ? (
            <p className="text-sm text-gray-400">No activity yet.</p>
          ) : (
            <ol className="relative border-l border-gray-200 space-y-4 ml-2">
              {timeline.map(event => (
                <li key={event.id} className="ml-4">
                  <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -left-1.5 mt-1" />
                  <p className="text-sm font-medium text-gray-700">{event.action.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-400">{event.actorName} · {event.actorRole}</p>
                  {event.notes && <p className="text-xs text-gray-500 mt-0.5">{event.notes}</p>}
                  <p className="text-xs text-gray-300 mt-0.5">{new Date(event.timestamp).toLocaleString()}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}