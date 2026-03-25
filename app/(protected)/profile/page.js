'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const FLAG_MAP = {
  'Argentina': '🇦🇷', 'España': '🇪🇸', 'México': '🇲🇽',
  'Brasil': '🇧🇷', 'Brazil': '🇧🇷', 'Colombia': '🇨🇴',
  'Chile': '🇨🇱', 'Uruguay': '🇺🇾', 'Perú': '🇵🇪', 'Peru': '🇵🇪',
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: prof }, { data: userPosts }] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('posts').select('*, resorts(nombre, estado_usa)')
          .eq('user_id', user.id).order('created_at', { ascending: false }),
      ])

      setProfile(prof)
      setPosts(userPosts || [])
    }
    fetchData()
  }, [router])

  if (!profile) {
    return <div className="text-center py-20 text-text-secondary text-sm">Cargando...</div>
  }

  return (
    <div>
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-xl font-bold text-accent">
              {profile.nombre?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="font-semibold text-lg">{profile.nombre}</h1>
              <p className="text-text-secondary text-sm">
                {FLAG_MAP[profile.pais] || '🌎'} {profile.pais}
              </p>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="text-sm border border-border hover:border-text-secondary px-4 py-2 rounded-lg transition-colors"
          >
            {t('profile_edit')}
          </Link>
        </div>

        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-semibold">{posts.length}</span>
            <span className="text-text-secondary ml-1">{t('profile_posts')}</span>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-medium text-text-secondary mb-4 uppercase tracking-wide">
        {t('profile_my_experiences')}
      </h2>

      <div className="space-y-3">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-card border border-border rounded-xl p-4">
              {post.resorts && (
                <div className="flex items-center gap-1 text-xs text-text-secondary mb-2">
                  <MapPin size={11} />
                  {post.resorts.nombre}, {post.resorts.estado_usa}
                </div>
              )}
              <p className="text-sm leading-relaxed">{post.contenido}</p>
            </div>
          ))
        ) : (
          <p className="text-text-secondary text-sm text-center py-8">
            {t('profile_no_posts')}{' '}
            <Link href="/new-post" className="text-accent hover:underline">
              {t('profile_share')}
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
