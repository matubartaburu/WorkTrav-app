'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { getResortInfo } from '@/lib/resorts-data'
import { useLanguage } from '@/lib/LanguageContext'

const USA_TOPO_JSON = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

function spreadNearbyResorts(resorts) {
  const grouped = resorts.reduce((acc, resort) => {
    if (resort.latitud == null || resort.longitud == null) return acc

    const lat = Number(resort.latitud)
    const lon = Number(resort.longitud)

    if (Number.isNaN(lat) || Number.isNaN(lon)) return acc

    const key = `${Math.round(lat * 2) / 2}_${Math.round(lon * 2) / 2}`
    if (!acc[key]) acc[key] = []
    acc[key].push({ ...resort, lat, lon })
    return acc
  }, {})

  return Object.values(grouped).flatMap((group) => {
    if (group.length === 1) {
      const item = group[0]
      return [{ ...item, markerLat: item.lat, markerLon: item.lon }]
    }

    const radius = 0.42

    return group.map((item, index) => {
      const angle = (index / group.length) * Math.PI * 2
      const markerLat = item.lat + Math.sin(angle) * radius
      const markerLon = item.lon + Math.cos(angle) * radius

      return { ...item, markerLat, markerLon }
    })
  })
}

export default function ResortsUsaMap({ resorts, lang }) {
  const router = useRouter()
  const { t } = useLanguage()
  const mapRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [popupPos, setPopupPos] = useState({ x: 16, y: 16 })

  const mappedResorts = useMemo(() => spreadNearbyResorts(resorts), [resorts])

  const handleMarkerClick = (event, resort, info) => {
    event.stopPropagation()

    const mapRect = mapRef.current?.getBoundingClientRect()
    if (!mapRect) {
      setSelected({ resort, info })
      return
    }

    const relativeX = event.clientX - mapRect.left
    const relativeY = event.clientY - mapRect.top
    const popupWidth = mapRect.width >= 768 ? 340 : 280
    const popupHeight = mapRect.width >= 768 ? 210 : 230

    const left = Math.max(12, Math.min(relativeX - (popupWidth / 2), mapRect.width - popupWidth - 12))
    const top = Math.max(12, Math.min(relativeY - popupHeight - 14, mapRect.height - popupHeight - 12))

    setPopupPos({ x: left, y: top })
    setSelected({ resort, info })
  }

  return (
    <div className="bg-card border border-border rounded-xl p-3 md:p-4 mb-6">
      <div
        ref={mapRef}
        onClick={() => setSelected(null)}
        className="relative rounded-lg overflow-hidden border border-border/80 bg-surface"
      >
        <ComposableMap
          width={980}
          height={500}
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1150, translate: [490, 250] }}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={USA_TOPO_JSON}>
            {({ geographies }) => geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="var(--surface)"
                stroke="var(--border)"
                strokeWidth={0.6}
              />
            ))}
          </Geographies>

          {mappedResorts.map((resort) => {
            const info = getResortInfo(resort.nombre, lang)
            const emoji = info?.emoji || '⛷️'
            const isActive = selected?.resort?.id === resort.id

            return (
              <Marker
                key={resort.id}
                coordinates={[resort.markerLon, resort.markerLat]}
                onClick={(event) => handleMarkerClick(event, resort, info)}
                style={{ default: { cursor: 'pointer' }, hover: { cursor: 'pointer' }, pressed: { cursor: 'pointer' } }}
              >
                <title>{resort.nombre}</title>
                <circle r={isActive ? 17 : 14} fill="var(--card)" stroke="var(--accent)" strokeWidth={2} opacity={0.98} />
                <text textAnchor="middle" y="5" fontSize={14}>
                  {emoji}
                </text>
              </Marker>
            )
          })}
        </ComposableMap>

        {selected && (
          <div
            className="absolute z-10 w-[280px] md:w-[340px] bg-card border border-border rounded-xl p-3 md:p-4 shadow-lg"
            style={{ left: `${popupPos.x}px`, top: `${popupPos.y}px` }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t('resorts_map_popup_close')}
              onClick={() => setSelected(null)}
              className="absolute right-2 top-1 text-text-secondary hover:text-text-primary text-lg leading-none"
            >
              ×
            </button>

            <div className="pr-6">
              <p className="text-lg font-semibold text-text-primary">{selected.resort.nombre}</p>
              <p className="text-sm text-text-secondary mb-3">{selected.resort.estado_usa}</p>
            </div>

            {selected.info && (
              <>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{selected.info.vibe}</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-surface border border-border rounded-lg p-2">
                    <p className="text-[11px] text-text-muted">{t('resort_season')}</p>
                    <p className="text-xs font-medium text-text-primary">{selected.info.temporada}</p>
                  </div>
                  <div className="bg-surface border border-border rounded-lg p-2">
                    <p className="text-[11px] text-text-muted">{t('resort_salary')}</p>
                    <p className="text-xs font-medium text-text-primary">{selected.info.salario}</p>
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => router.push(`/resorts/${selected.resort.id}`)}
              className="w-full bg-accent hover:bg-accent-hover text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
            >
              {t('resorts_map_popup_cta')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
