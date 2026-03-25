'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'
import { useLanguage } from '@/lib/LanguageContext'

export default function CountrySelector({ value, onChange }) {
  const { lang } = useLanguage()
  const [search, setSearch] = useState('')

  const filtered = COUNTRIES.filter(c =>
    c[lang]?.toLowerCase().includes(search.toLowerCase()) ||
    c.es.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar país..."
          className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Grid de países */}
      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
        {filtered.map(c => (
          <button
            key={c.code}
            type="button"
            onClick={() => onChange(c.es)} // siempre guardamos en español
            className={`flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm border transition-colors text-left ${
              value === c.es
                ? 'border-accent bg-accent/10 text-accent font-medium'
                : 'border-border hover:border-text-muted text-text-primary'
            }`}
          >
            <span className="text-lg leading-none">{c.flag}</span>
            <span className="truncate">{c[lang] ?? c.es}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
