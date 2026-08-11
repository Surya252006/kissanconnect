import React from 'react'
import { Link } from 'react-router-dom'
import { Sprout, ShieldCheck, TrendingUp, ShoppingBag, Database, Heart } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2.5 group">
              <div className="bg-emerald-600 p-2 rounded-xl text-white group-hover:bg-emerald-500 transition-colors">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">KisanConnect</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's direct agricultural marketplace connecting local farmers directly with buyers, retailers, and wholesalers. Eliminating middleman markups with transparent APMC Mandi price benchmarks and quality verification.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-xs text-emerald-400">
              <span className="inline-flex items-center space-x-1 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Producers</span>
              </span>
              <span className="inline-flex items-center space-x-1 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                <span>Fair Mandi Pricing</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/marketplace" className="hover:text-emerald-400 transition-colors">
                  Explore Produce
                </Link>
              </li>
              <li>
                <Link to="/price-insights" className="hover:text-emerald-400 transition-colors">
                  Mandi Price Benchmarks
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-emerald-400 transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">For Farmers</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Join as Farmer
                </Link>
              </li>
              <li>
                <Link to="/farmer/products/add" className="hover:text-emerald-400 transition-colors">
                  List Harvest Produce
                </Link>
              </li>
              <li>
                <Link to="/farmer/orders" className="hover:text-emerald-400 transition-colors">
                  Manage Customer Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Built With</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>MongoDB Atlas & Aggregations</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>React 18 & Vite SPA</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Node.js & Express API</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>Tailwind CSS System</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KisanConnect. Empowering Indian Agriculture.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Direct Farm-to-Fork Technology</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
