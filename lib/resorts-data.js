// Info estática enfocada en Work & Travel para cada resort
// Se cruza por nombre con los datos de Supabase

export const RESORT_INFO = {
  'Vail': {
    emoji: '🏔️',
    vibe: 'El más famoso. Muy turístico, mucho trabajo disponible.',
    temporada: 'Nov — Abr',
    salario: '$15–$20/hr',
    housing: 'Muy difícil de conseguir. Recomendable buscar antes de llegar.',
    ciudad_cercana: 'Denver (2h)',
    nieve: 'Excelente',
    dificultad_wt: 'Media',
    trabajos: ['Lift Operator', 'F&B', 'Ski Rental', 'Housekeeping', 'Retail'],
    tips: [
      'Vail Village es caro — conseguí housing en Avon o Edwards.',
      'Hay muchos latinos trabajando, fácil hacer comunidad.',
      'El ski pass de empleado es uno de los mejores beneficios.',
    ],
    alojamiento_empresa: true,
  },
  'Aspen Snowmass': {
    emoji: '💎',
    vibe: 'El más exclusivo. Clientes de alto poder adquisitivo = buenas propinas.',
    temporada: 'Nov — Abr',
    salario: '$16–$22/hr + propinas',
    housing: 'La empresa ofrece housing a empleados. Aplicar apenas confirmado.',
    ciudad_cercana: 'Denver (3.5h) — solo hay avión o bus',
    nieve: 'Excelente',
    dificultad_wt: 'Media',
    trabajos: ['F&B', 'Concierge', 'Ski Valet', 'Housekeeping', 'Retail'],
    tips: [
      'Las propinas en restaurantes pueden doblar tu sueldo base.',
      'Aspen es muy pequeño — todo se hace caminando.',
      'Hay 4 montañas en el complejo: Aspen, Snowmass, Buttermilk y Highlands.',
    ],
    alojamiento_empresa: true,
  },
  'Breckenridge': {
    emoji: '🎿',
    vibe: 'Ideal para primeras temporadas. Town muy animado, mucho social life.',
    temporada: 'Nov — Abr',
    salario: '$15–$19/hr',
    housing: 'Difícil pero hay opciones de housing compartido en el pueblo.',
    ciudad_cercana: 'Denver (1.5h)',
    nieve: 'Muy buena',
    dificultad_wt: 'Baja — ideal para primeras veces',
    trabajos: ['Lift Operator', 'F&B', 'Ski School', 'Ski Rental', 'Retail'],
    tips: [
      'Main Street tiene bares y restaurantes abiertos toda la noche.',
      'Muchos latinos — comunidad hispanohablante grande.',
      'Breck tiene 5 picos y más de 150 runs.',
    ],
    alojamiento_empresa: false,
  },
  'Park City': {
    emoji: '🎬',
    vibe: 'Sede del Sundance Film Festival. Mix entre resort y ciudad real.',
    temporada: 'Nov — Abr',
    salario: '$14–$18/hr',
    housing: 'Más accesible que Colorado. Hay housing en Salt Lake City (30 min).',
    ciudad_cercana: 'Salt Lake City (45 min)',
    nieve: 'Muy buena (Utah powder)',
    dificultad_wt: 'Baja — ideal para primeras veces',
    trabajos: ['Lift Operator', 'F&B', 'Ski Rental', 'Housekeeping'],
    tips: [
      'Main Street Park City es muy linda para salir.',
      'El resort más grande de USA por número de runs (330+).',
      'Cerca del aeropuerto SLC — fácil llegada.',
    ],
    alojamiento_empresa: false,
  },
  'Mammoth Mountain': {
    emoji: '🌋',
    vibe: 'California vibes. Temporada larguísima, a veces hasta julio.',
    temporada: 'Nov — Jun (o más)',
    salario: '$16–$20/hr',
    housing: 'La empresa ofrece housing. Mammoth Lakes es el pueblo base.',
    ciudad_cercana: 'Los Angeles (5h) / Reno (3h)',
    nieve: 'Cantidad enorme (más de 400" anuales)',
    dificultad_wt: 'Media',
    trabajos: ['Lift Operator', 'F&B', 'Ski Patrol', 'Ski Rental', 'Housekeeping'],
    tips: [
      'Temporada más larga de USA — podés hacer 7+ meses.',
      'Muy popular entre snowboarders.',
      'Mammoth Lakes tiene varios lagos — hermoso en verano.',
    ],
    alojamiento_empresa: true,
  },
  'Jackson Hole': {
    emoji: '🦬',
    vibe: 'El más extremo. Para los que quieren montaña seria y wildlife.',
    temporada: 'Dic — Abr',
    salario: '$16–$21/hr',
    housing: 'Muy difícil y caro. Jackson Town es carísimo.',
    ciudad_cercana: 'Salt Lake City (5h) / Idaho Falls (1.5h)',
    nieve: 'Legendaria. Mucho polvo seco.',
    dificultad_wt: 'Alta — terreno difícil',
    trabajos: ['Lift Operator', 'F&B', 'Ski Patrol', 'Housekeeping'],
    tips: [
      'Terreno más vertical de USA — no es para principiantes en ski.',
      'Cerca del Parque Yellowstone y Grand Teton.',
      'El pueblo tiene mucho western vibe.',
    ],
    alojamiento_empresa: false,
  },
  'Steamboat Springs': {
    emoji: '🤠',
    vibe: 'Ambiente más relajado y familiar. Bueno para primera temporada.',
    temporada: 'Nov — Abr',
    salario: '$14–$18/hr',
    housing: 'Relativamente accesible. Pueblo chico y tranquilo.',
    ciudad_cercana: 'Denver (3h)',
    nieve: 'Champagne Powder — la más liviana de Colorado.',
    dificultad_wt: 'Baja',
    trabajos: ['Lift Operator', 'F&B', 'Ski Rental', 'Housekeeping'],
    tips: [
      'Conocido por la "Champagne Powder" — nieve muy liviana.',
      'Vibe más tranquilo que Vail o Breckenridge.',
      'Tiene aguas termales naturales en el pueblo.',
    ],
    alojamiento_empresa: false,
  },
  'Telluride': {
    emoji: '🏜️',
    vibe: 'Pintoresco y exclusivo. Pueblo histórico de la época del oro.',
    temporada: 'Nov — Abr',
    salario: '$15–$20/hr + propinas',
    housing: 'Muy difícil. Muchos empleados viven en Montrose (1h).',
    ciudad_cercana: 'Montrose (1h) / Grand Junction (2h)',
    nieve: 'Muy buena',
    dificultad_wt: 'Media',
    trabajos: ['F&B', 'Lift Operator', 'Housekeeping', 'Retail'],
    tips: [
      'Pueblo histórico declarado National Historic Landmark.',
      'Muy aislado — planificá bien el transporte.',
      'Hay un gondola gratis que conecta el resort con el pueblo.',
    ],
    alojamiento_empresa: false,
  },
  'Snowbird': {
    emoji: '🐦',
    vibe: 'Utah powder puro. Para los que quieren ski serio.',
    temporada: 'Nov — May',
    salario: '$14–$18/hr',
    housing: 'La empresa tiene housing en el resort.',
    ciudad_cercana: 'Salt Lake City (30 min)',
    nieve: 'Legendaria (500"+ anuales)',
    dificultad_wt: 'Media-Alta',
    trabajos: ['Lift Operator', 'F&B', 'Housekeeping', 'Ski Rental'],
    tips: [
      'Junto con Alta — uno de los mejores terrenos del mundo.',
      'A solo 30 min de Salt Lake City — fácil acceso.',
      'En temporada de nieve puede haber 2m+ de base.',
    ],
    alojamiento_empresa: true,
  },
  'Taos Ski Valley': {
    emoji: '🌵',
    vibe: 'Pequeño, auténtico, con mucha cultura local. Gema escondida.',
    temporada: 'Nov — Abr',
    salario: '$13–$17/hr',
    housing: 'Limitado. Algunos en Taos (30 min).',
    ciudad_cercana: 'Taos (30 min) / Albuquerque (2.5h)',
    nieve: 'Buena',
    dificultad_wt: 'Media',
    trabajos: ['Lift Operator', 'F&B', 'Ski School', 'Housekeeping'],
    tips: [
      'Taos tiene mucha cultura artística y gastronomía local.',
      'Resort relativamente pequeño — ambiente familiar.',
      'Mucha comunidad hispana en la zona.',
    ],
    alojamiento_empresa: false,
  },
  'Killington': {
    emoji: '🍂',
    vibe: 'El más grande del Este. Temporada larguísima para la costa este.',
    temporada: 'Oct — May',
    salario: '$14–$18/hr',
    housing: 'Hay opciones de housing compartido en Killington Road.',
    ciudad_cercana: 'Burlington VT (1.5h) / Boston (3h)',
    nieve: 'Buena (mucha nieve artificial también)',
    dificultad_wt: 'Baja-Media',
    trabajos: ['Lift Operator', 'F&B', 'Ski Rental', 'Housekeeping'],
    tips: [
      'Temporada más larga del Este de USA.',
      'Killington Road tiene muchos bares — buen social life.',
      'Más accesible desde la costa este (Boston, NYC).',
    ],
    alojamiento_empresa: false,
  },
  'Stowe': {
    emoji: '🍁',
    vibe: 'El más bonito del Este. Pueblo con mucho charme, muy Vermont.',
    temporada: 'Nov — Abr',
    salario: '$14–$18/hr',
    housing: 'Stowe pueblo tiene algunas opciones.',
    ciudad_cercana: 'Burlington VT (40 min)',
    nieve: 'Buena',
    dificultad_wt: 'Baja-Media',
    trabajos: ['F&B', 'Lift Operator', 'Housekeeping', 'Retail'],
    tips: [
      'Stowe es considerado el resort más lindo de Vermont.',
      'Cerca de Burlington — ciudad universitaria animada.',
      'Muy bonito también en otoño.',
    ],
    alojamiento_empresa: false,
  },
  'Big Sky': {
    emoji: '🌌',
    vibe: 'El más grande de USA por area esquiable. Poco concurrido.',
    temporada: 'Nov — Abr',
    salario: '$15–$19/hr',
    housing: 'La empresa tiene housing. Big Sky es un resort-town.',
    ciudad_cercana: 'Bozeman (1h)',
    nieve: 'Excelente',
    dificultad_wt: 'Media',
    trabajos: ['Lift Operator', 'F&B', 'Housekeeping', 'Ski Rental'],
    tips: [
      'El resort más grande de USA — pocas filas siempre.',
      'Bozeman es una ciudad universitaria muy copada.',
      'Cerca del Parque Yellowstone.',
    ],
    alojamiento_empresa: true,
  },
  'Sun Valley': {
    emoji: '☀️',
    vibe: 'El primer resort de USA. Clásico y exclusivo.',
    temporada: 'Nov — Abr',
    salario: '$14–$18/hr',
    housing: 'Ketchum (pueblo base) tiene algunas opciones.',
    ciudad_cercana: 'Boise (2.5h)',
    nieve: 'Buena',
    dificultad_wt: 'Media',
    trabajos: ['F&B', 'Lift Operator', 'Housekeeping', 'Ski School'],
    tips: [
      'El primer ski resort de USA — historia desde 1936.',
      'Ketchum es un pueblo muy lindo y tranquilo.',
      'Famoso por el ski de estilo clásico.',
    ],
    alojamiento_empresa: false,
  },
  'Whistler Blackcomb': {
    emoji: '🇨🇦',
    vibe: 'El mejor de Norteamérica. Enorme, internacional, impresionante.',
    temporada: 'Nov — May',
    salario: 'CAD $17–$22/hr',
    housing: 'La empresa tiene opciones. Whistler village es caro.',
    ciudad_cercana: 'Vancouver (2h)',
    nieve: 'Legendaria',
    dificultad_wt: 'Media — requiere visa canadiense',
    trabajos: ['Lift Operator', 'F&B', 'Ski School', 'Housekeeping', 'Retail'],
    tips: [
      'Requiere visa de trabajo canadiense (IEC Working Holiday).',
      'El más grande de Norteamérica — 200+ runs, 2 montañas.',
      'Vancouver muy cerca — excelente para explorar BC.',
    ],
    alojamiento_empresa: true,
  },
  'Red River': {
    emoji: '🌯',
    vibe: {
      es: 'Pueblito tranquilo con mucha cultura hispana. Resort pequeño, ideal para principiantes y familias.',
      pt: 'Cidadezinha tranquila com muita cultura hispânica. Resort pequeno, ideal para iniciantes e famílias.',
      en: 'A quiet small town with strong Hispanic culture. A smaller resort, great for beginners and families.',
    },
    temporada: {
      es: 'Nov — Mar',
      pt: 'Nov — Mar',
      en: 'Nov — Mar',
    },
    salario: '$13–$16/hr',
    housing: {
      es: 'La empresa a menudo ofrece housing, pero Red River es pequeño — también hay opciones en el pueblo.',
      pt: 'A empresa costuma oferecer housing, mas Red River é pequeno — também há opções na cidade.',
      en: 'The company often offers housing, but Red River is small — there are also options in town.',
    },
    ciudad_cercana: {
      es: 'Taos (30 min) / Santa Fe (2h)',
      pt: 'Taos (30 min) / Santa Fe (2h)',
      en: 'Taos (30 min) / Santa Fe (2h)',
    },
    nieve: {
      es: 'Buena — típico de New Mexico a 8,000+ pies de altura.',
      pt: 'Boa — típico do Novo México a mais de 8.000 pés de altitude.',
      en: 'Good — typical New Mexico snow at 8,000+ ft elevation.',
    },
    dificultad_wt: 'Baja — ideal para primeras veces',
    trabajos: ['Lift Operator', 'F&B', 'Ski Rental', 'Housekeeping'],
    tips: {
      es: [
        'Red River es un pueblo artístico con mucha gastronomía local.',
        'Mucha comunidad hispana en la zona — ambiente relajado.',
        'A solo 40 min de Taos — cultura y restaurantes excelentes.',
      ],
      pt: [
        'Red River é uma cidade artística com ótima gastronomia local.',
        'Há bastante comunidade hispânica na região — clima bem tranquilo.',
        'Fica a apenas 40 min de Taos — cultura e restaurantes excelentes.',
      ],
      en: [
        'Red River is an artsy mountain town with strong local food options.',
        'There is a strong Hispanic community in the area and a relaxed vibe.',
        'It is only 40 minutes from Taos — great culture and restaurants nearby.',
      ],
    },
    alojamiento_empresa: true,
  },
}

