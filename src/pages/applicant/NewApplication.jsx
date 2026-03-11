import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

export default function NewApplication() {
  const [permitTypes, setPermitTypes] = useState([])
  const [selectedType, setSelectedType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/permit-types')
      .then(res => setPermitTypes(res.data.data))
      .catch(console.error)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/applications', { permitTypeId: Number(selectedType) })
      navigate(`/applicant/applications/${res.data.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/applicant')}
          className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block"
        >
          ← Back
        </button>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-800 mb-1">New Application</h1>
          <p className="text-sm text-gray-400 mb-6">Select a permit type to get started</p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permit Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a permit type</option>
                {permitTypes.map(pt => (
                  <option key={pt.id} value={pt.id}>
                    {pt.name} — {pt.departmentName} ({pt.validityPeriodDays} days)
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading || !selectedType}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Creating...' : 'Create Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}