import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { StatusBadge } from '../../components/ui/Badge.jsx'
import { TableSkeleton } from '../../components/ui/LoadingSkeleton.jsx'
import {
  Users,
  Sprout,
  ShoppingBag,
  Package,
  ShieldCheck,
  ClipboardList,
  IndianRupee,
  Clock,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Activity,
} from 'lucide-react'

export const AdminDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOverview = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/analytics/overview')
      if (res.data && res.data.success) {
        setData(res.data.data)
      }
    } catch (err) {
      console.error('Error fetching admin analytics:', err)
      setError(err.response?.data?.message || 'Failed to load admin analytics overview.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="h-10 bg-slate-200 rounded-2xl w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-3xl animate-pulse"></div>
          ))}
        </div>
        <TableSkeleton rows={5} />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-sm border border-red-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Admin Operations Error</h2>
        <p className="text-slate-600 text-sm">{error || 'Failed to load analytics data from server.'}</p>
        <button
          onClick={fetchOverview}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Operations & Intelligence Control</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Admin Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Live MongoDB transaction aggregations, GMV, and quality audit controls
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/verifications"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verification Queue</span>
          </Link>
          <Link
            to="/price-insights"
            className="inline-flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold px-4 py-2.5 rounded-2xl text-xs transition-colors border border-slate-200"
          >
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Mandi Rates</span>
          </Link>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Marketplace GMV"
          value={`₹${(data.totalMarketplaceValue || 0).toLocaleString('en-IN')}`}
          subtitle="Cumulative transaction volume"
          icon={IndianRupee}
          color="purple"
        />
        <StatCard
          title="Registered Farmers"
          value={data.totalFarmers || 0}
          subtitle={`Across ${data.totalUsers || 0} Total Platform Users`}
          icon={Sprout}
          color="emerald"
        />
        <StatCard
          title="Harvest Listings"
          value={data.totalProducts || 0}
          subtitle={`${data.verifiedProducts || 0} Verified produce`}
          icon={Package}
          color="amber"
        />
        <StatCard
          title="Total Orders"
          value={data.totalOrders || 0}
          subtitle={`${data.deliveredOrders || 0} Successfully fulfilled`}
          icon={ClipboardList}
          color="blue"
        />
      </div>

      {/* Second Row: Detailed Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Orders"
          value={data.pendingOrders || 0}
          subtitle="Awaiting farmer confirmation"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="In Transit / Pipeline"
          value={data.confirmedOrders || 0}
          subtitle="Active shipping orders"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Delivered Orders"
          value={data.deliveredOrders || 0}
          subtitle="Completed door-to-door"
          icon={ShoppingBag}
          color="emerald"
        />
        <StatCard
          title="Cancelled Orders"
          value={data.cancelledOrders || 0}
          subtitle="Stock restored atomically"
          icon={AlertCircle}
          color="purple"
        />
      </div>

      {/* Order Fulfillment Distribution Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-slate-800">Order Fulfillment Distribution</h3>
          <span className="text-xs font-bold text-slate-500">{data.totalOrders} total orders</span>
        </div>

        {data.totalOrders > 0 ? (
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${(data.deliveredOrders / data.totalOrders) * 100}%` }}
                className="bg-emerald-500"
                title={`Delivered: ${data.deliveredOrders}`}
              ></div>
              <div
                style={{ width: `${(data.confirmedOrders / data.totalOrders) * 100}%` }}
                className="bg-blue-500"
                title={`Confirmed: ${data.confirmedOrders}`}
              ></div>
              <div
                style={{ width: `${(data.pendingOrders / data.totalOrders) * 100}%` }}
                className="bg-amber-400"
                title={`Pending: ${data.pendingOrders}`}
              ></div>
              <div
                style={{ width: `${(data.cancelledOrders / data.totalOrders) * 100}%` }}
                className="bg-rose-400"
                title={`Cancelled: ${data.cancelledOrders}`}
              ></div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-bold pt-1">
              <span className="flex items-center text-emerald-800">
                <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5"></span>
                Delivered ({data.deliveredOrders})
              </span>
              <span className="flex items-center text-blue-800">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></span>
                In Transit / Confirmed ({data.confirmedOrders})
              </span>
              <span className="flex items-center text-amber-800">
                <span className="w-3 h-3 rounded-full bg-amber-400 mr-1.5"></span>
                Pending ({data.pendingOrders})
              </span>
              <span className="flex items-center text-rose-800">
                <span className="w-3 h-3 rounded-full bg-rose-400 mr-1.5"></span>
                Cancelled ({data.cancelledOrders})
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">No orders recorded yet.</p>
        )}
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-6 sm:p-8">
        <h3 className="text-base font-black text-slate-800">Recent Marketplace Transactions</h3>

        {data.recentOrders && data.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-stone-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Buyer</th>
                  <th className="py-3.5 px-4">Farmer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.recentOrders.map((ord) => {
                  const b = ord.buyerId || {}
                  const f = ord.farmerId || {}
                  const d = new Date(ord.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })

                  return (
                    <tr key={ord._id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        #{ord._id.substring(ord._id.length - 6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{b.name || 'Buyer'}</td>
                      <td className="py-3.5 px-4">{f.name || 'Farmer'}</td>
                      <td className="py-3.5 px-4 font-black text-emerald-800">₹{ord.totalAmount}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={ord.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{d}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">No recent transactions recorded.</p>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
