import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchDepartments = () => {
    api.get('/departments').then(res => setDepartments(res.data.data))
  }

  useEffect(() => { fetchDepartments() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/departments', form)
      setForm({ name: '', description: '' })
      fetchDepartments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create department')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/admin')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Departments</h1>

        {/* Create Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Add Department</h2>
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Department name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Creating...' : 'Create Department'}
            </button>
          </form>
        </div>

        {/* Department List */}
        <div className="space-y-3">
          {departments.length === 0 ? (
            <p className="text-sm text-gray-400">No departments yet.</p>
          ) : (
            departments.map(dept => (
              <div key={dept.id} className="bg-white rounded-xl p-5 shadow-sm">
                <p className="font-medium text-gray-800">{dept.name}</p>
                {dept.description && <p className="text-sm text-gray-400 mt-1">{dept.description}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}