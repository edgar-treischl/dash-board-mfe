import retentionData from './data/retention.json'
import sexData from './data/sex.json'
import migrationData from './data/migration.json'
import { getPreviousSchoolYear } from './utils/yearCalculations.ts'

export const SCHOOL_TYPES = ['GS', 'MS', 'RS', 'GY', 'IGS'] as const

// Mapping from old school type names to new abbreviations
const SCHOOL_TYPE_MAPPING: Record<string, SchoolType> = {
  'Grundschulen': 'GS',
  'Mittel-/Hauptschulen': 'MS',
  'Realschulen': 'RS',
  'Gymnasien': 'GY',
  'Int. Gesamtschulen': 'IGS',
  'Gesamt': 'IGS', // legacy mapping
}

// Reverse mapping from abbreviations to full names
export const SCHOOL_TYPE_LABELS: Record<SchoolType, string> = {
  'GS': 'Grundschulen',
  'MS': 'Mittelschulen',
  'RS': 'Realschulen',
  'GY': 'Gymnasien',
  'IGS': 'Int. Gesamtschule',
}

export type SchoolType = (typeof SCHOOL_TYPES)[number]
export type SchoolTypeFilter = SchoolType | 'All school types'
export type SchoolYear = string // e.g., "2024/25"

export type RetentionDatum = {
  syear: SchoolYear
  stype: SchoolType
  group: string
  number: number
  year: string
  n_overall: number
  percent: number
}

type RawRetentionDatum = {
  syear: string
  stype: string
  group: string
  number: number
  year: string
  n_overall: number
  percent: number
}

export type SchoolTypeOption = {
  key: SchoolTypeFilter
  label: string
}

export type DatasetSummary = {
  totalYears: number
  totalRetentions: number
  schoolTypes: SchoolType[]
  yearRange: string
  latestYear: SchoolYear
}

// School type options for filtering
export const SCHOOL_TYPE_OPTIONS: SchoolTypeOption[] = [
  { key: 'All school types', label: 'Alle Schultypen' },
  { key: 'GS', label: 'Grundschulen' },
  { key: 'MS', label: 'Mittelschulen' },
  { key: 'RS', label: 'Realschulen' },
  { key: 'GY', label: 'Gymnasien' },
  { key: 'IGS', label: 'Int. Gesamtschule' },
]

// Color scheme for school types
export const SCHOOL_TYPE_COLORS: Record<SchoolType, string> = {
  'GS': '#264653',            // blue
  'MS': '#2a9d8f',            // red
  'RS': '#e9c46a',            // green
  'GY': '#f4a261',            // amber
  'IGS': '#e76f51',           // purple
}

// Chart configuration
export const CHART_WIDTH = 800
export const CHART_HEIGHT = 500
export const CHART_PADDING = {
  top: 40,
  right: 60,
  bottom: 80,
  left: 90,
}

// Transform and validate raw data
/**
 * Type guard to validate that a string is a valid SchoolType
 */
function isValidSchoolType(value: string): value is SchoolType {
  return SCHOOL_TYPES.includes(value as SchoolType)
}

/**
 * Maps old school type names to new abbreviations
 * Used for backward compatibility with data exports
 */
function mapSchoolType(oldName: string): SchoolType {
  return SCHOOL_TYPE_MAPPING[oldName] || (oldName as SchoolType)
}

export const RETENTION_DATA: RetentionDatum[] = (retentionData as RawRetentionDatum[])
  .filter((row) => {
    // Validate required fields exist
    if (!row.syear || !row.stype || row.number === undefined || row.n_overall === undefined) {
      console.warn('Invalid retention data row: missing required fields', row)
      return false
    }
    // Only include overall group data
    return row.group === 'Insgesamt'
  })
  .map((row) => {
    const mappedType = mapSchoolType(row.stype)
    return {
      syear: row.syear,
      stype: mappedType,
      group: row.group,
      number: row.number,
      year: row.year,
      n_overall: row.n_overall,
      percent: row.percent,
    }
  })
  .filter((row) => {
    // Validate mapped type is valid
    if (!isValidSchoolType(row.stype)) {
      console.warn('Invalid school type after mapping:', row.stype)
      return false
    }
    return true
  })

// Get unique school years sorted
export const SCHOOL_YEARS: SchoolYear[] = Array.from(
  new Set(RETENTION_DATA.map((d) => d.syear))
).sort((a, b) => {
  const yearA = parseInt(a.split('/')[0])
  const yearB = parseInt(b.split('/')[0])
  return yearB - yearA // Most recent first
})

// Filter retention data by school type
/**
 * Filters retention data by school type or returns all data
 * @param filter - School type abbreviation or 'All school types' for complete dataset
 * @returns Array of retention data for the specified school type(s)
 */
export function filterRetentionBySchoolType(filter: SchoolTypeFilter): RetentionDatum[] {
  if (filter === 'All school types') {
    return RETENTION_DATA
  }
  return RETENTION_DATA.filter((d) => d.stype === filter)
}

// Get data for a specific school year
/**
 * Retrieves retention data for a specific school year
 * @param year - School year in format "YYYY/YY" (e.g., "2024/25")
 * @returns Array of retention data for all school types in that year
 */
export function getDataForYear(year: SchoolYear): RetentionDatum[] {
  return RETENTION_DATA.filter((d) => d.syear === year)
}

// Get time series data for trend chart (all years, grouped by school type)
/**
 * Groups retention data by school type in chronological order
 * Used for rendering trend charts showing retention over time
 * @returns Map of school types to their historical retention data (sorted by year)
 */
