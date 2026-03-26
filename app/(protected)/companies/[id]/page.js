'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { StarDisplay } from '@/components/StarRating'

const PRICE_META = {
  economico: { badge: '$', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  medio:     { badge: '$$', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
}

function avgRating(reviews) {
  if (!reviews?.length) return null
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

export default function CompanyDetailPage() {
  const { id } = useParams()
  const { t } = useLanguage()
  const [company, setCompany] = useState(null)
  const [reviews, setReviews] = useState([])
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const [
        { data: comp },
        { data: { user } },
        { data: revs },
      ] = await Promise.all([
        supabase.from('companies').select('*').eq('id', id).single(),
        supabase.auth.getUser(),
        supabase
          .from('company_reviews')
          .select('*, users(nombre, pais)')
          .eq('company_id', id)
          .order('created_at', { ascending: false }),
      ])
      setCompany(comp)
      setUserId(user?.id ?? null)
      setReviews(revs || [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="text-center py-20 text-text-secondary text-sm">{t('companies_loading')}</div>
  if (!company) return <div className="text-center py-20 text-text-secondary text-sm">{t('company_not_found')}</div>

  const avg = avgRating(reviews)
  const price = company.precio_rango ? PRICE_META[company.precio_rango] : null

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/companies" className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{company.nombre}</h1>
          {company.pais && (
            <div className="flex items-center gap-1 text-sm text-text-muted">
              <Globe size={12} /> {company.pais}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Rating + precio */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              {avg !== null ? (
                <>
                  <StarDisplay rating={avg} size="lg" />
                  <p className="text-sm text-text-muted mt-1">
                    {avg.toFixed(1)} · {reviews.length} {t('companies_reviews')}
                  </p>
                </>
              ) : (
                <p className="text-sm text-text-muted">{t('companies_no_reviews')}</p>
              )}
            </div>
            {price && (
              <span className={`text-sm border rounded-full px-3 py-1.5 font-semibold ${price.color}`}>
                {price.badge} · {t(`company_price_${company.precio_rango}`)}
              </span>
            )}
          </div>
        </div>

        {/* Descripción */}
        {company.descripcion && (
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-text-secondary leading-relaxed">{company.descripcion}</p>
          </div>
        )}

        {/* Website */}
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:border-accent/50 transition-colors"
          >
            <span className="text-sm text-text-secondary">{t('company_website')}</span>
            <div className="flex items-center gap-1.5 text-accent text-sm">
              {company.website.replace(/^https?:\/\//, '')}
              <ExternalLink size={13} />
            </div>
          </a>
        )}

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-text-muted uppercase tracking-widest">
              {t('company_reviews_title')}
            </h2>
            <Link href={`/companies/${id}/review`} className="text-xs text-accent hover:underline">
              {t('company_write_review')}
            </Link>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <StarDisplay rating={rev.rating} />
                        {rev.anio && <span className="text-xs text-text-muted">{rev.anio}</span>}
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {rev.users?.nombre || '—'}
                        {rev.users?.pais && ` · ${rev.users.pais}`}
                      </p>
                    </div>
                  </div>
                  {rev.comentario && (
                    <p className="text-sm text-text-secondary leading-relaxed">{rev.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-text-secondary text-sm">
              <p className="mb-2">{t('company_no_reviews')}</p>
              <Link href={`/companies/${id}/review`} className="text-accent hover:underline">
                {t('company_be_first')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
