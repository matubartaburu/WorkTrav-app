import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, resorts(nombre, estado_usa)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const FLAG_MAP = {
    'Argentina': '🇦🇷', 'España': '🇪🇸', 'México': '🇲🇽',
    'Brasil': '🇧🇷', 'Colombia': '🇨🇴', 'Chile': '🇨🇱',
    'Uruguay': '🇺🇾', 'Perú': '🇵🇪',
  }

  return (
    <div>
      {/* Profile header */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-xl font-bold text-accent">
              {profile?.nombre?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="font-semibold text-lg">{profile?.nombre}</h1>
              <p className="text-text-secondary text-sm">
                {FLAG_MAP[profile?.pais] || '🌎'} {profile?.pais}
              </p>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="text-sm border border-border hover:border-text-secondary px-4 py-2 rounded-lg transition-colors"
          >
            Editar
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-semibold">{posts?.length || 0}</span>
            <span className="text-text-secondary ml-1">posts</span>
          </div>
        </div>
      </div>

      {/* Posts del usuario */}
      <h2 className="text-sm font-medium text-text-secondary mb-4 uppercase tracking-wide">
        Mis experiencias
      </h2>

      <div className="space-y-3">
        {posts && posts.length > 0 ? (
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
            Todavía no publicaste nada.{' '}
            <Link href="/new-post" className="text-accent hover:underline">
              Compartir experiencia
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
