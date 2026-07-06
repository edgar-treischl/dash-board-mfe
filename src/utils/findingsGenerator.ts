/**
 * Utilities for generating findings and insights from retention data
 */

import { type SchoolType } from '../retention'

export type BarChartStat = {
  type: SchoolType
  count: number
  percent: number
}

export type Finding = string

/**
 * Generates findings text from bar chart statistics
 * Finds highest/lowest retention rates and creates human-readable insights
 * @param selectedYear - The school year being analyzed
 * @param stats - Bar chart statistics with school type breakdown
 * @returns Array of finding strings with HTML markup
 */
export function generateBarChartFindings(
  selectedYear: string,
  stats: BarChartStat[],
): Finding[] {
  if (stats.length === 0) {
    return []
  }

  // Find max and min retention rates
  const maxStat = stats.reduce((max, curr) =>
    curr.percent > max.percent ? curr : max
  )
  const minStat = stats.reduce((min, curr) =>
    curr.percent < min.percent ? curr : min
  )

  // Find second highest
  const secondHighest = stats
    .filter((s) => s.type !== maxStat.type)
    .sort((a, b) => b.percent - a.percent)[0]?.type

  return [
    `Im Schuljahr ${selectedYear} haben die meisten Wiederholungen in der <strong>${maxStat.type}</strong> stattgefunden (${Math.round(maxStat.percent)}%), gefolgt vom <strong>${secondHighest}</strong>.`,
    `Die <strong>${minStat.type}</strong> weist die niedrigste Anzahl an Wiederholungen auf (${Math.round(minStat.percent)}%).`,
  ]
}
