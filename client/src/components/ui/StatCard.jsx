import React from 'react'

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'emerald', trend }) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      iconBg: 'bg-emerald-100 text-emerald-700',
      accent: 'text-emerald-900',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-800 border-amber-100',
      iconBg: 'bg-amber-100 text-amber-700',
      accent: 'text-amber-900',
    },
    blue: {
      bg: 'bg-blue-50 text-blue-800 border-blue-100',
      iconBg: 'bg-blue-100 text-blue-700',
      accent: 'text-blue-900',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-800 border-purple-100',
      iconBg: 'bg-purple-100 text-purple-700',
      accent: 'text-purple-900',
    },
  }

  const selected = colorMap[color] || colorMap.emerald

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${selected.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className={`text-3xl font-black tracking-tight ${selected.accent}`}>{value}</div>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
          <span>{trend.label}</span>
          <span className="font-semibold text-emerald-700">{trend.value}</span>
        </div>
      )}
    </div>
  )
}

export default StatCard
