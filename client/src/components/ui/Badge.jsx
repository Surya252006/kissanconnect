import React from 'react'
import { ShieldCheck, Clock, XCircle, TrendingUp, TrendingDown, Minus, CheckCircle2 } from 'lucide-react'

export const StatusBadge = ({ status }) => {
  const getStyle = (st) => {
    switch (st?.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'SHIPPED':
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'CONFIRMED':
      case 'PROCESSING':
      case 'PICKED_UP':
      case 'PACKED':
        return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'PENDING':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'VERIFIED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300'
    }
  }

  const formatText = (txt) => {
    if (!txt) return ''
    return txt.replace(/_/g, ' ')
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle(
        status
      )}`}
    >
      {formatText(status)}
    </span>
  )
}

export const VerifiedBadge = ({ isVerified, type = 'product', size = 'sm' }) => {
  if (!isVerified) return null

  const sizeClasses =
    size === 'lg'
      ? 'px-3 py-1 text-sm gap-1.5'
      : 'px-2 py-0.5 text-xs gap-1'

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold bg-emerald-600 text-white shadow-sm ${sizeClasses}`}
      title={type === 'farmer' ? 'Verified Agricultural Producer' : 'Admin Quality Verified Produce'}
    >
      <ShieldCheck className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{type === 'farmer' ? 'Verified Farmer' : 'Verified Quality'}</span>
    </span>
  )
}

export const TrendBadge = ({ trend, diffPercentage }) => {
  if (!trend) return null

  switch (trend.toUpperCase()) {
    case 'DOWN':
      return (
        <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-bold">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          <span>{diffPercentage ? `${diffPercentage}% cheaper` : 'Price Lower'}</span>
        </span>
      )
    case 'UP':
      return (
        <span className="inline-flex items-center space-x-1 bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
          <span>Price Rising</span>
        </span>
      )
    case 'STABLE':
    default:
      return (
        <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full text-xs font-medium">
          <Minus className="w-3.5 h-3.5 text-slate-500" />
          <span>Stable</span>
        </span>
      )
  }
}
