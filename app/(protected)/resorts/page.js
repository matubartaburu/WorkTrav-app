'use client'

import { useEffect, useState } from 'react'
import { MapPin, DollarSign, Home, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { getResortInfo } from '@/lib/resorts-data'

const ResortsUsaMap = dynamic(() => import('@/components/resorts/ResortsUsaMap'), { ssr: false })

export default function ResortsPage() {
  const { t, lang } = useLanguage()
  const [resorts, setResorts] = useState([])

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('resorts').select('*').order('nombre')
      setResorts(data || [])
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">{t('resorts_title')}</h1>
      <p className="text-text-secondary text-sm mb-6">{t('resorts_subtitle')}</p>

      {resorts.length > 0 && (
        <>
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-widest mb-3">
            {t('resorts_map_title')}
          </h2>
          <p className="text-xs text-text-secondary mb-3">{t('resorts_map_hint')}</p>
          <ResortsUsaMap resorts={resorts} lang={lang} />
        </>
      )}

      <div className="space-y-3">
        {resorts.length > 0 ? (
          resorts.map(resort => {
            const info = getResortInfo(resort.nombre, lang)
            return (
              <Link
                key={resort.id}
                href={`/resorts/${resort.id}`}
                className="block bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                      {info && <span className="text-xl">{info.emoji}</span>}
                      <h2 className="font-semibold text-text-primary">{resort.nombre}</h2>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted mb-3">
                      <MapPin size={11} />
                      {resort.estado_usa}
                    </div>

                    {/* Vibe */}
                    {info && (
                      <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                        {info.vibe}
                      </p>
                    )}

                    {/* Pills de info rápida */}
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
        ) : (
          <div className="text-center py-16 text-text-secondary text-sm">{t('resorts_loading')}</div>
        )}
      </div>
    </div>
  )
}
