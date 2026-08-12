import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import api from '../../services/api.js'
import FarmerHeroSlider from '../../components/home/FarmerHeroSlider.jsx'
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Scale,
  PackageCheck,
  Clock,
  Sparkles,
  Users,
  Activity,
  Award,
  ChevronRight,
  Zap,
  HeartHandshake,
} from 'lucide-react'

export const Home = () => {
  const { user } = useAuth()
  const { t, currentLanguage } = useLanguage()
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
        // Fallback gracefully
      }
    }
    fetchStats()
  }, [])

  const categories = [
    { name: t('cat_vegetables', 'Vegetables'), filter: 'Vegetables', icon: '🥦', image: '/products/tomato.jpg', tag: 'Fresh Harvest' },
    { name: t('cat_fruits', 'Fruits'), filter: 'Fruits', icon: '🍎', image: '/products/banana.jpg', tag: 'Sun-Ripened' },
    { name: t('cat_grains', 'Grains'), filter: 'Grains', icon: '🌾', image: '/products/wheat.jpg', tag: 'Direct Wholesale' },
    { name: t('cat_spices', 'Spices'), filter: 'Spices', icon: '🌶️', image: '/products/turmeric.jpg', tag: 'GI Certified' },
    { name: t('cat_pulses', 'Pulses'), filter: 'Pulses', icon: '🫘', image: '/products/chickpeas.jpg', tag: 'High-Protein' },
  ]

  const farmerImpactStories = [
    {
      title: currentLanguage === 'ta' ? 'பெண்கள் வழிநடத்தும் இயற்கை விவசாயம்' : currentLanguage === 'te' ? 'మహిళా రైతుల సేంద్రీయ సాగు' : currentLanguage === 'kn' ? 'ಮಹಿಳಾ ನೇತೃತ್ವದ ಸಾವಯವ ಕೃಷಿ' : 'Women-Led Organic Farming',
      location: 'Nashik Valley, Maharashtra',
      farmer: 'Sunita Devi & Self-Help Group',
      image: '/images/slide_women_farmers.png',
      desc: currentLanguage === 'ta' ? 'நேரடி சந்தை விற்பனை மூலம் 45+ பெண் விவசாயிகள் இடைத்தரகர்கள் இன்றி 35% கூடுதல் லாபம் ஈட்டுகின்றனர்.' : 'Direct market sales enabled 45+ women farmers to eliminate local broker markups and earn 35% higher net income on fresh greens.',
      stat: '+35% Net Farmer Margin',
    },
    {
      title: currentLanguage === 'ta' ? 'ஸ்மார்ட் தானிய & கோதுமை உற்பத்தி' : currentLanguage === 'te' ? 'స్మార్ట్ ధాన్యం & గోధుమ ఉత్పత్తి' : currentLanguage === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ಧಾನ್ಯ ಮತ್ತು ಗೋಧಿ ಉತ್ಪಾದನೆ' : 'Smart Grain & Wheat Production',
      location: 'Ludhiana, Punjab',
      farmer: 'Gurpreet Singh',
      image: '/images/slide_smart_farmer.png',
      desc: currentLanguage === 'ta' ? 'மண்டி விலை ஒப்பீடு மூலம் உயர்தர கோதுமையை பேக்கரிகள் மற்றும் சில்லறை வணிகர்களுக்கு நேரடியாக விற்க முடிகிறது.' : 'Using KisanConnect real-time Mandi price matching to sell high-grade wheat harvests directly to commercial bakeries and retailers.',
      stat: '100% Direct Settlement',
    },
    {
      title: currentLanguage === 'ta' ? 'சான்றளிக்கப்பட்ட தோட்ட விளைபொருட்கள்' : currentLanguage === 'te' ? 'సర్టిఫైడ్ తోట ఉత్పత్తులు' : currentLanguage === 'kn' ? 'ಪ್ರಮಾಣೀಕೃತ ತೋಟಗಾರಿಕಾ ಬೆಳೆಗಳು' : 'Certified Orchard Direct Sourcing',
      location: 'Wayanad, Kerala',
      farmer: 'Ananya Roy & Orchard Producers',
      image: '/images/slide_orchard_harvest.png',
      desc: currentLanguage === 'ta' ? 'ஆர்கானிக் மஞ்சள், மிளகு மற்றும் பழங்களை புவிசார் குறியீடுடன் நேரடியாக நுகர்வோருக்கு அனுப்புகிறோம்.' : 'Direct harvest delivery of organic turmeric, pepper, and fresh fruits directly to urban consumers with verified GI origin seals.',
      stat: 'Verified GI Harvest',
    },
  ]

  const workflowSteps = [
    {
      step: '01',
      title: currentLanguage === 'ta' ? 'விவசாயி பயிரை பட்டியலிடுதல்' : currentLanguage === 'te' ? 'రైతు పంట వివరాలు నమోదు' : 'Farmer Lists Harvest',
      desc: currentLanguage === 'ta' ? 'பயிரின் அளவு, விலை மற்றும் பண்ணை இருப்பிடத்தை நேரடியாக பதிவு செய்கிறார்.' : 'Farmers publish crop quantity, unit rates, and harvest location directly from their field.',
      icon: Sprout,
    },
    {
      step: '02',
      title: currentLanguage === 'ta' ? 'தர பரிசோதனை & GI தணிக்கை' : currentLanguage === 'te' ? 'నాణ್ಯత & GI ధృవీకరణ' : 'Quality & GI Inspection',
      desc: currentLanguage === 'ta' ? 'மண்டி தரநிலைகள் மற்றும் ஆர்கானிக் அளவுகோல்கள் தணிக்கை செய்யப்பட்டு சான்றிதழ் அளிக்கப்படுகிறது.' : 'Listing audited against Mandi grading and organic standards for certified quality badges.',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: currentLanguage === 'ta' ? 'வெளிப்படையான விலை ஒப்பீடு' : currentLanguage === 'te' ? 'పారదర్శక ధరల పోలిక' : 'Price Transparency',
      desc: currentLanguage === 'ta' ? 'வாங்குபவர்கள் மண்டி விலையுடன் ஒப்பிட்டு தங்கள் நேரடி சேமிப்பை உறுதி செய்யலாம்.' : 'Buyers compare direct farm prices with local Mandi APMC rate benchmarks to verify savings.',
      icon: Scale,
    },
    {
      step: '04',
      title: currentLanguage === 'ta' ? 'நேரடி உடனடி ஆர்டர்' : currentLanguage === 'te' ? 'ప్రత్యక్ష తక్షణ ఆర్డర్' : 'Atomic Direct Order',
      desc: currentLanguage === 'ta' ? 'ஒரே கிளிக்கில் நேரடி ஆர்டர் பதிவு மற்றும் பாதுகாப்பான இருப்பு குறைப்பு.' : 'Single-click order placement with race-condition-safe inventory deduction.',
      icon: ShoppingBag,
    },
    {
      step: '05',
      title: currentLanguage === 'ta' ? 'முழு விநியோக கண்காணிப்பு' : currentLanguage === 'te' ? 'పూర్తి లాజిస్టిక్స్ ట్రాకింగ్' : 'End-to-End Tracking',
      desc: currentLanguage === 'ta' ? 'பண்ணை பேக்கிங் முதல் உங்கள் வீட்டு வாசல் வரை நேரலை கண்காணிப்பு.' : 'Real-time multi-stage logistics from farm packaging to transit and delivery.',
      icon: Truck,
    },
    {
      step: '06',
      title: currentLanguage === 'ta' ? 'வீட்டு வாசலில் புதிய பயிர்கள்' : currentLanguage === 'te' ? 'ఇంటి వద్దకే తాజా పంట' : 'Fresh Doorstep Arrival',
      desc: currentLanguage === 'ta' ? '0% இடைத்தரகர் கட்டணத்தில் புதிய விளைபொருட்கள் நேரடியாக வந்தடைகின்றன.' : 'Crops arrive fresh at the buyer’s doorstep with 0% middleman commission fee cuts.',
      icon: PackageCheck,
    },
  ]

  return (
    <div className="space-y-16 pb-16">
      {/* 🌟 1. INTERACTIVE FARMER VISUAL HERO SLIDER */}
      <FarmerHeroSlider />

      {/* 📊 2. LIVE PLATFORM METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalFarmers}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{t('stat_farmers')}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-amber-50 text-amber-700 rounded-2xl">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalProducts}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{t('stat_harvests')}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-blue-50 text-blue-700 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalOrders}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{t('stat_orders')}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-purple-50 text-purple-700 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.verifiedProducts}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{t('stat_verified')}</p>
          </div>
        </div>
      </section>

      {/* 🌾 3. HARVEST CATEGORIES WITH REAL PRODUCE VISUALS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {t('cat_heading_badge')}
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">{t('cat_heading_title')}</h2>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{t('cat_view_all')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/marketplace`}
              className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 flex flex-col h-52 sm:h-60 bg-slate-900"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              <div className="absolute top-3 left-3">
                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                  {cat.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xl mb-1 block">{cat.icon}</span>
                <h3 className="text-lg font-black">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🖼️ 4. VISUAL FARMER IMPACT STORIES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Grassroots Impact
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Farmer Voices & Direct Trade Stories</h2>
          </div>
          <Link
            to="/register"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
          >
            <span>Join our farmer network</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farmerImpactStories.map((story, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/products/tomato.jpg'
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                      {story.stat}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 block">
                      📍 {story.location}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1 leading-snug">
                      {story.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {story.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-3 pt-3 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{story.farmer}</span>
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Producer</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⚖️ 5. MANDI BENCHMARK & HARVEST FLATLAY BANNER */}
      <section className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-emerald-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center space-x-2 bg-emerald-800 border border-emerald-600 px-3 py-1 rounded-full text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>{t('price_badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('price_title')}
          </h2>

          <p className="text-emerald-100 text-sm leading-relaxed font-medium">
            {t('price_subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/price-insights"
              className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl transition-all shadow-md text-xs"
            >
              <span>{t('hero_cta_mandi')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden border-2 border-emerald-600/40 shadow-2xl">
            <img
              src="/images/fresh_harvest.png"
              alt="Fresh Indian Mandi Produce Flatlay"
              className="w-full h-64 sm:h-80 object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/products/tomato.jpg'
              }}
            />
          </div>
        </div>
      </section>

      {/* 🔄 6. 6-STEP VISUAL WORKFLOW */}
      <section id="how-it-works" className="space-y-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t('tag_direct_trade')}
          </span>
          <h2 className="text-3xl font-black text-slate-900">How KisanConnect Operates</h2>
          <p className="text-sm text-slate-500 font-medium">
            From the farmer's soil to the buyer's doorstep in 6 transparent, verified stages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {workflowSteps.map((s, idx) => {
            const Icon = s.icon
            return (
              <div
                key={idx}
                className="bg-stone-50 hover:bg-emerald-50/40 rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3.5 bg-white group-hover:bg-emerald-600 group-hover:text-white rounded-2xl shadow-sm text-emerald-700 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-300 group-hover:text-emerald-300 transition-colors">
                    {s.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-950 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 🌟 7. FINAL CTA BANNER */}
      <section className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-[2.5rem] p-8 sm:p-12 text-center space-y-5 shadow-xl border border-emerald-700/60">
        <h3 className="text-3xl sm:text-4xl font-black">{t('hero_title_1')} {t('hero_title_2')}</h3>
        <p className="text-sm text-emerald-100 max-w-xl mx-auto font-medium leading-relaxed">
          {t('hero_subtitle')}
        </p>
        <div className="pt-2 flex justify-center gap-4 flex-wrap">
          <Link
            to="/marketplace"
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-4 rounded-2xl transition-all shadow-lg text-sm transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{t('hero_cta_explore')}</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
