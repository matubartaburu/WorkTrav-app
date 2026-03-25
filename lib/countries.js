// Lista canónica de países — nombre guardado en español en la DB
export const COUNTRIES = [
  { code: 'AR', flag: '🇦🇷', es: 'Argentina',   pt: 'Argentina',  en: 'Argentina'  },
  { code: 'UY', flag: '🇺🇾', es: 'Uruguay',     pt: 'Uruguai',    en: 'Uruguay'    },
  { code: 'BR', flag: '🇧🇷', es: 'Brasil',      pt: 'Brasil',     en: 'Brazil'     },
  { code: 'CL', flag: '🇨🇱', es: 'Chile',       pt: 'Chile',      en: 'Chile'      },
  { code: 'CO', flag: '🇨🇴', es: 'Colombia',    pt: 'Colômbia',   en: 'Colombia'   },
  { code: 'MX', flag: '🇲🇽', es: 'México',      pt: 'México',     en: 'Mexico'     },
  { code: 'PE', flag: '🇵🇪', es: 'Perú',        pt: 'Peru',       en: 'Peru'       },
  { code: 'EC', flag: '🇪🇨', es: 'Ecuador',     pt: 'Equador',    en: 'Ecuador'    },
  { code: 'CR', flag: '🇨🇷', es: 'Costa Rica',  pt: 'Costa Rica', en: 'Costa Rica' },
  { code: 'PY', flag: '🇵🇾', es: 'Paraguay',    pt: 'Paraguai',   en: 'Paraguay'   },
  { code: 'BO', flag: '🇧🇴', es: 'Bolivia',     pt: 'Bolívia',    en: 'Bolivia'    },
  { code: 'VE', flag: '🇻🇪', es: 'Venezuela',   pt: 'Venezuela',  en: 'Venezuela'  },
  { code: 'PA', flag: '🇵🇦', es: 'Panamá',      pt: 'Panamá',     en: 'Panama'     },
  { code: 'ES', flag: '🇪🇸', es: 'España',      pt: 'Espanha',    en: 'Spain'      },
  { code: 'OT', flag: '🌎',  es: 'Otro',        pt: 'Outro',      en: 'Other'      },
]

// Dado un nombre almacenado en DB (español), devuelve la bandera
export function getFlagByName(name) {
  const found = COUNTRIES.find(c =>
    c.es.toLowerCase() === name?.toLowerCase() ||
    c.pt.toLowerCase() === name?.toLowerCase() ||
    c.en.toLowerCase() === name?.toLowerCase()
  )
  return found?.flag ?? '🌎'
}

// Devuelve el nombre localizado para mostrar en UI
export function getLocalizedName(name, lang = 'es') {
  const found = COUNTRIES.find(c =>
    c.es.toLowerCase() === name?.toLowerCase() ||
    c.pt.toLowerCase() === name?.toLowerCase() ||
    c.en.toLowerCase() === name?.toLowerCase()
  )
  return found?.[lang] ?? name ?? ''
}
