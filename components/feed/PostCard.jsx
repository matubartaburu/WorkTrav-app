'use client'

import { useEffect, useState } from 'react'
import { Heart, MapPin, UserPlus, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { clsx } from 'clsx'
import { useLanguage } from '@/lib/LanguageContext'

const FLAG_MAP = {
  'Argentina': '🇦🇷',
  'España': '🇪🇸',
  'México': '🇲🇽',
  'Brasil': '🇧🇷',
  'Colombia': '🇨🇴',
  'Chile': '🇨🇱',
  'Uruguay': '🇺🇾',
  'Perú': '🇵🇪',
}

function timeAgo(date) {
  const diff = (new Date() - new Date(date)) / 1000
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

export default function PostCard({ post, currentUserId }) {
  const { t } = useLanguage()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes_count || 0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [canFollow, setCanFollow] = useState(true)

  const isOwnPost = !currentUserId || post.user_id === currentUserId

  useEffect(() => {
    const loadFollowState = async () => {
      if (isOwnPost) return
      const supabase = createClient()

      const { data, error } = await supabase
        .from('user_follows')
        .select('follower_id')
        .eq('follower_id', currentUserId)
        .eq('following_id', post.user_id)
        .maybeSingle()

      if (error) {
        // If table/policy does not exist yet, hide follow action gracefully.
        setCanFollow(false)
        return
      }

      setIsFollowing(!!data)
    }

    loadFollowState()
  }, [currentUserId, post.user_id, isOwnPost])

  const handleLike = async () => {
    const supabase = createClient()
    const newLikes = liked ? likes - 1 : likes + 1
    setLiked(!liked)
    setLikes(newLikes)
    await supabase.from('posts').update({ likes_count: newLikes }).eq('id', post.id)
  }

  const handleToggleFollow = async () => {
    if (isOwnPost || followLoading || !canFollow) return

    setFollowLoading(true)
    const supabase = createClient()

    if (isFollowing) {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', post.user_id)

      if (!error) setIsFollowing(false)
      if (error) setCanFollow(false)
      setFollowLoading(false)
      return
    }

    const { error } = await supabase
      .from('user_follows')
      .insert({ follower_id: currentUserId, following_id: post.user_id })

    if (!error) setIsFollowing(true)
    if (error) setCanFollow(false)
    setFollowLoading(false)
  }

  const flag = FLAG_MAP[post.users?.pais] || '🌎'

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-text-muted transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-sm font-semibold text-accent">
            {post.users?.nombre?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              {post.users?.nombre || 'Usuario'}
              <span className="text-base">{flag}</span>
            </div>
            {post.resorts?.nombre && (
              <div className="flex items-center gap-1 text-xs text-text-secondary">
                <MapPin size={11} />
                {post.resorts.nombre}, {post.resorts.estado_usa}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isOwnPost && canFollow && (
            <button
              onClick={handleToggleFollow}
              disabled={followLoading}
              className={clsx(
                'inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border transition-colors',
                isFollowing
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border text-text-secondary hover:border-accent/50 hover:text-text-primary'
              )}
            >
              {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
              {isFollowing ? t('feed_unfollow') : t('feed_follow')}
            </button>
          )}
          <span className="text-xs text-text-muted">{timeAgo(post.created_at)}</span>
        </div>
      </div>

      {/* Contenido */}
      <p className="text-sm text-text-primary leading-relaxed mb-4">
        {post.contenido}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className={clsx(
            'flex items-center gap-1.5 text-sm transition-colors',
            liked ? 'text-red-400' : 'text-text-muted hover:text-red-400'
          )}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          <span>{likes}</span>
        </button>
      </div>
    </div>
  )
}
