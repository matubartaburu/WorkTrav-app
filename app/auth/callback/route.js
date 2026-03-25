import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/feed'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Crear perfil solo si es la primera vez
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!existingUser) {
        const meta = data.user.user_metadata ?? {}

        // Apple puede ocultar el email real y devolver un relay address
        const email = data.user.email ?? meta.email ?? ''

        // Apple solo devuelve el nombre la primera vez que el usuario autoriza
        const nombre =
          meta.full_name ||
          (meta.name ? meta.name : null) ||
          (meta.given_name
            ? `${meta.given_name}${meta.family_name ? ' ' + meta.family_name : ''}`
            : null) ||
          email.split('@')[0] ||
          'Usuario'

        await supabase.from('users').insert({
          id: data.user.id,
          email,
          nombre,
          avatar_url: meta.avatar_url || meta.picture || null,
          pais: '',
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
