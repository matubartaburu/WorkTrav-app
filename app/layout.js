import './globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import SnowEffect from '@/components/SnowEffect'

export const metadata = {
  title: 'WorkTrav — Work & Travel Community',
  description: 'Conectá con estudiantes que hacen Work & Travel en USA. Reviews de resorts, empresas y trabajos.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-background text-text-primary min-h-screen">
        <SnowEffect />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
