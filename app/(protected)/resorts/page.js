'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function ResortsPage() {
  const { t } = useLanguage()
  const [resorts, setResorts] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('resorts').select('*').order('nombre')
      setResorts(data || [])
    }
    fetch()
  }, [])

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">{t('resorts_title')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resorts.length > 0 ? (
          resorts.map(resort => (
            <div
              key={resort.id}
              className="bg-card border border-border rounded-xl p-5 hover:border-text-muted transition-colors cursor-pointer"
            >
              <h2 className="font-medium mb-1">{resort.nombre}</h2>
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <MapPin size={13} />
                {resort.estado_usa}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-16 text-text-secondary text-sm">
            Cargando resorts...
          </div>
        )}
      </div>
    </div>
  )
}
