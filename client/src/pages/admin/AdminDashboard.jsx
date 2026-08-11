import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import {
  Users,
  Sprout,
  ShoppingBag,
  Package,
  ShieldCheck,
  ClipboardList,
  CheckCircle,
  IndianRupee,
  Clock,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'

const AdminDashboard = () => {
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
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl shadow-sm border border-red-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Admin Dashboard Error</h2>
        <p className="text-slate-600 text-sm">{error || 'Failed to load analytics data.'}</p>
        <button
          onClick={fetchOverview}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: data.totalUsers,
      sub: `${data.totalFarmers} Farmers, ${data.totalConsumers} Buyers`,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Farmers',
      value: data.totalFarmers,
      sub: 'Verified producers',
      icon: Sprout,
      color: 'bg-emerald-600',
    },
    {
      title: 'Total Produce',
      value: data.totalProducts,
      sub: `${data.verifiedProducts} Verified listings`,
      icon: Package,
      color: 'bg-amber-500',
    },
    {
      title: 'Marketplace Value (GMV)',
      value: `₹${(data.totalMarketplaceValue || 0).toLocaleString('en-IN')}`,
      sub: 'Cumulative transactions',
      icon: IndianRupee,
      color: 'bg-purple-600',
    },
    {
      title: 'Total Orders',
      value: data.totalOrders,
      sub: `${data.deliveredOrders} Delivered`,
      icon: ClipboardList,
      color: 'bg-teal-600',
    },
    {
      title: 'Pending Orders',
      value: data.pendingOrders,
      sub: 'Awaiting fulfillment',
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      title: 'Confirmed Orders',
      value: data.confirmedOrders,
      sub: 'In processing pipeline',
      icon: TrendingUp,
      color: 'bg-indigo-600',
    },
    {
      title: 'Cancelled Orders',
      value: data.cancelledOrders,
      sub: 'Restored to inventory',
      icon: AlertCircle,
      color: 'bg-red-500',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Admin Analytics & Operations</h1>
          <p className="text-sm text-slate-500 mt-1">Platform overview, transaction metrics, and operations control</p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/admin/verifications"
            className="inline-flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3.5 py-2 rounded-xl text-xs border border-emerald-200 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Manage Verifications</span>
          </Link>
          <Link
            to="/price-insights"
            className="inline-flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-3.5 py-2 rounded-xl text-xs border border-amber-200 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Price Insights</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((c, i) => {
          const Icon = c.icon
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{c.title}</span>
                <div className={`p-2 rounded-xl text-white ${c.color} shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-800 block">{c.value}</span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{c.sub}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Status Distribution Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-800">Order Fulfillment Distribution</h3>
        {data.totalOrders > 0 ? (
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(data.deliveredOrders / data.totalOrders) * 100}%` }}
                className="bg-emerald-500"
                title={`Delivered: ${data.deliveredOrders}`}
              ></div>
              <div
                style={{ width: `${(data.confirmedOrders / data.totalOrders) * 100}%` }}
                className="bg-indigo-500"
                title={`Confirmed: ${data.confirmedOrders}`}
              ></div>
              <div
                style={{ width: `${(data.pendingOrders / data.totalOrders) * 100}%` }}
                className="bg-amber-400"
                title={`Pending: ${data.pendingOrders}`}
              ></div>
              <div
                style={{ width: `${(data.cancelledOrders / data.totalOrders) * 100}%` }}
                className="bg-red-400"
                title={`Cancelled: ${data.cancelledOrders}`}
              ></div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold pt-1">
              <span className="flex items-center text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span>
                Delivered ({data.deliveredOrders})
              </span>
              <span className="flex items-center text-indigo-700">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-1.5"></span>
                Confirmed ({data.confirmedOrders})
              </span>
              <span className="flex items-center text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1.5"></span>
                Pending ({data.pendingOrders})
              </span>
              <span className="flex items-center text-red-700">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 mr-1.5"></span>
                Cancelled ({data.cancelledOrders})
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">No orders recorded yet.</p>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-6">
        <h3 className="text-base font-bold text-slate-800">Recent Marketplace Transactions</h3>

        {data.recentOrders && data.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
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
                    <tr key={ord._id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        #{ord._id.substring(ord._id.length - 6).toUpperCase()}
                      </td>
                      <td className="py-3 px-4">{b.name || 'Buyer'}</td>
                      <td className="py-3 px-4">{f.name || 'Farmer'}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">₹{ord.totalAmount}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{d}</td>
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
