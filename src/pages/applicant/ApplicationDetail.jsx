import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import StatusBadge from '../../components/StatusBadge'
import api from '../../api/axios'

function DocList({ documents, canUpload, onUpload }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      await onUpload(formData)
      setFile(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {documents.length === 0 ? (
        <p className="text-sm text-gray-400">No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-2 mb-4">
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
      )}
      {canUpload && (
        <form onSubmit={handleUpload} className="flex items-center gap-3 mt-2">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:text-sm"
          />
          <button
            type="submit"
            disabled={uploading || !file}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      )}
    </div>
  )
}

export default function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [documents, setDocuments] = useState([])
  const [timeline, setTimeline] = useState([])
  const [permit, setPermit] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchAll = () => {
    api.get(`/applications/${id}`).then(res => setApplication(res.data.data))
    api.get(`/applications/${id}/documents`).then(res => setDocuments(res.data.data))
    api.get(`/applications/${id}/timeline`).then(res => setTimeline(res.data.data))
    api.get(`/permits/application/${id}`).then(res => setPermit(res.data.data)).catch(() => {})
  }

  useEffect(() => { fetchAll() }, [id])

  const handleUpload = async (formData) => {
    try {
      await api.post(`/applications/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await api.post(`/applications/${id}/submit`)
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (!application) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="text-center text-gray-400 mt-20">Loading...</p>
    </div>
  )

  const canUpload = ['DRAFT', 'NEEDS_CORRECTION'].includes(application.status)
  const canSubmit = ['DRAFT', 'NEEDS_CORRECTION'].includes(application.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/applicant')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
          ← Back
        </button>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{application.permitTypeName}</h1>
              <p className="text-sm text-gray-400 mt-1">Application #{application.id}</p>
            </div>
            <StatusBadge status={application.status} />
          </div>
          {application.notes && (
            <div className="mt-4 bg-orange-50 text-orange-700 text-sm px-4 py-3 rounded-lg">
              <span className="font-medium">Officer note: </span>{application.notes}
            </div>
          )}
          {canSubmit && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>

        {permit && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border border-purple-100">
            <h2 className="font-semibold text-purple-700 mb-4">Permit Issued</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Permit Number</span>
                <span className="font-medium text-gray-700">{permit.permitNumber}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-gray-400 shrink-0">Verification Code</span>
                <span className="font-mono text-xs text-gray-700 break-all text-right">{permit.verificationCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Issued</span>
                <span className="font-medium text-gray-700">{new Date(permit.issuedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expires</span>
                <span className="font-medium text-gray-700">{new Date(permit.expiresAt).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
              Share the verification code with anyone who needs to verify this permit at the public verify page.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="font-semibold text-gray-700 mb-4">Documents</h2>
          <DocList documents={documents} canUpload={canUpload} onUpload={handleUpload} />
        </div>

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