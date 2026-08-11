import { useState, useEffect } from 'react'
import api from '../../services/api.js'
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Package,
  AlertCircle,
  MapPin,
  Tag,
} from 'lucide-react'

const Verification = () => {
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState(null)

  // Reject dialog state
  const [rejectingId, setRejectingId] = useState(null)
  const [remarks, setRemarks] = useState('')

  const fetchVerifications = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/verifications')
      if (res.data && res.data.success) {
        setVerifications(res.data.data.verifications || [])
      }
    } catch (err) {
      console.error('Error fetching verifications:', err)
      setError(err.response?.data?.message || 'Failed to load verification requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVerifications()
  }, [])

  const handleApprove = async (id) => {
    try {
      setProcessingId(id)
      const res = await api.put(`/verifications/${id}/approve`)
      if (res.data && res.data.success) {
        setVerifications((prev) =>
          prev.map((v) => (v._id === id ? res.data.data.verification : v))
        )
      }
    } catch (err) {
      console.error('Error approving verification:', err)
      alert(err.response?.data?.message || 'Failed to approve verification.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id) => {
    try {
      setProcessingId(id)
      const res = await api.put(`/verifications/${id}/reject`, { remarks })
      if (res.data && res.data.success) {
        setVerifications((prev) =>
          prev.map((v) => (v._id === id ? res.data.data.verification : v))
        )
        setRejectingId(null)
        setRemarks('')
      }
    } catch (err) {
      console.error('Error rejecting verification:', err)
      alert(err.response?.data?.message || 'Failed to reject verification.')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Pending Review</span>
      case 'VERIFIED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1"><CheckCircle className="w-3 h-3" /><span>Verified</span></span>
      case 'REJECTED':
        return <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1"><XCircle className="w-3 h-3" /><span>Rejected</span></span>
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{status}</span>
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>Produce & Farmer Verification</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review quality and identity verification requests for farmers and produce listings
          </p>
        </div>
      </div>

      {/* Loading / Error / Verification Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="h-16 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : verifications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <ShieldCheck className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-700">No Verification Requests</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            There are currently no pending or historical verification requests to review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {verifications.map((v) => {
            const userObj = v.userId || {}
            const prodObj = v.productId || {}
            const formattedDate = new Date(v.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })

            return (
              <div
                key={v._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-600 gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-800">
                      Request #{v._id.substring(v._id.length - 8).toUpperCase()}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {v.type}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 text-slate-400 mr-1" />
                      {formattedDate}
                    </span>
                  </div>

                  <div>{getStatusBadge(v.status)}</div>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Entity Details */}
                  <div className="md:col-span-2 space-y-2">
                    {v.type === 'PRODUCT' ? (
                      <div>
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-emerald-600" />
                          <h3 className="font-bold text-slate-800 text-base">{prodObj.name || 'Product Produce'}</h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Category: <strong>{prodObj.category}</strong> • Price: <strong>₹{prodObj.price}</strong>
                        </p>
                        {prodObj.location && (
                          <p className="text-xs text-slate-500 flex items-center mt-0.5">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            <span>{prodObj.location}</span>
                          </p>
                        )}
                        <p className="text-xs text-slate-600 mt-1">
                          Listed by Farmer: <strong>{userObj.name}</strong> ({userObj.phone || userObj.email})
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-emerald-600" />
                          <h3 className="font-bold text-slate-800 text-base">{userObj.name}</h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Role: <strong>{userObj.role}</strong> • Email: <strong>{userObj.email}</strong>
                        </p>
                        {userObj.location && (
                          <p className="text-xs text-slate-500 flex items-center mt-0.5">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            <span>{userObj.location}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {v.remarks && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2">
                        <strong>Remarks:</strong> {v.remarks}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 justify-center md:border-l border-slate-100 md:pl-6">
                    {v.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleApprove(v._id)}
                          disabled={processingId === v._id}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve & Verify</span>
                        </button>
                        <button
                          onClick={() => setRejectingId(v._id)}
                          disabled={processingId === v._id}
                          className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors border border-red-200"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject Request</span>
                        </button>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400 text-center font-medium">
                        Processed as {v.status}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reject Modal / Inline Form */}
                {rejectingId === v._id && (
                  <div className="p-4 bg-red-50/70 border-t border-red-200 space-y-3">
                    <p className="text-xs font-bold text-red-800">
                      Confirm Rejection: Add optional rejection feedback for the user
                    </p>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Produce documentation incomplete or quality standard not met"
                      className="w-full px-3 py-1.5 bg-white border border-red-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-red-500 text-slate-800"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setRejectingId(null)
                          setRemarks('')
                        }}
                        className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReject(v._id)}
                        disabled={processingId === v._id}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Verification
