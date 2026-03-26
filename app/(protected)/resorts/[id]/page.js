'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, DollarSign, Home, Thermometer,
  Briefcase, Lightbulb, Calendar, Building2
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { getResortInfo, DIFICULTAD_COLOR } from '@/lib/resorts-data'
import { useLanguage } from '@/lib/LanguageContext'
import PostCard from '@/components/feed/PostCard'
import { POST_TOPICS } from '@/lib/post-topics'

export default function ResortDetailPage() {
  const { id } = useParams()
  const { t, lang } = useLanguage()
  const [resort, setResort] = useState(null)
  const [posts, setPosts] = useState([])
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [topicFilter, setTopicFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()

      const [{ data: res }, { data: { user } }, { data: resortPosts }] = await Promise.all([
        supabase.from('resorts').select('*').eq('id', id).single(),
        supabase.auth.getUser(),
        supabase.from('posts')
          .select('*, users(nombre, pais), resorts(nombre, estado_usa)')
          .eq('resort_id', id)
          .order('created_at', { ascending: false })
          .limit(20),
      ])

      setResort(res)
      setUserId(user?.id ?? null)
      setPosts(resortPosts || [])
      setLoading(false)
    }
    load()
  }, [id])

  const filteredPosts = useMemo(() => {
    if (topicFilter === 'all') return posts
    return posts.filter((post) => (post.topic || 'general') === topicFilter)
  }, [posts, topicFilter])

  if (loading) return (
    <div className="text-center py-20 text-text-secondary text-sm">{t('resorts_loading')}</div>
  )

  if (!resort) return (
    <div className="text-center py-20 text-text-secondary text-sm">{t('resort_not_found')}</div>
  )

  const info = getResortInfo(resort.nombre, lang)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/resorts" className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            {info && <span className="text-2xl">{info.emoji}</span>}
            <h1 className="text-2xl font-bold">{resort.nombre}</h1>
          </div>
          <div className="flex items-center gap-1 text-sm text-text-muted">
            <MapPin size={12} />
            {resort.estado_usa}
          </div>
        </div>
      </div>

      {info ? (
        <div className="space-y-4">

          {/* Vibe card */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-text-secondary leading-relaxed">{info.vibe}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-xs mb-1.5">
                <Calendar size={12} /> {t('resort_season')}
              </div>
              <p className="font-semibold text-sm">{info.temporada}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-xs mb-1.5">
                <DollarSign size={12} /> {t('resort_salary')}
              </div>
              <p className="font-semibold text-sm text-green-400">{info.salario}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-xs mb-1.5">
                <Thermometer size={12} /> {t('resort_snow')}
              </div>
              <p className="font-semibold text-sm">{info.nieve}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-xs mb-1.5">
                <MapPin size={12} /> {t('resort_near_city')}
              </div>
              <p className="font-semibold text-sm">{info.ciudad_cercana}</p>
            </div>
          </div>

          {/* Dificultad W&T */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 text-text-muted text-xs mb-2">
              <Briefcase size={12} /> {t('resort_difficulty')}
            </div>
            <p className={`font-semibold text-sm ${DIFICULTAD_COLOR[info.dificultad_wt_key] ?? 'text-text-primary'}`}>
              {info.dificultad_wt}
            </p>
          </div>

          {/* Housing */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 text-text-muted text-xs mb-2">
              <Home size={12} /> {t('resort_housing')}
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{info.housing}</p>
            {info.alojamiento_empresa && (
              <span className="inline-flex items-center gap-1.5 mt-3 text-xs bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-green-400 font-medium">
                <Home size={10} /> {t('resort_company_housing')}
              </span>
            )}
          </div>

          {/* Trabajos disponibles */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 text-text-muted text-xs mb-3">
              <Briefcase size={12} /> {t('resort_jobs')}
            </div>
            <div className="flex flex-wrap gap-2">
              {info.trabajos.map(job => (
                <span key={job} className="text-xs bg-surface border border-border rounded-full px-3 py-1.5 text-text-secondary">
                  {job}
                </span>
              ))}
            </div>
          </div>

          {/* Tips de la comunidad (estáticos por ahora) */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 text-text-muted text-xs mb-3">
              <Lightbulb size={12} /> {t('resort_tips')}
            </div>
            <ul className="space-y-2.5">
              {info.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
                  <span className="text-accent mt-0.5 shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-6 text-text-secondary text-sm">
          {t('resort_info_soon')}
        </div>
      )}

      {/* Posts de la comunidad sobre este resort */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-widest">
            {t('resort_community_experiences')}
          </h2>
          <Link
            href={`/new-post?resort=${id}`}
            className="text-xs text-accent hover:underline"
          >
            {t('resort_share')}
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button
            onClick={() => setTopicFilter('all')}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              topicFilter === 'all'
                ? 'bg-accent border-accent text-white'
                : 'bg-surface border-border text-text-secondary hover:border-accent/50'
            }`}
          >
            {t('post_topic_all')}
          </button>
          {POST_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setTopicFilter(topic)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                topicFilter === topic
                  ? 'bg-accent border-accent text-white'
                  : 'bg-surface border-border text-text-secondary hover:border-accent/50'
              }`}
            >
              {t(`topic_${topic}`)}
            </button>
          ))}
        </div>

        {filteredPosts.length > 0 ? (
          <div className="space-y-3">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} currentUserId={userId} />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-text-secondary text-sm">
            {posts.length > 0 ? (
              <p className="mb-2">{t('post_topic_no_results')}</p>
            ) : (
              <>
                <p className="mb-2">{t('resort_no_posts')} {resort.nombre}.</p>
                <Link href={`/new-post?resort=${id}`} className="text-accent hover:underline">
                  {t('resort_be_first')}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