export function getTimeSeriesData(): Map<SchoolType, RetentionDatum[]> {
  const grouped = new Map<SchoolType, RetentionDatum[]>()
  
  SCHOOL_TYPES.forEach((type) => {
    const data = RETENTION_DATA.filter((d) => d.stype === type).sort((a, b) => {
      const yearA = parseInt(a.year)
      const yearB = parseInt(b.year)
      return yearA - yearB // Chronological order
    })
    grouped.set(type, data)
  })
  
  return grouped
}

// Calculate dataset summary
export const DATASET_SUMMARY: DatasetSummary = {
  totalYears: SCHOOL_YEARS.length,
  totalRetentions: RETENTION_DATA.reduce((sum, d) => sum + d.number, 0),
  schoolTypes: [...SCHOOL_TYPES],
  yearRange: `${SCHOOL_YEARS[SCHOOL_YEARS.length - 1]} - ${SCHOOL_YEARS[0]}`,
  latestYear: SCHOOL_YEARS[0],
}

// Build statistics for bar chart view
/**
 * Calculates aggregated statistics from retention data for display
 * Returns safe defaults for empty or invalid data
 * @param data - Array of retention data points
 * @returns Object with total students, total retentions, overall rate, and breakdown by school type
 */
export function buildBarChartStats(data: RetentionDatum[]) {
  if (!data || data.length === 0) {
    return {
      totalStudents: 0,
      totalRetentions: 0,
      overallRate: 0,
      bySchoolType: [],
    }
  }

  const totalRetentions = data.reduce((sum, d) => sum + (d.number ?? 0), 0)
  
  // Use first available n_overall value, with fallback
  const totalStudents = data.find((d) => d.n_overall && d.n_overall > 0)?.n_overall ?? 0
  const overallRate = totalStudents > 0 ? (totalRetentions / totalStudents) * 100 : 0

  const bySchoolType = SCHOOL_TYPES.map((type) => {
    const datum = data.find((d) => d.stype === type)
    return {
      type,
      count: datum?.number ?? 0,
      percent: datum?.percent ?? 0,
    }
  }).filter((item) => item.count > 0)

  return {
    totalStudents,
    totalRetentions,
    overallRate: parseFloat(overallRate.toFixed(2)),
    bySchoolType,
  }
}

// Format percentage for display
/**
 * Formats a number as a percentage string with 2 decimal places
 * @param value - Numeric value to format
 * @returns Formatted string (e.g., "42.50%")
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

// Format number with thousands separator
/**
 * Formats a number with German locale thousand separators
 * @param value - Numeric value to format
 * @returns Formatted string with locale-specific separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('de-DE')
}

/**
 * Get year-over-year change for a school type
 * Calculates the percentage point change in retention rate between consecutive years
 * @param currentYear - Current school year in format "YYYY/YY"
 * @param schoolType - School type abbreviation
 * @returns Percentage point change (positive = increase), or null if data unavailable
 */
export function getYearOverYearChange(currentYear: SchoolYear, schoolType: SchoolType): number | null {
  const currentData = RETENTION_DATA.find((d) => d.syear === currentYear && d.stype === schoolType)
  
  const previousYear = getPreviousSchoolYear(currentYear)
  if (!previousYear) {
    return null
  }
  
  const previousData = RETENTION_DATA.find((d) => d.syear === previousYear && d.stype === schoolType)
  
  if (!currentData || !previousData) {
    return null
  }
  
  return parseFloat((currentData.percent - previousData.percent).toFixed(2))
}

// Disaggregated data type (Sex/Gender and Migration/Citizenship)
export type DisaggregatedDatum = {
  syear: SchoolYear
  stype: SchoolType
  group: string
  number: number
  year: string
  total: number
  percentage: number
}

// Sex/Gender data type (alias for clarity)
export type SexDatum = DisaggregatedDatum

// Migration/citizenship data type (alias for clarity)
export type MigrationDatum = DisaggregatedDatum

type RawDisaggregatedDatum = {
  syear: SchoolYear
  stype: string
  group: string
  number: number
  year: string
  total: number
  percentage: number
}

/**
 * Generic transformer for disaggregated data (sex/gender, migration/citizenship)
 * Filters out invalid records and normalizes school type names
 * @param data - Raw disaggregated data array
 * @param dataType - Label for error messages (e.g., 'sex data', 'migration data')
 * @returns Transformed and validated disaggregated data
 */
function transformDisaggregatedData(
  data: RawDisaggregatedDatum[],
  dataType: string,
): DisaggregatedDatum[] {
  return data
    .filter((d) => {
      if (d.percentage === null || d.percentage === undefined || d.total === null || d.total === undefined) {
        return false
      }
      return true
    })
    .map((d) => ({
      ...d,
      stype: mapSchoolType(d.stype),
    }))
    .filter((d) => {
      if (!isValidSchoolType(d.stype)) {
        console.warn(`Invalid school type in ${dataType}:`, d.stype)
        return false
      }
      return true
    })
}

// Get sex/gender breakdown data
/**
 * Retrieves and transforms sex/gender breakdown data from the raw data source
 * @returns Array of sex-disaggregated retention data
 */
export function getSexData(): SexDatum[] {
  return transformDisaggregatedData(sexData as RawDisaggregatedDatum[], 'sex data')
}

// Get migration/citizenship breakdown data
/**
 * Retrieves and transforms migration/citizenship breakdown data from the raw data source
 * @returns Array of migration-disaggregated retention data
 */
export function getMigrationData(): MigrationDatum[] {
  return transformDisaggregatedData(migrationData as RawDisaggregatedDatum[], 'migration data')
}
