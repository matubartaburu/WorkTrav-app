'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Building2, Mountain } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { getFlagByName, getLocalizedName } from '@/lib/countries'
import SeasonBadge from '@/components/SeasonBadge'

export default function ProfilePage() {
  const { t, lang } = useLanguage()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [resortsVisitados, setResortsVisitados] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: prof }, { data: userPosts }] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('posts')
          .select('*, resorts(id, nombre, estado_usa)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ])

      setProfile(prof)
      setPosts(userPosts || [])

      // Resorts únicos visitados (donde publicaron)
      const unique = {}
      for (const post of userPosts || []) {
        if (post.resorts?.id && !unique[post.resorts.id]) {
          unique[post.resorts.id] = post.resorts
        }
      }
      setResortsVisitados(Object.values(unique))
    }
    fetchData()
  }, [router])

  if (!profile) {
    return <div className="text-center py-20 text-text-secondary text-sm">Cargando...</div>
  }

  const flag = getFlagByName(profile.pais)
  const paisLocalizado = getLocalizedName(profile.pais, lang)

  return (
    <div>
      {/* Card de perfil */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-5">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.nombre}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
                {profile.nombre?.charAt(0).toUpperCase() || '?'}
              </div>
            )}

            <div>
              <h1 className="font-bold text-lg leading-tight">{profile.nombre}</h1>
              <div className="flex items-center gap-1.5 text-sm text-text-secondary mt-0.5">
                <span className="text-base">{flag}</span>
                <span>{paisLocalizado}</span>
                {profile.edad && (
                  <>
                    <span className="text-text-muted">·</span>
                    <span>{profile.edad} años</span>
                  </>
                )}
              </div>
              {/* Badge de temporadas */}
              {profile.temporadas_hechas > 0 && (
                <div className="mt-2">
                  <SeasonBadge temporadas={profile.temporadas_hechas} size="sm" />
                </div>
              )}
            </div>
          </div>

          <Link
            href="/profile/edit"
            className="text-sm border border-border hover:border-text-secondary px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            {t('profile_edit')}
          </Link>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-text-secondary leading-relaxed mb-4">{profile.bio}</p>
        )}

        {/* Empresa */}
        {profile.empresa_nombre && (
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
            <Building2 size={14} className="text-text-muted" />
            <span>{profile.empresa_nombre}</span>
          </div>
        )}

        {/* Montañas visitadas */}
        {resortsVisitados.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-xs text-text-muted uppercase tracking-wide mb-2">
              <Mountain size={11} />
              <span>Montañas visitadas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {resortsVisitados.map(r => (
                <span key={r.id} className="inline-flex items-center gap-1 bg-surface border border-border rounded-full px-3 py-1 text-xs text-text-secondary">
                  <MapPin size={10} />
                  {r.nombre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-5 text-sm pt-3 border-t border-border">
          <div>
            <span className="font-semibold text-text-primary">{posts.length}</span>
            <span className="text-text-secondary ml-1">{t('profile_posts')}</span>
          </div>
          <div>
            <span className="font-semibold text-text-primary">{resortsVisitados.length}</span>
            <span className="text-text-secondary ml-1">resorts</span>
          </div>
          {profile.temporadas_hechas > 0 && (
            <div>
              <span className="font-semibold text-text-primary">{profile.temporadas_hechas >= 3 ? '3+' : profile.temporadas_hechas}</span>
              <span className="text-text-secondary ml-1">temporadas</span>
            </div>
          )}
        </div>
      </div>

      {/* Posts */}
      <h2 className="text-xs font-medium text-text-muted mb-3 uppercase tracking-widest">
        {t('profile_my_experiences')}
      </h2>

      <div className="space-y-3">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-card border border-border rounded-xl p-4">
              {post.resorts && (
                <div className="flex items-center gap-1 text-xs text-text-muted mb-2">
                  <MapPin size={11} />
                  {post.resorts.nombre}, {post.resorts.estado_usa}
                </div>
              )}
              <p className="text-sm leading-relaxed">{post.contenido}</p>
            </div>
          ))
        ) : (
          <p className="text-text-secondary text-sm text-center py-10">
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