const DIFFICULTY_LABELS = {
  'Baja': { es: 'Baja', pt: 'Baixa', en: 'Low' },
  'Baja — ideal para primeras veces': {
    es: 'Baja — ideal para primeras veces',
    pt: 'Baixa — ideal para primeira vez',
    en: 'Low — ideal for first-timers',
  },
  'Baja-Media': { es: 'Baja-Media', pt: 'Baixa-Média', en: 'Low-Medium' },
  'Media': { es: 'Media', pt: 'Média', en: 'Medium' },
  'Media-Alta': { es: 'Media-Alta', pt: 'Média-Alta', en: 'Medium-High' },
  'Alta': { es: 'Alta', pt: 'Alta', en: 'High' },
  'Alta — terreno difícil': {
    es: 'Alta — terreno difícil',
    pt: 'Alta — terreno difícil',
    en: 'High — challenging terrain',
  },
  'Media — requiere visa canadiense': {
    es: 'Media — requiere visa canadiense',
    pt: 'Média — requer visto canadense',
    en: 'Medium — requires Canadian work visa',
  },
}

function localizeValue(value, lang) {
  if (Array.isArray(value)) return value.map(item => localizeValue(item, lang))
  if (value && typeof value === 'object') {
    const hasLangShape = 'es' in value || 'pt' in value || 'en' in value
    if (hasLangShape) return value[lang] ?? value.es ?? value.en ?? value.pt ?? null

    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, localizeValue(nestedValue, lang)])
    )
  }
  return value
}

export function getResortInfo(nombre, lang = 'es') {
  const baseInfo = RESORT_INFO[nombre]
  if (!baseInfo) return null

  const localized = localizeValue(baseInfo, lang)
  const difficultyKey = baseInfo.dificultad_wt

  return {
    ...localized,
    dificultad_wt_key: difficultyKey,
    dificultad_wt: DIFFICULTY_LABELS[difficultyKey]?.[lang] ?? difficultyKey,
  }
}

// Extrae el salario mínimo en USD de strings como "$15–$20/hr" o "CAD $17–$22/hr"
export function parseMinSalary(salarioStr) {
  if (!salarioStr) return null
  const match = salarioStr.match(/\$(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

export const DIFICULTAD_COLOR = {
  'Baja': 'text-green-400',
  'Baja — ideal para primeras veces': 'text-green-400',
  'Baja-Media': 'text-yellow-400',
  'Media': 'text-yellow-400',
  'Media-Alta': 'text-orange-400',
  'Alta': 'text-red-400',
  'Alta — terreno difícil': 'text-red-400',
  'Media — requiere visa canadiense': 'text-yellow-400',
}
