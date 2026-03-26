'use client'
import { useEffect, useState } from 'react'

export default function SnowEffect() {
  const [flakes, setFlakes] = useState([])

  useEffect(() => {
    setFlakes(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 10,
        size: 2 + Math.random() * 4,
        drift: (Math.random() - 0.5) * 100,
        opacity: 0.4 + Math.random() * 0.6,
      }))
    )
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    >
      {flakes.map(f => (
        <div
          key={f.id}
          className="absolute rounded-full snow-falling"
          style={{
            left: `${f.left}%`,
            top: '-10px',
            width: `${f.size}px`,
            height: `${f.size}px`,
            background: 'rgba(232, 244, 253, 0.85)',
            opacity: 0,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            '--drift': `${f.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
