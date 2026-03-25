'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import CountrySelector from '@/components/CountrySelector'

export default function EditProfilePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [form, setForm] = useState({ nombre: '', pais: '', empresa_nombre: '', bio: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('users')
        .select('nombre, pais, empresa_nombre, bio')
        .eq('id', user.id)
        .single()

      if (profile) {
        setForm({
          nombre: profile.nombre || '',
          pais: profile.pais || '',
          empresa_nombre: profile.empresa_nombre || '',
          bio: profile.bio || '',
        })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [router])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: updateError } = await supabase
      .from('users')
      .update({
        nombre: form.nombre.trim(),
        pais: form.pais,
        empresa_nombre: form.empresa_nombre.trim(),
        bio: form.bio.trim(),
      })
      .eq('id', user.id)

    if (updateError) {
      setError(t('error_generic'))
      setSaving(false)
      return
    }

    setSuccess(true)
    setSaving(false)
    setTimeout(() => router.push('/profile'), 800)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-text-secondary text-sm">Cargando...</div>
  )

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold">{t('profile_edit_title')}</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">{t('profile_name')}</label>
          <input
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            placeholder="Tu nombre"
            required
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* País con selector de banderas */}
        <div>
          <label className="text-sm text-text-secondary mb-2 block">{t('register_country')}</label>
          <CountrySelector value={form.pais} onChange={pais => setForm({ ...form, pais })} />
        </div>

        {/* Empresa organizadora */}
        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">Empresa organizadora</label>
          <input
            value={form.empresa_nombre}
            onChange={e => setForm({ ...form, empresa_nombre: e.target.value })}
            placeholder="Ej: CCUSA, InterExchange, Work & Travel Co..."
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">{t('profile_bio')}</label>
          <textarea
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value.slice(0, 160) })}
            placeholder={t('profile_bio_placeholder')}
            rows={3}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
          />
          <p className="text-xs text-text-muted text-right mt-1">{form.bio.length}/160</p>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-3">{t('profile_saved')}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium text-sm transition-colors"
        >
          {saving ? t('profile_saving') : t('profile_save')}
        </button>
      </form>
    </div>
  )
}
