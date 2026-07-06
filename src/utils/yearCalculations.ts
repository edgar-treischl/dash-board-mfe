/**
 * Year calculation utilities for school year formatting and manipulation
 */

import { type SchoolYear } from '../retention'

/**
 * Formats a numeric year to school year abbreviation format (e.g., 2024 -> "24")
 * @param year - Full 4-digit year
 * @returns Abbreviated 2-digit year
 */
export function formatYearAbbrev(year: number): string {
  return (year % 100).toString().padStart(2, '0')
}

/**
 * Calculates the previous school year in "YYYY/YY" format
 * @param currentYear - Current school year in format "YYYY/YY" (e.g., "2024/25")
 * @returns Previous school year string (e.g., "2023/24") or null if at minimum year
 */
export function getPreviousSchoolYear(currentYear: SchoolYear): SchoolYear | null {
  try {
    const parts = currentYear.split('/')
    const currentYearNum = parseInt(parts[0])
    if (currentYearNum <= 0) {
      return null
    }
    const previousYearNum = currentYearNum - 1
    const endYear = formatYearAbbrev(currentYearNum)
    return `${previousYearNum}/${endYear}` as SchoolYear
  } catch {
    return null
  }
}

/**
 * Extracts the numeric year from a school year string
 * @param schoolYear - School year in format "YYYY/YY"
 * @returns Numeric year or null if invalid
 */
export function getNumericYear(schoolYear: SchoolYear): number | null {
  try {
    return parseInt(schoolYear.split('/')[0])
  } catch {
    return null
  }
}

/**
 * Validates school year format
 * @param year - String to validate
 * @returns True if valid "YYYY/YY" format
 */
export function isValidSchoolYear(year: string): year is SchoolYear {
  const pattern = /^\d{4}\/\d{2}$/
  return pattern.test(year)
}
