import { useState } from 'react'
import api from '../../api/axios'

export default function VerifyPermit() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await api.get(`/permits/verify/${code}`)
      setResult(res.data.data)
    } catch (err) {
      setError('No permit found for this verification code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">DPLS</h1>
          <p className="text-gray-400 text-sm mt-1">Digital Permit &amp; License System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Verify a Permit</h2>
          <p className="text-sm text-gray-400 mb-6">
            Enter the verification code found on the permit to confirm its authenticity.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Verifying...' : 'Verify Permit'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 border border-green-200 rounded-xl p-5 bg-green-50">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-green-600 text-lg">✓</span>
                <span className="text-green-700 font-semibold text-sm">Permit is Valid</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Permit Number</span>
                  <span className="font-medium text-gray-700">{result.permitNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Holder</span>
                  <span className="font-medium text-gray-700">{result.applicantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Permit Type</span>
                  <span className="font-medium text-gray-700">{result.permitTypeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Department</span>
                  <span className="font-medium text-gray-700">{result.departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Issued</span>
                  <span className="font-medium text-gray-700">
                    {new Date(result.issuedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expires</span>
                  <span className="font-medium text-gray-700">
                    {new Date(result.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          This is a public verification service. No account required.
        </p>
      </div>
    </div>
  )
}