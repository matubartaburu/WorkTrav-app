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
  const [hasResortColumn, setHasResortColumn] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { error: resortColumnError } = await supabase
        .from('users')
        .select('resort_id')
        .limit(1)

      const resortColumnAvailable = !resortColumnError
      setHasResortColumn(resortColumnAvailable)

      const [{ data: profile }, { data: resortList }, { data: companyList }] = await Promise.all([
        supabase
          .from('users')
          .select(`empresa_nombre, onboarding_completado${resortColumnAvailable ? ', resort_id' : ''}`)
          .eq('id', user.id)
          .single(),
        supabase.from('resorts').select('id, nombre, estado_usa').order('nombre'),
        supabase.from('companies').select('nombre').order('nombre'),
      ])

      if (profile) {
        setForm({
          empresa_nombre: profile.empresa_nombre || '',
          resort_id: resortColumnAvailable ? (profile.resort_id || '') : '',
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

    const shouldCompleteOnboarding = (hasResortColumn ? !!form.resort_id : true) && !!form.empresa_nombre.trim()
    const payload = {
      empresa_nombre: form.empresa_nombre.trim(),
      onboarding_completado: shouldCompleteOnboarding,
    }
    if (hasResortColumn) payload.resort_id = form.resort_id || null

    const { error: updateError } = await supabase
      .from('users')
      .update(payload)
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

  const isCompleted = (hasResortColumn ? !!form.resort_id : true) && !!form.empresa_nombre.trim()

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
        {hasResortColumn ? (
        <div>
          <label className="text-sm text-text-secondary mb-1.5 block">{t('profile_edit_resort')}</label>
          <select
            value={form.resort_id}
            onChange={e => setForm({ ...form, resort_id: e.target.value })}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">{t('profile_edit_resort_none')}</option>
            {resorts.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}, {r.estado_usa}</option>
            ))}
          </select>
        </div>
        ) : (
        <div className="text-xs text-yellow-300 bg-yellow-300/10 border border-yellow-300/20 rounded-lg px-3 py-2">
          {t('db_missing_resort_column')}
        </div>
        )}

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
