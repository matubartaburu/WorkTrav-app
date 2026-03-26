'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import WorkTravLogo from '@/components/WorkTravLogo'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function OnboardingPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [form, setForm] = useState({ resort_id: '', empresa_nombre: '' })
  const [profile, setProfile] = useState(null)
  const [resorts, setResorts] = useState([])
  const [companies, setCompanies] = useState([])
  const [resortSearch, setResortSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: prof }, { data: resortList }, { data: companyList }] = await Promise.all([
        supabase
          .from('users')
          .select('id, email, nombre, avatar_url, resort_id, empresa_nombre, onboarding_completado')
          .eq('id', user.id)
          .single(),
        supabase.from('resorts').select('id, nombre, estado_usa').order('nombre'),
        supabase.from('companies').select('nombre').order('nombre'),
      ])

      if (prof?.resort_id && prof?.empresa_nombre) {
        router.push('/feed')
        return
      }

      setProfile(prof)
      setResorts(resortList || [])
      setCompanies(companyList || [])
      setForm({
        resort_id: prof?.resort_id || '',
        empresa_nombre: prof?.empresa_nombre || '',
      })
      setLoading(false)
    }
    init()
  }, [router])

  const handleFinish = async () => {
    if (!form.resort_id || !form.empresa_nombre.trim()) return

    setSaving(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { error: updateError } = await supabase.from('users').update({
      resort_id: form.resort_id,
      empresa_nombre: form.empresa_nombre.trim(),
      onboarding_completado: true,
    }).eq('id', user.id)

    if (updateError) {
      setError(updateError.message || t('error_generic'))
      setSaving(false)
      return
    }

    router.push('/feed')
  }

  const filteredResorts = resorts.filter((resort) => {
    const q = resortSearch.trim().toLowerCase()
    if (!q) return true
    return resort.nombre.toLowerCase().includes(q) || resort.estado_usa.toLowerCase().includes(q)
  })

  if (loading) return null

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      {/* Header */}
      <div className="w-full max-w-sm mb-6 flex items-center justify-between">
        <WorkTravLogo size="md" />
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm">
        {/* Avatar y nombre de Google */}
        {profile && (
          <div className="flex items-center gap-3 mb-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.nombre}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                {profile.nombre?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
            <div>
              <p className="text-sm font-medium">{profile.nombre}</p>
              <p className="text-xs text-text-muted">{profile.email}</p>
            </div>
          </div>
        )}

        {/* Card del formulario */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h1 className="text-lg font-semibold mb-1">{t('onboarding_required_title')}</h1>
          <p className="text-text-secondary text-sm mb-5">{t('onboarding_required_subtitle')}</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary mb-1.5 block">{t('onboarding_resort')}</label>
              <input
                value={resortSearch}
                onChange={(e) => setResortSearch(e.target.value)}
                placeholder={t('onboarding_resort_search_placeholder')}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors mb-2"
              />
              <select
                value={form.resort_id}
                onChange={(e) => setForm({ ...form, resort_id: e.target.value })}
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">{t('onboarding_resort_none')}</option>
                {filteredResorts.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}, {r.estado_usa}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-text-secondary mb-1.5 block">{t('onboarding_company')}</label>
              <select
                value={form.empresa_nombre}
                onChange={(e) => setForm({ ...form, empresa_nombre: e.target.value })}
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">{t('onboarding_company_none')}</option>
                {companies.map((company) => (
                  <option key={company.nombre} value={company.nombre}>{company.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 mt-4">{error}</p>
          )}
        </div>

        {/* Botones */}
        <div className="mt-4">
          <button
            onClick={handleFinish}
            disabled={!form.resort_id || !form.empresa_nombre.trim() || saving}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium text-sm transition-colors"
          >
            {t('onboarding_complete_profile')}
          </button>
        </div>
      </div>
    </div>
  )
}
