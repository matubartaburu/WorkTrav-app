'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import PostCard from '@/components/feed/PostCard'

export default function FeedPage() {
  const { t } = useLanguage()
  const [posts, setPosts] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      const { data } = await supabase
        .from('posts')
        .select('*, users(nombre, pais), resorts(nombre, estado_usa)')
        .order('created_at', { ascending: false })
        .limit(20)
      setPosts(data || [])
    }
    fetchData()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{t('feed_title')}</h1>
        <Link
          href="/new-post"
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle size={16} />
          <span className="hidden sm:block">{t('feed_new')}</span>
        </Link>
      </div>

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
