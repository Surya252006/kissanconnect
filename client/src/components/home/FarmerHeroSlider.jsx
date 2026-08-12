import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext.jsx'
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sprout,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Users,
  Award,
} from 'lucide-react'

export const FarmerHeroSlider = () => {
  const { t, currentLanguage } = useLanguage()
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const SLIDES = [
    {
      id: 1,
      image: '/images/hero_banner.png',
      tag: t('tag_direct_trade', 'Direct Farm Harvest'),
      title: `${t('hero_title_1', 'From Farm to Buyer,')} ${t('hero_title_2', 'Without the Middleman.')}`,
      subtitle: t('hero_subtitle', 'Connect directly with verified local farmers, discover transparent APMC Mandi prices, and get fresh crops delivered.'),
      farmerName: 'Ramesh Patel • 15+ Acres Organic Farmer',
      farmerLocation: 'Coimbatore Agri Cluster, Tamil Nadu',
      badgeText: t('hero_floating_quality', 'GI & Organic Certified'),
      stat: t('hero_floating_savings', '15–30% Below Mandi Markup'),
      ctaText: t('hero_cta_explore', 'Explore Marketplace'),
      ctaLink: '/marketplace',
    },
    {
      id: 2,
      image: '/images/slide_women_farmers.png',
      tag: currentLanguage === 'ta' ? 'பெண்கள் வழிநடத்தும் விவசாயம்' : currentLanguage === 'te' ? 'మహిళా రైతుల స్వావలంబన' : currentLanguage === 'kn' ? 'ಮಹಿಳಾ ನೇತೃತ್ವದ ಕೃಷಿ' : currentLanguage === 'hi' ? 'महिला किसान सशक्तिकरण' : 'Women-Led Agriculture',
      title: currentLanguage === 'ta' ? 'கிராமப்புற பெண் விவசாயிகளின் நேரடி முன்னேற்றம்' : currentLanguage === 'te' ? 'గ్రామీణ మహిళా రైతులకు ప్రత్యక్ష మార్కెట్' : currentLanguage === 'kn' ? 'ಗ್ರಾಮೀಣ ಮಹಿಳಾ ರೈತರ ಸಶಕ್ತೀಕರಣ' : currentLanguage === 'hi' ? 'ग्रामीण महिला किसानों को सीधा बाजार' : 'Empowering Women Farmers Across Rural India',
      subtitle: currentLanguage === 'ta' ? 'நேரடி சந்தை இணைப்பு மூலம் பெண் விவசாயிகள் 100% முழு லாபத்தையும் பெறுகின்றனர்.' : currentLanguage === 'te' ? 'ప్రత్యక్ష మార్కెట్ అనుసంధానం ద్వారా మహిళా రైతులు 100% పూర్తి లాభాన్ని పొందుతున్నారు.' : currentLanguage === 'kn' ? 'ನೇರ ಮಾರುಕಟ್ಟೆ ಸಂಪರ್ಕದ ಮೂಲಕ ಮಹಿಳಾ ರೈತರು 100% ಪೂರ್ಣ ಲಾಭವನ್ನು ಪಡೆಯುತ್ತಾರೆ.' : 'Direct market linkages enable women agricultural collectives to retain 100% of their harvest profits.',
      farmerName: 'Sunita Devi & Organic Collective',
      farmerLocation: 'Nashik Valley, Maharashtra',
      badgeText: t('hero_badge_payouts', '100% Direct Payouts'),
      stat: '4.9★ Quality Rating',
      ctaText: t('hero_cta_explore', 'Browse Fresh Harvests'),
      ctaLink: '/marketplace',
    },
    {
      id: 3,
      image: '/images/slide_smart_farmer.png',
      tag: currentLanguage === 'ta' ? 'டிஜிட்டல் மண்டி தொழில்நுட்பம்' : currentLanguage === 'te' ? 'డిజిటల్ వ్యవసాయ వాణిజ్యం' : currentLanguage === 'kn' ? 'ಡಿಜಿಟಲ್ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ' : currentLanguage === 'hi' ? 'डिजिटल कृषि व्यापार' : 'Digital Agri-Trade',
      title: currentLanguage === 'ta' ? 'நேரலை APMC மண்டி விலை ஒப்பீடு' : currentLanguage === 'te' ? 'నిజ-సమయ APMC మండీ ధరల విశ్లేషణ' : currentLanguage === 'kn' ? 'ನೈಜ-ಸಮಯದ APMC ಮಂಡಿ ದರ ಮಾಹಿತಿ' : currentLanguage === 'hi' ? 'रीयल-टाइम APMC मंडी भाव विश्लेषण' : 'Real-Time APMC Mandi Price Intelligence',
      subtitle: currentLanguage === 'ta' ? 'வெளிப்படையான விலை ஒப்பீடு விவசாயிகள் மற்றும் வாங்குபவர்களுக்கு நியாயமான வர்த்தகத்தை உறுதி செய்கிறது.' : currentLanguage === 'te' ? 'పారదర్శక ధరల పోలిక రైతులు మరియు కొనుగోలుదారులకు న్యాయమైన వాణిజ్యాన్ని అందిస్తుంది.' : 'Transparent market benchmarking helps producers and buyers trade at equitable, fair market rates.',
      farmerName: 'Gurpreet Singh • Wheat & Grain Producer',
      farmerLocation: 'Ludhiana, Punjab',
      badgeText: t('hero_badge_tracking', 'Smart Inventory Tracking'),
      stat: 'Same-Day Dispatch',
      ctaText: t('hero_cta_mandi', 'View Mandi Benchmarks'),
      ctaLink: '/price-insights',
    },
    {
      id: 4,
      image: '/images/slide_orchard_harvest.png',
      tag: currentLanguage === 'ta' ? 'புதிய தோட்ட விளைபொருட்கள்' : currentLanguage === 'te' ? 'తాజా తోట పంటలు' : currentLanguage === 'kn' ? 'ತಾಜಾ ತೋಟಗಾರಿಕಾ ಬೆಳೆಗಳು' : 'Fresh Orchard Harvests',
      title: currentLanguage === 'ta' ? 'பண்ணையிலிருந்து நேரடியாக புதிய பழங்கள் & மசாலாக்கள்' : currentLanguage === 'te' ? 'తోటల నుండి నేరుగా తాజా పండ్లు & మసాలాలు' : 'Direct Orchard Produce Straight to Retailers',
      subtitle: currentLanguage === 'ta' ? 'சான்றளிக்கப்பட்ட புவிசார் குறியீடு (GI) கொண்ட புதிய பழங்கள் மற்றும் மசாலாக்களை இடைத்தரகர்கள் இன்றி வாங்குங்கள்.' : 'Source farm-fresh fruits, vegetables, and aromatic spices with certified GI provenance and zero markup.',
      farmerName: 'Ananya Roy • Spice & Fruit Grower',
      farmerLocation: 'Wayanad, Kerala',
      badgeText: t('hero_badge_inspected', 'Direct Farm-to-Fork'),
      stat: '15-30% Lower Rates',
      ctaText: t('hero_cta_explore', 'Start Direct Sourcing'),
      ctaLink: '/marketplace',
    },
  ]

  const nextSlide = () => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused, current, currentLanguage])

  const slide = SLIDES[current]

  return (
    <div
      className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-emerald-800/80 bg-slate-950 text-white group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Cinematic Overlay */}
      <div className="relative h-[500px] sm:h-[540px] lg:h-[580px] w-full overflow-hidden">
        {SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover transform duration-1000 ease-out"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/products/tomato.jpg'
              }}
            />
            {/* Rich Duotone & Gradient Overlay for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-emerald-950/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
          </div>
        ))}

        {/* Slide Content Layer */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center">
          <div className="max-w-2xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 key={current}">
            {/* Tag Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-800/90 border border-emerald-500/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-amber-300 uppercase tracking-widest shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{slide.tag}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.14]">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-emerald-100/90 text-sm sm:text-base sm:leading-relaxed font-medium max-w-lg">
              {slide.subtitle}
            </p>

            {/* Farmer Attribution */}
            <div className="flex items-center space-x-3 pt-1 text-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white font-bold shadow">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <p className="font-black text-white">{slide.farmerName}</p>
                <p className="text-[11px] text-emerald-300">{slide.farmerLocation}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-3">
              <Link
                to={slide.ctaLink}
                className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-7 py-3.5 rounded-2xl transition-all shadow-xl hover:shadow-amber-500/20 text-xs sm:text-sm transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold px-6 py-3.5 rounded-2xl transition-all text-xs sm:text-sm"
              >
                <Sprout className="w-4 h-4 text-emerald-300" />
                <span>{t('hero_cta_join_farmer', 'Join as Farmer')}</span>
              </Link>
            </div>
          </div>

          {/* Floating Live Badge Over Image */}
          <div className="hidden lg:flex absolute right-14 top-1/2 -translate-y-1/2 flex-col space-y-4">
            <div className="glass-dark text-white p-4 rounded-3xl border border-emerald-500/30 shadow-2xl flex items-center space-x-3.5 animate-float">
              <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-emerald-300 uppercase font-black tracking-wider">Quality Seal</p>
                <p className="text-xs font-black">{slide.badgeText}</p>
              </div>
            </div>

            <div className="glass-dark text-white p-4 rounded-3xl border border-amber-500/30 shadow-2xl flex items-center space-x-3.5 animate-float-delayed">
              <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl font-black shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-amber-300 uppercase font-black tracking-wider">Direct Benefit</p>
                <p className="text-xs font-black">{slide.stat}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 focus:outline-none z-30 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 focus:outline-none z-30 shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2.5 z-30">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === current ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50' : 'w-2.5 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FarmerHeroSlider
