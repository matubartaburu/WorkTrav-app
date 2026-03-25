import { createClient } from '@/lib/supabase-server'
import PostCard from '@/components/feed/PostCard'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

export default async function FeedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      users (nombre, pais),
      resorts (nombre, estado_usa)
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Feed</h1>
        <Link
          href="/new-post"
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle size={16} />
          <span className="hidden sm:block">Nueva experiencia</span>
        </Link>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} currentUserId={user?.id} />
          ))
        ) : (
          <div className="text-center py-16 text-text-secondary">
            <p className="mb-2">Todavía no hay experiencias.</p>
            <Link href="/new-post" className="text-accent hover:underline text-sm">
              ¡Sé el primero en compartir!
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
