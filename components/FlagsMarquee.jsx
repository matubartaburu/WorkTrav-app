'use client'

import { COUNTRIES } from '@/lib/countries'

const FLAGS = COUNTRIES.filter(c => c.code !== 'OT')

export default function FlagsMarquee() {
  // Duplicamos para el loop infinito
  const items = [...FLAGS, ...FLAGS]

  return (
    <div style={{ overflow: 'hidden', padding: '1rem 0' }}>
      <div className="marquee-track">
        {items.map((c, i) => (
          <div
            key={`${c.code}-${i}`}
            style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default' }}
            title={c.es}
          >
            <span style={{ fontSize: '2rem', lineHeight: 1, transition: 'transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.4) translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)' }}
            >
              {c.flag}
            </span>
            <span style={{ fontSize: '10px', color: '#555', opacity: 0.8 }}>{c.es}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
