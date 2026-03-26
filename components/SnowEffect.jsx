'use client'
import { useEffect, useState } from 'react'

export default function SnowEffect() {
  const [flakes, setFlakes] = useState([])

  useEffect(() => {
    setFlakes(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: (i * 3.7 + (i % 5) * 7) % 100,
        delay: (i * 0.6) % 10,
        duration: 9 + (i % 7) * 1.8,
        size: 2 + (i % 3),
        drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 20)),
      }))
    )
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {flakes.map(f => (
        <div
          key={f.id}
          className="absolute rounded-full bg-white snow-falling"
          style={{
            left: `${f.left}%`,
            top: '-8px',
            width: `${f.size}px`,
            height: `${f.size}px`,
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
