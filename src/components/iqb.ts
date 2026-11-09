import iqbData from '../data/iqb.json'

export const BEREICHE = ['Lesen', 'Orthografie', 'Zuhören'] as const
export const BUNDESLAENDER = ['Bayern', 'Deutschland'] as const
export const STUFEN = ['Ia', 'Ib', 'II', 'III', 'IV', 'V'] as const

export type Bereich = (typeof BEREICHE)[number]
export type Bundesland = (typeof BUNDESLAENDER)[number]
export type Stufe = (typeof STUFEN)[number]
export type Teilpop = 'alle' | 'MSA' | 'Gymnasium' | 'Allgemeine Hochschulreife'

export type IQBRawDatum = {
  bula: string
  p_Ia: number
  p_Ib: number
  p_II: number
  p_III: number
  p_IV: number
  p_V: number
  tab: string
  bereich: string
  teilpop: string
}

export type IQBDatum = {
  bula: Bundesland
  bereich: Bereich
  teilpop: Teilpop
  stufe: Stufe
  percentage: number
  tab: string
}

export type BulaFilter = Bundesland | 'Alle'
export type BereichFilter = Bereich | 'Alle'
export type TeilpopFilter = Teilpop | 'Alle' | 'Ohne Insgesamt'

// Color scheme from R code - matches the ggplot2 scale_fill_manual
export const STUFEN_COLORS: Record<Stufe, string> = {
  V: '#01665e',
  IV: '#5ab4ac',
  III: '#c7eae5',
  II: '#f6e8c3',
  Ib: '#d8b365',
  Ia: '#8c510a',
}

// Text color for labels (from R code)
export const STUFEN_LABEL_COLORS: Record<Stufe, string> = {
  V: 'white',
  IV: 'white',
  III: '#737373',
  II: '#737373',
  Ib: 'white',
  Ia: 'white',
}

// Normalized teilpop labels (from R factor labels)
export const TEILPOP_LABELS: Record<Teilpop, string> = {
  'alle': 'Insgesamt',
  'MSA': 'Mittlerer Schulabschluss',
  'Gymnasium': 'Gymnasium',
  'Allgemeine Hochschulreife': 'Allgemeine Hochschulreife',
}

const RAW_DATA = iqbData as IQBRawDatum[]

function normalizeIQBData(raw: IQBRawDatum[]): IQBDatum[] {
  const normalized: IQBDatum[] = []

  for (const row of raw) {
    if (!BUNDESLAENDER.includes(row.bula as Bundesland)) continue
    if (!BEREICHE.includes(row.bereich as Bereich)) continue

    const teilpop = row.teilpop as Teilpop

    for (const stufe of STUFEN) {
      const key = `p_${stufe}` as keyof IQBRawDatum
      const percentage = row[key] as number

      normalized.push({
        bula: row.bula as Bundesland,
        bereich: row.bereich as Bereich,
        teilpop,
        stufe,
        percentage,
        tab: row.tab,
      })
    }
  }

  return normalized
}

export const IQB_DATA: IQBDatum[] = normalizeIQBData(RAW_DATA)

export function filterData(
  bulaFilter: BulaFilter,
  bereichFilter: BereichFilter,
  teilpopFilter: TeilpopFilter
): IQBDatum[] {
  return IQB_DATA.filter((datum) => {
    if (bulaFilter !== 'Alle' && datum.bula !== bulaFilter) return false
    if (bereichFilter !== 'Alle' && datum.bereich !== bereichFilter) return false
    
    if (teilpopFilter === 'Alle') {
      return true
    } else if (teilpopFilter === 'Ohne Insgesamt') {
      return datum.teilpop !== 'alle'
    } else {
      return datum.teilpop === teilpopFilter
    }
  })
}

export function getOverallData(): IQBDatum[] {
  return IQB_DATA.filter((datum) => datum.teilpop === 'alle')
}

export function formatPercentage(value: number): string {
  // Following R code: hide values < 5, replace . with ,
  if (value < 5) return ''
  return value.toString().replace('.', ',')
}

export function getTeilpopLabel(teilpop: Teilpop): string {
  return TEILPOP_LABELS[teilpop] || teilpop
}

// Group data by bereich and bula for stacked bar charts
export type ChartGroup = {
  label: string
  bula: Bundesland
  bereich: Bereich
  teilpop: Teilpop
  showBulaLabel?: boolean // Whether to show Bayern/Deutschland label
  data: Array<{
    stufe: Stufe
    percentage: number
  }>
}

export function groupDataForChart(data: IQBDatum[], options?: { showBulaInLabel?: boolean }): ChartGroup[] {
  const groups = new Map<string, ChartGroup>()
  
  // Check if we have data from both regions
  const uniqueBulas = new Set(data.map(d => d.bula))
  const showBulaLabel = options?.showBulaInLabel ?? uniqueBulas.size > 1

  for (const datum of data) {
    const key = `${datum.bereich}-${datum.bula}-${datum.teilpop}`
    
    if (!groups.has(key)) {
      const teilpopLabel = getTeilpopLabel(datum.teilpop)
      const label = showBulaLabel 
        ? `${teilpopLabel}\n(${datum.bula})`
        : teilpopLabel
      
      groups.set(key, {
        label,
        bula: datum.bula,
        bereich: datum.bereich,
        teilpop: datum.teilpop,
        showBulaLabel,
        data: [],
      })
    }

    groups.get(key)!.data.push({
      stufe: datum.stufe,
      percentage: datum.percentage,
    })
  }

  // Sort stufe data in reverse order (V to Ia) to match ggplot2 stacking
  for (const group of groups.values()) {
    group.data.sort((a, b) => {
      return STUFEN.indexOf(b.stufe) - STUFEN.indexOf(a.stufe)
    })
  }

  return Array.from(groups.values())
}
