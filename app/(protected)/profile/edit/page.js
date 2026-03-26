'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function EditProfilePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [form, setForm] = useState({ empresa_nombre: '', resort_id: '' })
  const [resorts, setResorts] = useState([])
  const [companies, setCompanies] = useState([])
  const [resortSearch, setResortSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: profile }, { data: resortList }, { data: companyList }] = await Promise.all([
        supabase.from('users').select('empresa_nombre, resort_id, onboarding_completado').eq('id', user.id).single(),
        supabase.from('resorts').select('id, nombre, estado_usa').order('nombre'),
        supabase.from('companies').select('nombre').order('nombre'),
      ])

      if (profile) {
        setForm({
          empresa_nombre: profile.empresa_nombre || '',
          resort_id: profile.resort_id || '',
        })
      }
      setResorts(resortList || [])
      setCompanies(companyList || [])
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

    const shouldCompleteOnboarding = !!form.resort_id && !!form.empresa_nombre.trim()

    const { error: updateError } = await supabase
      .from('users')
      .update({
        empresa_nombre: form.empresa_nombre.trim(),
        resort_id: form.resort_id || null,
        onboarding_completado: shouldCompleteOnboarding,
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message || t('error_generic'))
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

  const filteredResorts = resorts.filter((resort) => {
    const q = resortSearch.trim().toLowerCase()
    if (!q) return true
    return resort.nombre.toLowerCase().includes(q) || resort.estado_usa.toLowerCase().includes(q)
  })
  const isCompleted = !!form.resort_id && !!form.empresa_nombre.trim()

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold">{t('profile_edit_title')}</h1>
      </div>

      <p className="text-sm text-text-secondary mb-5">
        {isCompleted ? t('profile_edit_completed') : t('profile_edit_subtitle')}
      </p>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Mi resort esta temporada */}
        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">{t('profile_edit_resort')}</label>
          <input
            value={resortSearch}
            onChange={e => setResortSearch(e.target.value)}
            placeholder={t('onboarding_resort_search_placeholder')}
            className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors mb-2"
          />
          <select
            value={form.resort_id}
            onChange={e => setForm({ ...form, resort_id: e.target.value })}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">{t('profile_edit_resort_none')}</option>
            {filteredResorts.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}, {r.estado_usa}</option>
            ))}
          </select>
        </div>

        {/* Empresa organizadora */}
        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">{t('profile_edit_company')}</label>
          <select
            value={form.empresa_nombre}
            onChange={e => setForm({ ...form, empresa_nombre: e.target.value })}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">{t('onboarding_company_none')}</option>
            {companies.map((company) => (
              <option key={company.nombre} value={company.nombre}>{company.nombre}</option>
            ))}
          </select>
        </div>

        {!isCompleted && (
          <p className="text-xs text-text-muted">{t('profile_edit_missing_hint')}</p>
        )}

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
