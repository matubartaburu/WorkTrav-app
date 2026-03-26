'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import WorkTravLogo from '@/components/WorkTravLogo'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/LanguageContext'

export default function Navbar({ user }) {
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
      {/* Logo */}
      <Link href="/feed">
        <WorkTravLogo size="md" />
      </Link>

      {/* Links (desktop) */}
      <div className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
        <Link href="/feed" className="hover:text-text-primary transition-colors">{t('feed')}</Link>
        <Link href="/resorts" className="hover:text-text-primary transition-colors">{t('resorts')}</Link>
        <Link href="/companies" className="hover:text-text-primary transition-colors">{t('companies')}</Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Link
          href="/profile"
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <User size={18} />
          <span className="hidden md:block">{user?.nombre || t('profile')}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="text-text-muted hover:text-text-secondary transition-colors"
          title={t('logout')}
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  )
}
