'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapPin, DollarSign, Home, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { getResortInfo, parseMinSalary } from '@/lib/resorts-data'

const ResortsUsaMap = dynamic(() => import('@/components/resorts/ResortsUsaMap'), { ssr: false })

const SALARY_OPTIONS = [
  { label: 'Todos', value: 0 },
  { label: '$14+/hr', value: 14 },
  { label: '$15+/hr', value: 15 },
  { label: '$16+/hr', value: 16 },
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

export default function ResortsPage() {
  const { t, lang } = useLanguage()
  const [resorts, setResorts] = useState([])
  const [stateFilter, setStateFilter] = useState(null)
  const [salaryFilter, setSalaryFilter] = useState(0)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('resorts').select('*').order('nombre')
      setResorts(data || [])
    }
    load()
  }, [])

  const states = useMemo(() => {
    const unique = [...new Set(resorts.map(r => r.estado_usa))].sort()
    return unique
  }, [resorts])

  const filtered = useMemo(() => {
    return resorts.filter(resort => {
      if (stateFilter && resort.estado_usa !== stateFilter) return false
      if (salaryFilter > 0) {
        const info = getResortInfo(resort.nombre, lang)
        if (!info) return false
        const min = parseMinSalary(info.salario)
        if (min === null || min < salaryFilter) return false
      }
      return true
    })
  }, [resorts, stateFilter, salaryFilter, lang])

  const hasFilters = stateFilter || salaryFilter > 0

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">{t('resorts_title')}</h1>
      <p className="text-text-secondary text-sm mb-4">{t('resorts_subtitle')}</p>

      {/* Filtros */}
      {resorts.length > 0 && (
        <div className="space-y-3 mb-6">
          {/* Estado */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <FilterChip
              label={t('filter_all_states') || 'Todos los estados'}
              active={!stateFilter}
              onClick={() => setStateFilter(null)}
            />
            {states.map(state => (
              <FilterChip
                key={state}
                label={state}
                active={stateFilter === state}
                onClick={() => setStateFilter(stateFilter === state ? null : state)}
              />
            ))}
          </div>

          {/* Salario mínimo */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="shrink-0 text-xs text-text-muted self-center flex items-center gap-1">
              <DollarSign size={11} /> {t('filter_min_salary') || 'Salario mín.'}
            </span>
            {SALARY_OPTIONS.map(opt => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                active={salaryFilter === opt.value}
                onClick={() => setSalaryFilter(opt.value)}
              />
            ))}
          </div>

          {/* Reset + contador */}
          {hasFilters && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">
                {filtered.length} {t('filter_results') || 'resultados'}
              </span>
              <button
                onClick={() => { setStateFilter(null); setSalaryFilter(0) }}
                className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={12} /> {t('filter_clear') || 'Limpiar filtros'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mapa */}
      {resorts.length > 0 && (
        <>
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-widest mb-3">
            {t('resorts_map_title')}
          </h2>
          <p className="text-xs text-text-secondary mb-3">{t('resorts_map_hint')}</p>
          <ResortsUsaMap resorts={filtered} lang={lang} />
        </>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(resort => {
            const info = getResortInfo(resort.nombre, lang)
            return (
              <Link
                key={resort.id}
                href={`/resorts/${resort.id}`}
                className="block bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {info && <span className="text-xl">{info.emoji}</span>}
                      <h2 className="font-semibold text-text-primary">{resort.nombre}</h2>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted mb-3">
                      <MapPin size={11} />
                      {resort.estado_usa}
                    </div>
                    {info && (
                      <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                        {info.vibe}
                      </p>
                    )}
                    {info && (
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-xs bg-surface border border-border rounded-full px-2.5 py-1 text-text-secondary">
                          📅 {info.temporada}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-surface border border-border rounded-full px-2.5 py-1 text-text-secondary">
                          <DollarSign size={10} />{info.salario}
                        </span>
                        {info.alojamiento_empresa && (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1 text-green-400">
                            <Home size={10} /> {t('resorts_housing_company')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={18} className="text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1 ml-3" />
                </div>
              </Link>
            )
          })
        ) : resorts.length > 0 ? (
          <div className="text-center py-12 text-text-secondary text-sm">
            <p className="mb-2">{t('filter_no_results') || 'Sin resultados para estos filtros.'}</p>
            <button
              onClick={() => { setStateFilter(null); setSalaryFilter(0) }}
              className="text-accent hover:underline text-xs"
            >
              {t('filter_clear') || 'Limpiar filtros'}
            </button>
          </div>
        ) : (
          <div className="text-center py-16 text-text-secondary text-sm">{t('resorts_loading')}</div>
        )}
      </div>
    </div>
  )
}
