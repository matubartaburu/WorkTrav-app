'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, MessageCircle, MapPin, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import PostCard from '@/components/feed/PostCard'
import { getResortInfo } from '@/lib/resorts-data'

export default function FeedPage() {
  const { t, lang } = useLanguage()
  const [posts, setPosts] = useState([])
  const [userId, setUserId] = useState(null)
  const [myResort, setMyResort] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      const [{ data: postsData }, { data: profile }] = await Promise.all([
        supabase
          .from('posts')
          .select('*, users(nombre, pais), resorts(nombre, estado_usa)')
          .order('created_at', { ascending: false })
          .limit(20),
        user
          ? supabase.from('users').select('resort_id, resorts(id, nombre, estado_usa)').eq('id', user.id).single()
          : Promise.resolve({ data: null }),
      ])

      setPosts(postsData || [])
      if (profile?.resorts) setMyResort(profile.resorts)
    }
    fetchData()
  }, [])

  const info = myResort ? getResortInfo(myResort.nombre, lang) : null

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
          className="flex items-center justify-between bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6 hover:border-accent/60 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{info?.emoji || '⛷️'}</span>
            <div>
              <p className="text-xs text-accent font-medium uppercase tracking-widest mb-0.5">Tu montaña</p>
              <p className="font-semibold text-text-primary">{myResort.nombre}</p>
              <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                <MapPin size={10} /> {myResort.estado_usa}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent">
            <MessageCircle size={18} />
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      ) : (
        <Link
          href="/profile/edit"
          className="flex items-center justify-between bg-card border border-dashed border-border rounded-xl p-4 mb-6 hover:border-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⛷️</span>
            <div>
              <p className="text-sm font-medium text-text-primary">¿A qué montaña vas?</p>
              <p className="text-xs text-text-muted mt-0.5">Elegí tu resort para ver su comunidad</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-text-muted" />
        </Link>
      )}

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
