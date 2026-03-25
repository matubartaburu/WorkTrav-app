'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { LANGUAGES } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { lang, changeLang } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => changeLang(code)}
          className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
            lang === code
              ? 'bg-accent/20 text-accent'
              : 'text-text-muted hover:text-text-secondary'
          }`}
          title={flag}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
