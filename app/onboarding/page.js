'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { COUNTRIES_BY_LANG } from '@/lib/i18n'
import WorkTravLogo from '@/components/WorkTravLogo'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const TOTAL_STEPS = 3

export default function OnboardingPage() {
  const router = useRouter()
  const { t, lang } = useLanguage()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ pais: '', edad: '', temporadas: null })
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: prof } = await supabase
        .from('users').select('*').eq('id', user.id).single()

      if (prof?.onboarding_completado) { router.push('/feed'); return }

      setProfile(prof)
      // Pre-llenar país si ya lo tenía (ej: registro por email)
      if (prof?.pais) setForm(f => ({ ...f, pais: prof.pais }))
      setLoading(false)
    }
    init()
  }, [router])

  const handleFinish = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('users').update({
      pais: form.pais,
      edad: form.edad ? parseInt(form.edad) : null,
      temporadas_hechas: form.temporadas ?? 0,
      onboarding_completado: true,
    }).eq('id', user.id)
    router.push('/feed')
  }

  const handleSkip = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('users').update({ onboarding_completado: true }).eq('id', user.id)
    router.push('/feed')
  }

  const canNext = () => {
    if (step === 1) return !!form.pais
    if (step === 2) return !!form.edad && parseInt(form.edad) >= 16 && parseInt(form.edad) <= 99
    if (step === 3) return form.temporadas !== null
    return false
  }

  const countries = COUNTRIES_BY_LANG[lang] ?? COUNTRIES_BY_LANG['es']

  const seasons = [
    { value: 0, label: t('onboarding_seasons_0') },
    { value: 1, label: t('onboarding_seasons_1') },
    { value: 2, label: t('onboarding_seasons_2') },
    { value: 3, label: t('onboarding_seasons_3') },
  ]

  if (loading) return null

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      {/* Header */}
      <div className="w-full max-w-sm mb-6 flex items-center justify-between">
        <WorkTravLogo size="md" />
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm">
        {/* Barra de progreso */}
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-accent' : 'bg-border'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-text-muted mb-6">
          {t('onboarding_step')} {step} {t('onboarding_of')} {TOTAL_STEPS}
        </p>

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

        {/* Card del paso */}
        <div className="bg-card border border-border rounded-2xl p-6">
          {step === 1 && (
            <div>
              <h1 className="text-lg font-semibold mb-1">{t('onboarding_welcome')}</h1>
              <p className="text-text-secondary text-sm mb-5">{t('onboarding_subtitle')}</p>
              <h2 className="text-sm font-medium text-text-secondary mb-3">{t('onboarding_country_title')}</h2>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {countries.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, pais: c })}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-colors text-left ${
                      form.pais === c
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border hover:border-text-muted text-text-primary'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-6">{t('onboarding_age_title')}</h2>
              <input
                type="number"
                min={16}
                max={99}
                value={form.edad}
                onChange={(e) => setForm({ ...form, edad: e.target.value })}
                placeholder={t('onboarding_age_placeholder')}
                className="w-full bg-surface border border-border rounded-xl px-4 py-5 text-3xl text-center font-bold text-text-primary focus:outline-none focus:border-accent transition-colors"
                autoFocus
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-5">{t('onboarding_seasons_title')}</h2>
              <div className="space-y-2">
                {seasons.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setForm({ ...form, temporadas: value })}
                    className={`w-full py-4 px-5 rounded-xl text-sm font-medium border transition-colors text-left ${
                      form.temporadas === value
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border hover:border-text-muted text-text-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="mt-4 space-y-2">
          <button
            onClick={() => {
              if (step < TOTAL_STEPS) setStep(step + 1)
              else handleFinish()
            }}
            disabled={!canNext() || saving}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium text-sm transition-colors"
          >
            {step === TOTAL_STEPS ? t('onboarding_finish') : t('onboarding_next')}
          </button>

          <button
            onClick={handleSkip}
            disabled={saving}
            className="w-full text-text-muted hover:text-text-secondary py-2 text-sm transition-colors"
          >
            {t('onboarding_skip')}
          </button>
        </div>
      </div>
    </div>
  )
}
