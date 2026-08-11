import React from 'react'
import { TrendingDown, Scale, ShieldCheck } from 'lucide-react'

export const PriceTransparencyCard = ({
  marketPrice,
  platformPrice,
  unit = 'kg',
  location,
  size = 'md',
}) => {
  if (!marketPrice || !platformPrice) return null

  const savings = Math.max(0, marketPrice - platformPrice)
  const savingsPct = Math.round((savings / marketPrice) * 100)

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-5 border border-emerald-700/50 shadow-md relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Price Transparency Benchmark
          </span>
        </div>
        {location && (
          <span className="text-[11px] bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-200 border border-emerald-600/40">
            📍 {location}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 my-2">
        <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/30">
          <p className="text-[11px] text-slate-300 uppercase font-medium">Mandi APMC Rate</p>
          <p className="text-lg font-bold text-slate-200 line-through decoration-rose-400">
            ₹{marketPrice} <span className="text-xs font-normal">/{unit}</span>
          </p>
        </div>

        <div className="bg-emerald-800/80 p-3 rounded-xl border border-emerald-500/50">
          <p className="text-[11px] text-amber-300 uppercase font-bold">KisanConnect Direct</p>
          <p className="text-xl font-black text-amber-300">
            ₹{platformPrice} <span className="text-xs font-normal text-emerald-100">/{unit}</span>
          </p>
        </div>
      </div>

      {savings > 0 && (
        <div className="mt-3 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-xs">
          <span className="text-emerald-200">Direct Buyer Savings:</span>
          <span className="inline-flex items-center space-x-1 bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-xs shadow-sm">
            <TrendingDown className="w-3.5 h-3.5 text-slate-950" />
            <span>Save ₹{savings}/{unit} ({savingsPct}% lower)</span>
          </span>
        </div>
      )}
    </div>
  )
}

export default PriceTransparencyCard
