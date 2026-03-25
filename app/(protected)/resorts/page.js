import { createClient } from '@/lib/supabase-server'
import { MapPin } from 'lucide-react'
import Link from 'next/link'

export default async function ResortsPage() {
  const supabase = await createClient()

  const { data: resorts } = await supabase
    .from('resorts')
    .select('*')
    .order('nombre')

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Resorts en USA</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resorts && resorts.length > 0 ? (
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
          <div className="col-span-2 text-center py-16 text-text-secondary">
            <p>No hay resorts cargados todavía.</p>
            <p className="text-sm mt-1">Insertá los resorts en Supabase para verlos acá.</p>
          </div>
        )}
      </div>
    </div>
  )
}
