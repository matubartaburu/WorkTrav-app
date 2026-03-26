'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapPin, DollarSign, Home, ArrowUp, Snowflake } from 'lucide-react'
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

const GRADIENTS = [
  'linear-gradient(145deg, #0f172a 0%, #1e3a5f 100%)',
  'linear-gradient(145deg, #1a1a2e 0%, #0f3460 100%)',
  'linear-gradient(145deg, #18113a 0%, #2d1b69 100%)',
  'linear-gradient(145deg, #0c1445 0%, #1e3a8a 100%)',
  'linear-gradient(145deg, #0a2a1a 0%, #065f46 100%)',
  'linear-gradient(145deg, #1a0f2e 0%, #4c1d95 100%)',
  'linear-gradient(145deg, #0d1b2a 0%, #164e63 100%)',
  'linear-gradient(145deg, #111827 0%, #1e3a5f 100%)',
]

const ALTITUDES = {
  'Vail': '3,527m',
  'Aspen': '3,813m',
  'Aspen Snowmass': '3,813m',
  'Breckenridge': '3,914m',
  'Jackson Hole': '3,185m',
  'Park City': '3,048m',
  'Mammoth Mountain': '3,369m',
  'Mammoth': '3,369m',
  'Steamboat': '3,221m',
  'Steamboat Springs': '3,221m',
  'Telluride': '4,009m',
  'Big Sky': '3,403m',
  'Sun Valley': '2,789m',
  'Heavenly': '3,060m',
  'Killington': '1,293m',
  'Stowe': '1,339m',
  'Taos': '3,804m',
  'Snowbird': '3,353m',
  'Alta': '3,216m',
  'Copper Mountain': '3,753m',
  'Winter Park': '3,676m',
  'Red River': '3,154m',
}

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
    return [...new Set(resorts.map(r => r.estado_usa))].sort()
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
  const uniqueStates = states.length

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-xs text-text-secondary bg-card border border-border rounded-full px-3 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          TEMPORADA 2025–26 — EN VIVO
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {t('resorts_title') || 'Resorts en'} <span className="text-accent">USA</span>
        </h1>
        <p className="text-text-secondary text-sm">{t('resorts_subtitle') || 'Los mejores destinos para tu temporada W&T'}</p>
      </div>

      {/* Stats */}
      {resorts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { value: resorts.length, label: 'RESORTS', emoji: '⛷️' },
            { value: uniqueStates, label: 'ESTADOS', emoji: '📍' },
            { value: '🇺🇸', label: 'PAÍS', emoji: null },
            { value: 'Dic–Abr', label: 'TEMPORADA', emoji: '❄️' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-3 flex items-center gap-2.5">
              {s.emoji && <span className="text-lg leading-none">{s.emoji}</span>}
              <div>
                <div className="text-base font-bold leading-tight">{s.value}</div>
                <div className="text-[10px] text-text-muted tracking-widest mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      {resorts.length > 0 && (
        <div className="space-y-3 mb-6">
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

          {hasFilters && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">
                {filtered.length} {t('filter_results') || 'resultados'}
              </span>
              <button
                onClick={() => { setStateFilter(null); setSalaryFilter(0) }}
                className="text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                {t('filter_clear') || 'Limpiar filtros'}
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

      {/* Resort cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {filtered.length > 0 ? (
          filtered.map((resort, i) => {
            const info = getResortInfo(resort.nombre, lang)
            const altitude = ALTITUDES[resort.nombre]
            const gradient = GRADIENTS[i % GRADIENTS.length]
            return (
              <Link
                key={resort.id}
                href={`/resorts/${resort.id}`}
                className="relative rounded-2xl overflow-hidden group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 block"
                style={{
                  background: gradient,
                  minHeight: '190px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
              >
                {/* Decorative snowflake */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <Snowflake
                    size={130}
                    strokeWidth={0.35}
                    className="text-white/[0.04] group-hover:text-white/[0.08] transition-colors duration-500"
                  />
                </div>

                {/* Hover shine */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)' }}
                />

                {/* Top badges */}
                <div className="relative z-10 flex items-start justify-between p-4 pb-0">
                  <span className="text-xs font-medium text-white/80 bg-white/10 border border-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    {resort.estado_usa}
                  </span>
                  {altitude && (
                    <span className="text-xs font-medium text-white/70 bg-white/10 border border-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ArrowUp size={9} strokeWidth={3} />
                      {altitude}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 p-5 pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    {info && <span className="text-xl leading-none">{info.emoji}</span>}
                    <h2 className="text-xl font-bold text-white leading-tight tracking-tight">{resort.nombre}</h2>
                  </div>

                  {info && (
                    <p className="text-white/50 text-xs leading-relaxed mb-3 line-clamp-2">{info.vibe}</p>
                  )}

                  {info && (
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 text-xs bg-white/10 border border-white/10 rounded-full px-2.5 py-1 text-white/70">
                        📅 {info.temporada}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-white/10 border border-white/10 rounded-full px-2.5 py-1 text-white/70">
                        <DollarSign size={9} />{info.salario}
                      </span>
                      {info.alojamiento_empresa && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-500/20 border border-green-500/20 rounded-full px-2.5 py-1 text-green-400">
                          <Home size={9} /> {t('resorts_housing_company')}
                        </span>
                      )}
                    </div>
                  )}

                  {!info && (
                    <div className="flex items-center gap-1.5 mt-2 text-white/40">
                      <MapPin size={11} />
                      <span className="text-xs">{resort.estado_usa}, USA</span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })
        ) : resorts.length > 0 ? (
          <div className="col-span-2 text-center py-12 text-text-secondary text-sm">
            <p className="mb-2">{t('filter_no_results') || 'Sin resultados para estos filtros.'}</p>
            <button
              onClick={() => { setStateFilter(null); setSalaryFilter(0) }}
              className="text-accent hover:underline text-xs"
            >
              {t('filter_clear') || 'Limpiar filtros'}
            </button>
          </div>
        ) : (
          <div className="col-span-2 text-center py-16 text-text-secondary text-sm">
            {t('resorts_loading') || 'Cargando resorts...'}
          </div>
        )}
      </div>
    </div>
  )
}
