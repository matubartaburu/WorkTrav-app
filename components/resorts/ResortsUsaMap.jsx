'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getResortInfo } from '@/lib/resorts-data'
import { useLanguage } from '@/lib/LanguageContext'

function spreadNearby(resorts) {
  const GRID = 1.2 // grados — resorts dentro de este radio se consideran "vecinos"
  const RADIUS = 0.5 // grados de separación en el círculo

  const groups = {}
  resorts.forEach(r => {
    const key = `${Math.round(r.latitud / GRID)}_${Math.round(r.longitud / GRID)}`
    if (!groups[key]) groups[key] = []
    groups[key].push(r)
  })

  return Object.values(groups).flatMap(group => {
    if (group.length === 1) return [{ ...group[0], mLat: group[0].latitud, mLon: group[0].longitud }]
    return group.map((r, i) => {
      const angle = (i / group.length) * Math.PI * 2 - Math.PI / 2
      return { ...r, mLat: r.latitud + Math.sin(angle) * RADIUS, mLon: r.longitud + Math.cos(angle) * RADIUS }
    })
  })
}

export default function ResortsUsaMap({ resorts, lang }) {
  const router = useRouter()
  const { t } = useLanguage()
  const mapRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (instanceRef.current) return
    if (!mapRef.current) return

    const validResorts = resorts.filter(
      r => r.latitud != null && r.longitud != null
    )
    if (validResorts.length === 0) return

    const spread = spreadNearby(validResorts)

    import('leaflet').then(L => {
      delete L.default.Icon.Default.prototype._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.default.map(mapRef.current, {
        center: [39.5, -98.5],
        zoom: 4,
        scrollWheelZoom: false,
      })

      instanceRef.current = map

      L.default.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map)

      spread.forEach(resort => {
        const info = getResortInfo(resort.nombre, lang)
        const emoji = info?.emoji || '⛷️'

        const icon = L.default.divIcon({
          html: `<div style="background:#1e1e2e;border:2px solid #6366f1;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.5)">${emoji}</div>`,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })

        const popupContent = `
          <div style="min-width:200px;font-family:sans-serif;">
            <p style="font-weight:700;font-size:15px;margin:0 0 2px">${resort.nombre}</p>
            <p style="color:#888;font-size:12px;margin:0 0 8px">${resort.estado_usa}</p>
            ${info ? `
              <p style="font-size:12px;margin:0 0 8px;line-height:1.4">${info.vibe}</p>
              <div style="display:flex;gap:8px;margin-bottom:10px">
                <div style="flex:1;background:#111;border-radius:8px;padding:6px">
                  <p style="font-size:10px;color:#888;margin:0 0 2px">${t('resort_season')}</p>
                  <p style="font-size:11px;font-weight:600;margin:0">${info.temporada}</p>
                </div>
                <div style="flex:1;background:#111;border-radius:8px;padding:6px">
                  <p style="font-size:10px;color:#888;margin:0 0 2px">${t('resort_salary')}</p>
                  <p style="font-size:11px;font-weight:600;color:#4ade80;margin:0">${info.salario}</p>
                </div>
              </div>
            ` : ''}
            <button onclick="window.__wtNav('${resort.id}')" style="width:100%;background:#6366f1;color:white;border:none;border-radius:8px;padding:8px;font-size:13px;font-weight:600;cursor:pointer">${t('resorts_map_popup_cta')}</button>
          </div>
        `

        L.default
          .marker([resort.mLat, resort.mLon], { icon })
          .bindPopup(popupContent, { maxWidth: 260 })
          .addTo(map)
      })

      window.__wtNav = (id) => router.push(`/resorts/${id}`)
    })

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove()
        instanceRef.current = null
      }
      delete window.__wtNav
    }
  }, [resorts, lang])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div className="bg-card border border-border rounded-xl p-3 mb-6">
        <div ref={mapRef} style={{ height: '380px', borderRadius: '8px', overflow: 'hidden' }} />
      </div>
    </>
  )
}
