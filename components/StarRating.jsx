export function StarDisplay({ rating, size = 'sm' }) {
  const full = Math.round(rating || 0)
  const cls = size === 'lg' ? 'text-2xl' : 'text-sm'
  return (
    <span className="inline-flex gap-px">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`${cls} ${i <= full ? 'text-yellow-400' : 'text-border'}`}>★</span>
      ))}
    </span>
  )
}

export function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`text-3xl transition-colors ${i <= value ? 'text-yellow-400' : 'text-border hover:text-yellow-400/50'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
