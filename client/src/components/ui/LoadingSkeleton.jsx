import React from 'react'

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm animate-pulse flex flex-col space-y-3">
      <div className="w-full h-48 bg-slate-200 rounded-xl"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      </div>
      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
      </div>
    </div>
  )
}

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
      <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
          <div className="h-4 bg-slate-200 rounded w-1/5"></div>
          <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          <div className="h-4 bg-slate-200 rounded w-1/8"></div>
        </div>
      ))}
    </div>
  )
}

export const PageLoader = ({ message = 'Loading KisanConnect...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-sm font-semibold text-slate-600 animate-pulse">{message}</p>
    </div>
  )
}
