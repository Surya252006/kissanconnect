import React, { createContext, useContext, useState, useEffect } from 'react'
import { LANGUAGES, translations } from '../locales/translations.js'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('kisan_language') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('kisan_language', currentLanguage)
    document.documentElement.lang = currentLanguage
  }, [currentLanguage])

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode)
    }
  }

  // Translation helper function
  const t = (key, fallback = '') => {
    const langObj = translations[currentLanguage] || translations.en
    return langObj[key] || translations.en[key] || fallback || key
  }

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0]

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        activeLangObj,
        languages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext
