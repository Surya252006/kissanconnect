import React from 'react'
import { Link } from 'react-router-dom'
import { PackageOpen, ArrowRight } from 'lucide-react'

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are currently no items to display.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-dashed border-slate-300 max-w-lg mx-auto my-8">
      <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-2xl mb-4 shadow-inner">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">{description}</p>

      {(actionText && actionLink) && (
        <div className="mt-6">
          <Link
            to={actionLink}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {(actionText && onAction) && (
        <div className="mt-6">
          <button
            onClick={onAction}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default EmptyState
