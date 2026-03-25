'use client'

import Link from 'next/link'
import { Star, Users, Map } from 'lucide-react'
import WorkTravLogo from '@/components/WorkTravLogo'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/LanguageContext'

export default function Home() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <WorkTravLogo size="md" />
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            {t('login_title')}
          </Link>
          <Link
            href="/register"
            className="bg-accent hover:bg-accent-hover text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {t('hero_cta')}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 text-sm text-text-secondary mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          {t('community_badge')}
        </div>

        <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
          {t('hero_title')}{' '}
          <span className="text-accent">{t('hero_title_highlight')}</span>
        </h1>
        <p className="text-text-secondary text-xl mb-10 leading-relaxed">
          {t('hero_subtitle')}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/register"
            className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {t('hero_cta')}
          </Link>
          <Link
            href="/login"
            className="border border-border text-text-primary hover:border-text-secondary px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {t('hero_secondary')}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <Star className="text-accent mb-4" size={24} />
            <h3 className="font-semibold mb-2">{t('feature_reviews_title')}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{t('feature_reviews_desc')}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <Users className="text-accent mb-4" size={24} />
            <h3 className="font-semibold mb-2">{t('feature_connect_title')}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{t('feature_connect_desc')}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <Map className="text-accent mb-4" size={24} />
            <h3 className="font-semibold mb-2">{t('feature_map_title')}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{t('feature_map_desc')}</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-6 text-center text-text-muted text-sm">
        {t('footer')}
      </footer>
    </main>
  )
}
