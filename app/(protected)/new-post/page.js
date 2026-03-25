'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const MAX_CHARS = 500

export default function NewPostPage() {
  const router = useRouter()
  const [contenido, setContenido] = useState('')
  const [resortId, setResortId] = useState('')
  const [resorts, setResorts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResorts = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('resorts').select('id, nombre, estado_usa').order('nombre')
      setResorts(data || [])
    }
    fetchResorts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contenido.trim()) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: postError } = await supabase.from('posts').insert({
      user_id: user.id,
      contenido: contenido.trim(),
      resort_id: resortId || null,
      likes_count: 0,
    })

    if (postError) {
      setError('Error al publicar. Intentá de nuevo.')
      setLoading(false)
      return
    }

    router.push('/feed')
    router.refresh()
  }

  const remaining = MAX_CHARS - contenido.length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/feed" className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold">Nueva experiencia</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Contá tu experiencia en el resort, tips útiles, cómo fue el trabajo..."
            rows={6}
            className="w-full bg-transparent text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none leading-relaxed"
          />
          <div className={`text-right text-xs mt-2 ${remaining < 50 ? 'text-red-400' : 'text-text-muted'}`}>
            {remaining} caracteres restantes
          </div>
        </div>

        {/* Resort selector */}
        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">Resort (opcional)</label>
          <select
            value={resortId}
            onChange={(e) => setResortId(e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Sin resort específico</option>
            {resorts.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}, {r.estado_usa}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !contenido.trim()}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium text-sm transition-colors"
        >
          {loading ? 'Publicando...' : 'Publicar experiencia'}
        </button>
      </form>
    </div>
  )
}
