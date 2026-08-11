import { useState, useEffect } from 'react'
import api from '../../services/api.js'
import { StatusBadge, VerifiedBadge } from '../../components/ui/Badge.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { TableSkeleton } from '../../components/ui/LoadingSkeleton.jsx'
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Package,
  AlertCircle,
  MapPin,
  Sparkles,
} from 'lucide-react'

export const Verification = () => {
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trust & Quality Authority</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center space-x-2">
            <span>Produce & Farmer Verification Queue</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Review quality benchmarks, GI tags, and farm credentials submitted by producers.
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-900 px-4 py-2 rounded-2xl border border-emerald-200 text-xs font-black">
          {verifications.filter((v) => v.status === 'PENDING').length} Pending Audits
        </div>
      </div>

      {/* Loading / Error / Verification Table */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="font-bold">{error}</p>
        </div>
      ) : verifications.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No Verification Requests In Queue"
          description="There are currently no pending or historical quality/identity audit requests to review."
        />
      ) : (
        <div className="space-y-6">
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
                className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 overflow-hidden transition-all duration-200"
              >
                {/* Header */}
                <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-600 gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      #{v._id.substring(v._id.length - 8).toUpperCase()}
                    </span>
                    <span className="font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {v.type} Audit
                    </span>
                    <span className="flex items-center font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 mr-1" />
                      {formattedDate}
                    </span>
                  </div>

                  <div>
                    <StatusBadge status={v.status} />
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Entity Details */}
                  <div className="md:col-span-2 space-y-2">
                    {v.type === 'PRODUCT' ? (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Package className="w-5 h-5 text-emerald-600" />
                          <h3 className="font-black text-slate-900 text-lg">{prodObj.name || 'Produce Item'}</h3>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          Category: <strong className="text-slate-900">{prodObj.category}</strong> • Price: <strong className="text-slate-900">₹{prodObj.price}</strong>
                        </p>
                        {prodObj.location && (
                          <p className="text-xs text-slate-500 flex items-center font-medium">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            <span>{prodObj.location}</span>
                          </p>
                        )}
                        <p className="text-xs text-slate-600 pt-1 font-medium">
                          Producer: <strong className="text-slate-900">{userObj.name}</strong> ({userObj.phone || userObj.email})
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-emerald-600" />
                          <h3 className="font-black text-slate-900 text-lg">{userObj.name}</h3>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          Role: <strong className="text-slate-900">{userObj.role}</strong> • Email: <strong className="text-slate-900">{userObj.email}</strong>
                        </p>
                        {userObj.location && (
                          <p className="text-xs text-slate-500 flex items-center font-medium">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            <span>{userObj.location}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {v.remarks && (
                      <p className="text-xs text-slate-700 bg-stone-50 p-3 rounded-xl border border-slate-200 mt-2 font-medium">
                        <strong>Farmer Notes:</strong> {v.remarks}
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
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-sm hover:shadow disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve & Certify</span>
                        </button>
                        <button
                          onClick={() => setRejectingId(v._id)}
                          disabled={processingId === v._id}
                          className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors border border-rose-200"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject Audit</span>
                        </button>
                      </>
                    ) : (
                      <div className="text-xs text-slate-500 text-center font-bold bg-slate-50 py-3 rounded-2xl border border-slate-200">
                        Audit Finalized: {v.status}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reject Modal / Inline Form */}
                {rejectingId === v._id && (
                  <div className="p-5 bg-rose-50/70 border-t border-rose-200 space-y-3">
                    <p className="text-xs font-bold text-rose-900">
                      Reason for Rejection (Feedback for Producer):
                    </p>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Incomplete crop documentation or non-compliant harvest grade"
                      className="w-full px-3.5 py-2 bg-white border border-rose-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 font-medium"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setRejectingId(null)
                          setRemarks('')
                        }}
                        className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReject(v._id)}
                        disabled={processingId === v._id}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
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
