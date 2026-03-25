'use client'

import { COUNTRIES } from '@/lib/countries'

// Duplicamos la lista para el loop infinito
const FLAGS = [...COUNTRIES, ...COUNTRIES].filter(c => c.code !== 'OT')

export default function FlagsMarquee() {
  return (
    <div className="w-full overflow-hidden py-4 select-none">
      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {FLAGS.map((c, i) => (
          <div
            key={`${c.code}-${i}`}
            className="inline-flex flex-col items-center gap-1 group"
          >
            <span
              className="text-3xl transition-transform duration-200 group-hover:scale-125 group-hover:-translate-y-1 cursor-default"
              title={c.es}
            >
              {c.flag}
            </span>
            <span className="text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {c.es}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
