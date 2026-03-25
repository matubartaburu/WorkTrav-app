// Logo WorkTrav — basado en el brand kit oficial
// Uso: <WorkTravLogo size="md" /> (sm | md | lg)

export default function WorkTravLogo({ size = 'md', className = '' }) {
  const scales = { sm: 0.7, md: 1, lg: 1.4 }
  const s = scales[size] ?? 1

  const iconSize = Math.round(32 * s)
  const fontBig = Math.round(18 * s)
  const fontSmall = Math.round(7 * s)

  return (
    <span className={`flex items-center gap-2 ${className}`} style={{ userSelect: 'none' }}>
      {/* Icono: círculo con montaña */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wt-brand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#185FA5" />
            <stop offset="100%" stopColor="#1D9E75" />
          </linearGradient>
          <linearGradient id="wt-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1628" />
            <stop offset="100%" stopColor="#0d2a1a" />
          </linearGradient>
          <clipPath id="wt-circle-clip">
            <circle cx="16" cy="16" r="15" />
          </clipPath>
        </defs>
        {/* Fondo */}
        <circle cx="16" cy="16" r="15" fill="url(#wt-bg)" />
        {/* Border gradiente */}
        <circle cx="16" cy="16" r="15" fill="none" stroke="url(#wt-brand)" strokeWidth="1.2" opacity="0.7" />
        {/* Montañas */}
        <g clipPath="url(#wt-circle-clip)">
          <polygon points="2,28 11,13 20,28" fill="#185FA5" opacity="0.75" />
          <polygon points="8,28 16,10 24,28" fill="#0C447C" opacity="0.9" />
          <polygon points="15,28 22,16 29,28" fill="#042C53" opacity="0.95" />
          {/* Nieve */}
          <polygon points="14,11.5 16,10 18,11.5 16,10.8" fill="white" opacity="0.9" />
          {/* Luna */}
          <circle cx="25" cy="14" r="3.5" fill="#ffd700" opacity="0.8" />
          <circle cx="26.2" cy="13" r="2.5" fill="#0a1628" opacity="0.9" />
        </g>
      </svg>

      {/* Wordmark */}
      <svg
        width={Math.round(74 * s)}
        height={Math.round(22 * s)}
        viewBox="0 0 74 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="WorkTrav"
      >
        <defs>
          <linearGradient id="wt-text-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#185FA5" />
            <stop offset="100%" stopColor="#1D9E75" />
          </linearGradient>
        </defs>
        {/* "Work" bold blanco */}
        <text
          x="0"
          y="16"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="16"
          fontWeight="800"
          fill="white"
          letterSpacing="-0.5"
        >
          Work
        </text>
        {/* "Trav" thin gradiente */}
        <text
          x="40"
          y="16"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="16"
          fontWeight="200"
          fill="url(#wt-text-grad)"
          letterSpacing="-0.3"
        >
          Trav
        </text>
      </svg>
    </span>
  )
}
