import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { Globe, Check, ChevronDown } from 'lucide-react'

export const LanguageSelector = ({ isMobile = false }) => {
  const { currentLanguage, setLanguage, languages, activeLangObj } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (code) => {
    setLanguage(code)
    setIsOpen(false)
  }

  if (isMobile) {
    return (
      <div className="pt-2">
        <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
          <Globe className="w-3.5 h-3.5 text-amber-300" />
          <span>Language / மொழி / భాష / ಭಾಷೆ</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-sm ring-1 ring-amber-300'
                    : 'bg-emerald-900/80 text-white hover:bg-emerald-800 border border-emerald-700/60'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="truncate">{lang.native}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 bg-emerald-950/70 hover:bg-emerald-950 border border-emerald-700/70 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm focus:outline-none"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-amber-300" />
        <span className="hidden sm:inline">{activeLangObj.flag}</span>
        <span className="font-extrabold">{activeLangObj.native}</span>
        <ChevronDown className={`w-3 h-3 text-emerald-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Language / மொழி
            </p>
          </div>
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.code
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-left transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 font-black'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">{lang.flag}</span>
                  <div>
                    <p className="font-bold">{lang.native}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{lang.name}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-600 font-black" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
