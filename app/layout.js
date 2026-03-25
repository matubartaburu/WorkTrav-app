import './globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'

export const metadata = {
  title: 'WorkTrav — Work & Travel Community',
  description: 'Conectá con estudiantes que hacen Work & Travel en USA. Reviews de resorts, empresas y trabajos.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-background text-text-primary min-h-screen">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
