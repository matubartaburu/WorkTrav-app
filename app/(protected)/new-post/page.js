'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { POST_TOPICS } from '@/lib/post-topics'

const MAX_CHARS = 500

export default function NewPostPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [contenido, setContenido] = useState('')
  const [resortId, setResortId] = useState(searchParams.get('resort') || '')
  const [topic, setTopic] = useState('general')
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
      topic,
      likes_count: 0,
    })

    if (postError) {
      setError(t('error_generic'))
      setLoading(false)
      return
    }

    router.push('/feed')
    router.refresh()
  }

  const remaining = MAX_CHARS - contenido.length

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/feed" className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold">{t('new_post_title')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value.slice(0, MAX_CHARS))}
            placeholder={t('new_post_placeholder')}
            rows={6}
            className="w-full bg-transparent text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none leading-relaxed"
          />
          <div className={`text-right text-xs mt-2 ${remaining < 50 ? 'text-red-400' : 'text-text-muted'}`}>
            {remaining} {t('new_post_chars')}
          </div>
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">{t('new_post_resort')}</label>
          <select
            value={resortId}
            onChange={(e) => setResortId(e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">{t('new_post_resort_none')}</option>
            {resorts.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}, {r.estado_usa}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">{t('new_post_topic')}</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          >
            {POST_TOPICS.map((value) => (
              <option key={value} value={value}>{t(`topic_${value}`)}</option>
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
          {loading ? t('new_post_loading') : t('new_post_submit')}
        </button>
      </form>
    </div>
  )
}
