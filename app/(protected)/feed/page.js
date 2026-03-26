'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PlusCircle, MessageCircle, MapPin, ChevronRight, Search, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import PostCard from '@/components/feed/PostCard'
import { getResortInfo } from '@/lib/resorts-data'

export default function FeedPage() {
  const router = useRouter()
  const { t, lang } = useLanguage()
  const [posts, setPosts] = useState([])
  const [userId, setUserId] = useState(null)
  const [myResort, setMyResort] = useState(null)
  const [resorts, setResorts] = useState([])
  const [resortSearch, setResortSearch] = useState('')
  const [isSavingResort, setIsSavingResort] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      const [{ data: postsData }, { data: profile }, { data: resortsData }] = await Promise.all([
        supabase
          .from('posts')
          .select('*, users(nombre, pais), resorts(nombre, estado_usa)')
          .order('created_at', { ascending: false })
          .limit(20),
        user
          ? supabase.from('users').select('resort_id, resorts(id, nombre, estado_usa)').eq('id', user.id).single()
          : Promise.resolve({ data: null }),
        supabase.from('resorts').select('id, nombre, estado_usa').order('nombre'),
      ])

      setPosts(postsData || [])
      if (profile?.resorts) setMyResort(profile.resorts)
      setResorts(resortsData || [])
    }
    fetchData()
  }, [])

  const info = myResort ? getResortInfo(myResort.nombre, lang) : null
  const normalizedSearch = resortSearch.trim().toLowerCase()
  const searchedResorts = useMemo(() => {
    if (!normalizedSearch) return []
    return resorts
      .filter((resort) => (
        resort.nombre.toLowerCase().includes(normalizedSearch)
        || resort.estado_usa.toLowerCase().includes(normalizedSearch)
      ))
      .slice(0, 8)
  }, [resorts, normalizedSearch])

  const openResortChat = async (resort) => {
    if (!resort) return

    // If user has no resort yet, save their selection and take them to that chat.
    if (!myResort && userId) {
      try {
        setIsSavingResort(true)
        const supabase = createClient()
        await supabase.from('users').update({ resort_id: resort.id }).eq('id', userId)
        setMyResort(resort)
      } finally {
        setIsSavingResort(false)
      }
    }

    router.push(`/resorts/${resort.id}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">{t('feed_title')}</h1>
        <Link
          href="/new-post"
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle size={16} />
          <span className="hidden sm:block">{t('feed_new')}</span>
        </Link>
      </div>

      {/* Card Mi Montaña */}
      {myResort ? (
        <Link
          href={`/resorts/${myResort.id}`}
          className="block bg-gradient-to-br from-accent/20 via-accent/10 to-card border border-accent/30 rounded-2xl p-5 mb-5 hover:border-accent/60 transition-colors group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{info?.emoji || '⛷️'}</span>
              <div>
                <p className="text-xs text-accent font-semibold uppercase tracking-widest mb-1">Tu chat principal</p>
                <p className="text-lg font-semibold text-text-primary leading-tight">{myResort.nombre}</p>
                <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                  <MapPin size={10} /> {myResort.estado_usa}
                </div>
              </div>
            </div>
            <MessageCircle size={20} className="text-accent shrink-0 mt-0.5" />
          </div>

          <div className="mt-4 inline-flex items-center gap-2 bg-accent text-white text-xs font-medium px-3 py-2 rounded-lg">
            Entrar al chat de mi montaña
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      ) : (
        <div className="bg-card border border-dashed border-border rounded-xl p-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⛷️</span>
            <div>
              <p className="text-sm font-medium text-text-primary">Elegí tu montaña para entrar al chat social</p>
              <p className="text-xs text-text-muted mt-0.5">Cuando elijas una, te llevamos directo a su chat</p>
            </div>
          </div>
          <Link href="/profile/edit" className="inline-flex items-center gap-1 text-accent text-sm mt-3 hover:underline">
            Configurar desde mi perfil <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {/* Buscador de chats por montaña */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-text-primary mb-1">Buscar chat por montaña</p>
        <p className="text-xs text-text-muted mb-3">Escribí el nombre del resort o estado para entrar rápido al chat social.</p>

        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={resortSearch}
            onChange={(e) => setResortSearch(e.target.value)}
            placeholder="Ej: Vail, Aspen, Colorado..."
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {normalizedSearch && (
          <div className="mt-3 space-y-2">
            {searchedResorts.length > 0 ? (
              searchedResorts.map((resort) => (
                <button
                  key={resort.id}
                  type="button"
                  onClick={() => openResortChat(resort)}
                  disabled={isSavingResort}
                  className="w-full flex items-center justify-between gap-3 bg-surface hover:bg-accent/10 border border-border hover:border-accent/40 rounded-lg px-3 py-2.5 text-left transition-colors disabled:opacity-60"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary leading-tight">{resort.nombre}</p>
                    <p className="text-xs text-text-muted mt-0.5">{resort.estado_usa}</p>
                  </div>
                  <ChevronRight size={15} className="text-text-muted" />
                </button>
              ))
            ) : (
              <p className="text-xs text-text-muted">No encontramos montañas con esa búsqueda.</p>
            )}
          </div>
        )}

        {isSavingResort && (
          <p className="text-xs text-accent mt-3 inline-flex items-center gap-1.5">
            <Loader2 size={12} className="animate-spin" /> Guardando tu montaña y entrando al chat...
          </p>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} currentUserId={userId} />
          ))
        ) : (
          <div className="text-center py-16 text-text-secondary">
            <p className="mb-2">{t('feed_empty')}</p>
            <Link href="/new-post" className="text-accent hover:underline text-sm">
              {t('feed_be_first')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
