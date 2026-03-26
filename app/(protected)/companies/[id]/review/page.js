'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { StarPicker } from '@/components/StarRating'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i)

export default function WriteReviewPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  const [company, setCompany] = useState(null)
  const [rating, setRating] = useState(0)
  const [anio, setAnio] = useState(CURRENT_YEAR)
  const [comentario, setComentario] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('companies').select('id, nombre').eq('id', id).single()
      setCompany(data)
    }
    load()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: err } = await supabase.from('company_reviews').insert({
      user_id: user.id,
      company_id: id,
      rating,
      anio,
      comentario: comentario.trim() || null,
    })

    if (err) {
      setError(t('error_generic'))
      setLoading(false)
      return
    }

    router.push(`/companies/${id}`)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/companies/${id}`} className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">{t('company_review_title')}</h1>
          {company && <p className="text-sm text-text-muted">{company.nombre}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Estrellas */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-text-secondary mb-3">{t('company_review_rating')}</p>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        {/* Año */}
        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">{t('company_review_year')}</label>
          <select
            value={anio}
            onChange={e => setAnio(Number(e.target.value))}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Comentario */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-text-secondary mb-2">{t('company_review_comment')}</p>
          <textarea
            value={comentario}
            onChange={e => setComentario(e.target.value.slice(0, 600))}
            placeholder={t('company_review_comment_placeholder')}
            rows={5}
            className="w-full bg-transparent text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none leading-relaxed"
          />
          <div className="text-right text-xs text-text-muted mt-1">{600 - comentario.length}</div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium text-sm transition-colors"
        >
          {loading ? t('company_review_loading') : t('company_review_submit')}
        </button>
      </form>
    </div>
  )
}
