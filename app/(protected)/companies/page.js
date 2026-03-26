'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, Globe, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { StarDisplay } from '@/components/StarRating'

const PRICE_META = {
  economico: { label: null, badge: '$', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  medio:     { label: null, badge: '$$', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  premium:   { label: null, badge: '$$$', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
}

const RATING_OPTIONS = [
  { label: 'Todos', value: 0 },
  { label: '3★+', value: 3 },
  { label: '4★+', value: 4 },
]

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? 'bg-accent border-accent text-white'
          : 'bg-surface border-border text-text-secondary hover:border-accent/50'
      }`}
    >
      {label}
    </button>
  )
}

function avgRating(reviews) {
  if (!reviews?.length) return null
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

export default function CompaniesPage() {
  const { t } = useLanguage()
  const [companies, setCompanies] = useState([])
  const [countryFilter, setCountryFilter] = useState(null)
  const [ratingFilter, setRatingFilter] = useState(0)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('companies')
        .select('*, company_reviews(rating)')
        .order('nombre')
      setCompanies(data || [])
    }
    load()
  }, [])

  const countries = useMemo(() => (
    [...new Set(companies.map(c => c.pais).filter(Boolean))].sort()
  ), [companies])

  const filtered = useMemo(() => companies.filter(c => {
    if (countryFilter && c.pais !== countryFilter) return false
    if (ratingFilter > 0) {
      const avg = avgRating(c.company_reviews)
      if (!avg || avg < ratingFilter) return false
    }
    return true
  }), [companies, countryFilter, ratingFilter])

  const hasFilters = countryFilter || ratingFilter > 0

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">{t('companies_title')}</h1>
      <p className="text-text-secondary text-sm mb-4">{t('companies_subtitle')}</p>

      {companies.length > 0 && (
        <div className="space-y-3 mb-6">
          {/* País */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <FilterChip
              label={t('companies_filter_all_countries')}
              active={!countryFilter}
              onClick={() => setCountryFilter(null)}
            />
            {countries.map(c => (
              <FilterChip
                key={c}
                label={c}
                active={countryFilter === c}
                onClick={() => setCountryFilter(countryFilter === c ? null : c)}
              />
            ))}
          </div>

          {/* Rating */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {RATING_OPTIONS.map(opt => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                active={ratingFilter === opt.value}
                onClick={() => setRatingFilter(opt.value)}
              />
            ))}
          </div>

          {hasFilters && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">{filtered.length} {t('filter_results')}</span>
              <button
                onClick={() => { setCountryFilter(null); setRatingFilter(0) }}
                className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={12} /> {t('filter_clear')}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(company => {
            const avg = avgRating(company.company_reviews)
            const count = company.company_reviews?.length || 0
            const price = company.precio_rango ? PRICE_META[company.precio_rango] : null

            return (
              <Link
                key={company.id}
                href={`/companies/${company.id}`}
                className="block bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold text-text-primary">{company.nombre}</h2>
                    </div>

                    {company.pais && (
                      <div className="flex items-center gap-1 text-xs text-text-muted mb-3">
                        <Globe size={11} /> {company.pais}
                      </div>
                    )}

                    {company.descripcion && (
                      <p className="text-sm text-text-secondary mb-3 leading-relaxed line-clamp-2">
                        {company.descripcion}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {avg !== null ? (
                        <div className="flex items-center gap-1.5">
                          <StarDisplay rating={avg} />
                          <span className="text-xs text-text-muted">{avg.toFixed(1)} · {count} {t('companies_reviews')}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted">{t('companies_no_reviews')}</span>
                      )}

                      {price && (
                        <span className={`text-xs border rounded-full px-2.5 py-1 font-medium ${price.color}`}>
                          {price.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1 ml-3" />
                </div>
              </Link>
            )
          })
        ) : companies.length > 0 ? (
          <div className="text-center py-12 text-text-secondary text-sm">
            <p className="mb-2">{t('filter_no_results')}</p>
            <button onClick={() => { setCountryFilter(null); setRatingFilter(0) }} className="text-accent hover:underline text-xs">
              {t('filter_clear')}
            </button>
          </div>
        ) : (
          <div className="text-center py-16 text-text-secondary text-sm">{t('companies_loading')}</div>
        )}
      </div>
    </div>
  )
}
