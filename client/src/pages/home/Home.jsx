import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api.js'
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Truck,
  CheckCircle,
  ArrowRight,
  UserCheck,
  Scale,
  DollarSign,
  PackageCheck,
  Clock,
  Sparkles,
  Users,
  Activity,
} from 'lucide-react'

export const Home = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalFarmers: 12,
    totalProducts: 18,
    totalOrders: 24,
    verifiedProducts: 14,
  })

  // Fetch live stats from backend analytics if available
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/overview')
        if (res.data?.success && res.data?.data) {
          const d = res.data.data
          setStats({
            totalFarmers: d.totalFarmers || 12,
            totalProducts: d.totalProducts || 18,
            totalOrders: d.totalOrders || 24,
            verifiedProducts: d.verifiedProducts || 14,
          })
        }
      } catch (err) {
        // Fallback gracefully without breaking UI
      }
    }
    fetchStats()
  }, [])

  const workflowSteps = [
    {
      step: '01',
      title: 'Farmer Lists Produce',
      desc: 'Farmers list harvest quantity, price per unit, and harvest location directly.',
      icon: Sprout,
    },
    {
      step: '02',
      title: 'Quality Verification',
      desc: 'Produce & farmer profiles are audited to guarantee authenticity and quality.',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Price Transparency',
      desc: 'Buyers compare direct farm prices with local Mandi/APMC market benchmarks.',
      icon: Scale,
    },
    {
      step: '04',
      title: 'Direct Order Placement',
      desc: 'Buyers choose quantity and address. Atomic inventory updates prevent overselling.',
      icon: ShoppingBag,
    },
    {
      step: '05',
      title: 'Logistics Tracking',
      desc: 'End-to-end multi-step tracking from packing and dispatch to out-for-delivery.',
      icon: Truck,
    },
    {
      step: '06',
      title: 'Fresh Delivery',
      desc: 'Produce arrives fresh at the buyer’s doorstep with zero middleman markups.',
      icon: PackageCheck,
    },
  ]

  const trustBadges = [
    {
      title: 'Verified Producers',
      sub: 'Identity & farm authenticity checks',
      icon: UserCheck,
    },
    {
      title: 'Produce Quality Badges',
      sub: 'GI-tagged and organic quality grades',
      icon: CheckCircle,
    },
    {
      title: 'Mandi APMC Benchmarks',
      sub: 'Fair price comparison vs local markets',
      icon: TrendingUp,
    },
    {
      title: 'Atomic Real-time Stock',
      sub: 'Race-condition-free inventory tracking',
      icon: Clock,
    },
  ]

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-emerald-800/80">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-500/50 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200 uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Direct Agricultural Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            From Farm to Buyer, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-200">
              Without the Middleman.
            </span>
          </h1>

          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
            Connect directly with farmers, discover transparent prices, verify products and track agricultural orders in one trusted marketplace.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/marketplace"
              className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl transition-all shadow-lg text-sm sm:text-base transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/price-insights"
              className="inline-flex items-center space-x-2 bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-500/60 text-white font-bold px-6 py-3.5 rounded-2xl transition-all text-sm sm:text-base"
            >
              <TrendingUp className="w-5 h-5 text-amber-300" />
              <span>Mandi Price Insights</span>
            </Link>

            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold px-6 py-3.5 rounded-2xl transition-all text-sm sm:text-base"
              >
                <Sprout className="w-5 h-5 text-emerald-300" />
                <span>Join as Farmer</span>
              </Link>
            )}
          </div>
        </div>

        {/* Ambient Glow Graphic */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
      </section>

      {/* Trust & Live Platform Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 transition-colors">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{stats.totalFarmers}+</div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Farmers Connected</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 transition-colors">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{stats.totalProducts}+</div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Products Listed</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 transition-colors">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{stats.totalOrders}+</div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Orders Completed</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 transition-colors">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{stats.verifiedProducts}+</div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Verified Listings</p>
          </div>
        </div>
      </section>

      {/* Trust Layer Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trustBadges.map((badge, i) => {
          const Icon = badge.icon
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-start space-x-4 hover:border-emerald-300 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl flex-shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{badge.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{badge.sub}</p>
              </div>
            </div>
          )
        })}
      </section>

      {/* How It Works (10-Second Visual Flow) */}
      <section id="how-it-works" className="space-y-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Frictionless Flow
          </span>
          <h2 className="text-3xl font-black text-slate-900">How KisanConnect Works</h2>
          <p className="text-sm text-slate-500">
            From the farmer's soil to the buyer's doorstep in 6 transparent, verified stages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {workflowSteps.map((s, idx) => {
            const Icon = s.icon
            return (
              <div
                key={idx}
                className="bg-stone-50 hover:bg-emerald-50/40 rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white group-hover:bg-emerald-600 group-hover:text-white rounded-xl shadow-sm text-emerald-700 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 group-hover:text-emerald-300 transition-colors">
                    {s.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-900 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Dual Value Proposition: Farmer vs Buyer */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Farmer Benefits Card */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col justify-between space-y-6 border border-emerald-800">
          <div className="space-y-4">
            <div className="inline-flex p-3 bg-white/10 rounded-2xl text-amber-300">
              <Sprout className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold">For Farmers & Producers</h3>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Take back control of your farm margins. Set fair prices, gain certified quality badges, and receive verified customer orders with automated fulfillment.
            </p>
            <ul className="space-y-2.5 text-xs text-emerald-100 font-medium pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>Zero commission middlemen fee cuts</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>Direct customer order queue with multi-step status controls</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>Request quality and GI verification for premium listing visibility</span>
              </li>
            </ul>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl transition-all text-sm shadow-md"
          >
            <span>Start Selling Produce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Buyer Benefits Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex p-3 bg-emerald-50 rounded-2xl text-emerald-700">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800">For Buyers, Retailers & Wholesalers</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Source farm-fresh produce directly from local growers. Compare live Mandi rates against platform prices and track multi-step delivery.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 font-medium pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% verified farmer profiles and produce authenticity</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Clear price savings benchmarked against local Mandis</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Live order logistics tracking from packing to delivery</span>
              </li>
            </ul>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3.5 rounded-2xl transition-all text-sm shadow-md"
          >
            <span>Browse Farm Produce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-black">Ready to Experience Direct Agricultural Trade?</h3>
        <p className="text-sm text-emerald-100 max-w-xl mx-auto font-medium">
          Join thousands of farmers and buyers transforming Indian agriculture through transparency and trust.
        </p>
        <div className="pt-2 flex justify-center gap-4 flex-wrap">
          <Link
            to="/marketplace"
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl transition-all shadow-md text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Enter Marketplace</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
