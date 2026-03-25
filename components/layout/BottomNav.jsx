'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, PlusCircle, Map, User } from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { href: '/feed', icon: Home, label: 'Inicio' },
  { href: '/resorts', icon: Compass, label: 'Resorts' },
  { href: '/new-post', icon: PlusCircle, label: 'Publicar' },
  { href: '/profile', icon: User, label: 'Perfil' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors',
                isActive ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <Icon size={22} />
              <span className="text-xs">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
