import Link from 'next/link'
import { Mountain, Star, Users, Map } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mountain className="text-accent" size={24} />
          <span className="font-semibold text-lg tracking-tight">SnowRoute</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="bg-accent hover:bg-accent-hover text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-3xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 text-sm text-text-secondary mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          Comunidad W&T hispanohablante
        </div>

        <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
          Tu próxima temporada,{' '}
          <span className="text-accent">compartida</span>
        </h1>
        <p className="text-text-secondary text-xl mb-10 leading-relaxed">
          Conectá con estudiantes que hacen Work & Travel en USA.
          Reviews reales de resorts, empresas organizadoras y trabajos.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/register"
            className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Empezar gratis
          </Link>
          <Link
            href="/login"
            className="border border-border text-text-primary hover:border-text-secondary px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Ver la comunidad
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <Star className="text-accent mb-4" size={24} />
            <h3 className="font-semibold mb-2">Reviews honestas</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Lee y escribí reviews reales de empresas, trabajos y resorts de otros estudiantes.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <Users className="text-accent mb-4" size={24} />
            <h3 className="font-semibold mb-2">Conectá con tu resort</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Encontrá quién va a tu mismo resort esta temporada antes de llegar.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <Map className="text-accent mb-4" size={24} />
            <h3 className="font-semibold mb-2">Mapa interactivo</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Explorá todos los resorts de USA con info, fotos y reviews de la comunidad.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center text-text-muted text-sm">
        SnowRoute © 2025 — Hecho para la comunidad W&T
      </footer>
    </main>
  )
}
