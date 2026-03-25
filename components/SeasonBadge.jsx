const BADGE_CONFIG = {
  0: null,
  1: { label: '1x',  bg: 'bg-blue-500/15',   border: 'border-blue-500/30',   text: 'text-blue-400',  icon: '⛷️' },
  2: { label: '2x',  bg: 'bg-purple-500/15',  border: 'border-purple-500/30', text: 'text-purple-400', icon: '🏔️' },
  3: { label: '3x+', bg: 'bg-amber-500/15',   border: 'border-amber-500/30',  text: 'text-amber-400', icon: '🏆' },
}

export default function SeasonBadge({ temporadas = 0, size = 'md' }) {
  const count = temporadas >= 3 ? 3 : temporadas
  const cfg = BADGE_CONFIG[count]
  if (!cfg) return null

  const sizeClass = size === 'sm'
    ? 'text-xs px-2 py-0.5 gap-1'
    : 'text-sm px-3 py-1 gap-1.5'

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${cfg.bg} ${cfg.border} ${cfg.text} ${sizeClass}`}>
      <span>{cfg.icon}</span>
      <span>{cfg.label} W&T</span>
    </span>
  )
}
