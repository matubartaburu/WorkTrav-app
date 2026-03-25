'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const COUNTRIES = ['Argentina', 'España', 'México', 'Brasil', 'Colombia', 'Chile', 'Uruguay', 'Perú', 'Otro']

export default function EditProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', pais: '', universidad: '', bio: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('users')
        .select('nombre, pais, universidad, bio')
        .eq('id', user.id)
        .single()

      if (profile) {
        setForm({
          nombre: profile.nombre || '',
          pais: profile.pais || '',
          universidad: profile.universidad || '',
          bio: profile.bio || '',
        })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [router])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

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
        universidad: form.universidad.trim(),
        bio: form.bio.trim(),
      })
      .eq('id', user.id)

    if (updateError) {
      setError('Error al guardar. Intentá de nuevo.')
      setSaving(false)
      return
    }

    setSuccess(true)
    setSaving(false)
    setTimeout(() => router.push('/profile'), 800)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-text-secondary text-sm">
        Cargando perfil...
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold">Editar perfil</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">País</label>
          <select
            name="pais"
            value={form.pais}
            onChange={handleChange}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Sin especificar</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">Universidad</label>
          <input
            name="universidad"
            value={form.universidad}
            onChange={handleChange}
            placeholder="Ej: UBA, UNLP..."
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 160) })}
            placeholder="Contá algo sobre vos..."
            rows={3}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
          />
          <p className="text-xs text-text-muted text-right mt-1">{form.bio.length}/160</p>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-3">
            Perfil actualizado
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium text-sm transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
