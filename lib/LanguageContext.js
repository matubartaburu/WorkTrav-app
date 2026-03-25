'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es')

  useEffect(() => {
    const saved = localStorage.getItem('wt_lang')
    if (saved && translations[saved]) setLang(saved)
  }, [])

  const changeLang = (code) => {
    setLang(code)
    localStorage.setItem('wt_lang', code)
  }

  const t = (key) => translations[lang]?.[key] ?? translations['es'][key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
