import { memo, useState } from 'react'
import {
  CHART_HEIGHT,
  CHART_PADDING,
  CHART_WIDTH,
  SCHOOL_TYPES,
  SCHOOL_TYPE_COLORS,
  formatNumber,
  type SchoolType,
  type RetentionDatum,
} from '../../retention.ts'

/**
 * LineChart component - Multi-series line chart for retention trends over time
 * @param data - Map of school types to retention data points
 * @param minYear - Minimum year to display
 * @param maxYear - Maximum year to display
 */
type LineChartProps = {
  data: Map<SchoolType, RetentionDatum[]>
  minYear: number
  maxYear: number
}

type HoveredPoint = {
  schoolType: SchoolType
  syear: string
  value: number
  x: number
  y: number
} | null

/**
 * Line chart component for displaying retention trends over time by school type
 * 
 * @param data - Map of school types to their historical retention data
 * @param minYear - Minimum year for x-axis
 * @param maxYear - Maximum year for x-axis
 */
function LineChartComponent({ data, minYear, maxYear }: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint>(null)
  // Get all years from the data
  const allYearsSet = new Set<string>()
  const schoolYearMap = new Map<string, string>() // year -> syear mapping
  data.forEach((schoolTypeData) => {
    schoolTypeData.forEach((d) => {
      allYearsSet.add(d.year)
      schoolYearMap.set(d.year, d.syear)
    })
  })
  const allYears = Array.from(allYearsSet).map(y => parseInt(y)).sort((a, b) => a - b)

  // Calculate scales
  const chartInnerWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
  const chartInnerHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom

  // Y-axis: retention count
  const maxRetention = Math.max(
    ...(Array.from(data.values()).flat().map(d => d.number) || [0])
  )
  const yScale = (value: number) =>
    CHART_HEIGHT - CHART_PADDING.bottom - (value / maxRetention) * chartInnerHeight

  // X-axis: year
  const yearRange = Math.max(...allYears) - Math.min(...allYears) || 1
  const xScale = (year: string) => {
    const yearNum = parseInt(year)
    return CHART_PADDING.left + ((yearNum - Math.min(...allYears)) / yearRange) * chartInnerWidth
  }

  // Y-axis ticks
  const yTicks = [0, Math.round(maxRetention / 4), Math.round(maxRetention / 2), Math.round((maxRetention * 3) / 4), maxRetention]

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="class-retention-mfe__chart"
      role="img"
      aria-label="Liniendiagramm der Klassenwiederholungen im Zeitverlauf nach Schultyp"
    >
      {/* Y-axis grid lines and labels */}
      {yTicks.map((tick) => {
        const y = yScale(tick)
        return (
          <g key={`y-${tick}`}>
            <line
              x1={CHART_PADDING.left}
              x2={CHART_WIDTH - CHART_PADDING.right}
              y1={y}
              y2={y}
              className="class-retention-mfe__grid-line"
            />
            <text
              x={CHART_PADDING.left - 10}
              y={y + 4}
              className="class-retention-mfe__axis-label class-retention-mfe__axis-label--y"
            >
              {formatNumber(tick)}
            </text>
          </g>
        )
      })}

      {/* X-axis labels */}
      {allYears.map((year) => {
        const x = xScale(year.toString())
        const schoolYear = schoolYearMap.get(year.toString()) || year.toString()
        return (
          <text
            key={`x-${year}`}
            x={x}
            y={CHART_HEIGHT - CHART_PADDING.bottom + 24}
            textAnchor="middle"
            className="class-retention-mfe__axis-label"
          >
            {schoolYear}
          </text>
        )
      })}

      {/* Axes */}
      <line
        x1={CHART_PADDING.left}
        x2={CHART_WIDTH - CHART_PADDING.right}
        y1={CHART_HEIGHT - CHART_PADDING.bottom}
        y2={CHART_HEIGHT - CHART_PADDING.bottom}
        className="class-retention-mfe__axis-line"
      />
      <line
        x1={CHART_PADDING.left}
        x2={CHART_PADDING.left}
        y1={CHART_PADDING.top}
        y2={CHART_HEIGHT - CHART_PADDING.bottom}
        className="class-retention-mfe__axis-line"
      />

      {/* Axis labels */}
      <text
        x={CHART_WIDTH / 2}
        y={CHART_HEIGHT - 10}
        textAnchor="middle"
        className="class-retention-mfe__axis-title"
        style={{ fontSize: '16px', fontWeight: 500 }}
      >
        Schuljahr {minYear}/{maxYear}
      </text>
      <text
        x={15}
        y={CHART_HEIGHT / 2}
        textAnchor="middle"
        className="class-retention-mfe__axis-title"
        transform={`rotate(-90 15 ${CHART_HEIGHT / 2})`}
        style={{ fontSize: '16px', fontWeight: 500 }}
      >
        Anzahl Wiederholungen
      </text>

      {/* Lines and points for each school type */}
      {SCHOOL_TYPES.map((schoolType) => {
        const schoolTypeData = data.get(schoolType) || []
        if (schoolTypeData.length === 0) return null

        // Create path for line
        const pathData = schoolTypeData
          .map((d: RetentionDatum, i: number) => {
            const x = xScale(d.year)
            const y = yScale(d.number)
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
          })
          .join(' ')

        return (
          <g key={schoolType}>
            <path
              d={pathData}
              stroke={SCHOOL_TYPE_COLORS[schoolType]}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {schoolTypeData.map((d: RetentionDatum) => {
              const cx = xScale(d.year)
              const cy = yScale(d.number)
              return (
                <circle
                  key={`${schoolType}-${d.year}`}
                  cx={cx}
                  cy={cy}
                  r={hoveredPoint?.schoolType === schoolType && hoveredPoint?.syear === d.syear ? 7 : 5}
                  fill={SCHOOL_TYPE_COLORS[schoolType]}
                  style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                  onMouseEnter={() =>
                    setHoveredPoint({
                      schoolType,
                      syear: d.syear,
                      value: d.number,
                      x: cx,
                      y: cy,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              )
            })}
          </g>
        )
      })}

      {/* Tooltip */}
      {hoveredPoint && (() => {
        const tooltipHeight = 50
        const tooltipWidth = 130
        const tooltipPadding = 10
        // Position tooltip above point by default, or below if it would be cropped
        const tooltipY = hoveredPoint.y - tooltipHeight - tooltipPadding < CHART_PADDING.top
          ? hoveredPoint.y + tooltipPadding + 10
          : hoveredPoint.y - tooltipHeight - tooltipPadding
        
        return (
          <g>
            {/* Tooltip background */}
            <rect
              x={hoveredPoint.x - tooltipWidth / 2}
              y={tooltipY}
              width={tooltipWidth}
              height={tooltipHeight}
              rx={6}
              fill="white"
              stroke={SCHOOL_TYPE_COLORS[hoveredPoint.schoolType]}
              strokeWidth={2}
              className="class-retention-mfe__tooltip-bg"
            />
            {/* Tooltip text - School Type */}
            <text
              x={hoveredPoint.x}
              y={tooltipY + 16}
              textAnchor="middle"
              className="class-retention-mfe__tooltip-text class-retention-mfe__tooltip-label"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              {hoveredPoint.schoolType}
            </text>
            {/* Tooltip text - Year */}
            <text
              x={hoveredPoint.x}
              y={tooltipY + 28}
              textAnchor="middle"
              className="class-retention-mfe__tooltip-text class-retention-mfe__tooltip-label"
              style={{ fontSize: '12px', fill: '#666', fontWeight: 400 }}
            >
              {hoveredPoint.syear}
            </text>
            {/* Tooltip text - Value */}
            <text
              x={hoveredPoint.x}
              y={tooltipY + 42}
              textAnchor="middle"
              className="class-retention-mfe__tooltip-text"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              {formatNumber(hoveredPoint.value)}
            </text>
          </g>
        )
      })()}
    </svg>
  )
}

/**
 * Legend component for showing school type colors
 */
function LineChartLegendComponent() {
  return (
    <div className="class-retention-mfe__chart-legend">
      <div className="class-retention-mfe__legend-label">Schultyp</div>
      <ul className="class-retention-mfe__legend-list">
        {SCHOOL_TYPES.map((schoolType) => (
          <li key={schoolType}>
            <span
              className="class-retention-mfe__legend-swatch"
              style={{ backgroundColor: SCHOOL_TYPE_COLORS[schoolType] }}
            />
            {schoolType}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const LineChart = memo(LineChartComponent)
export const LineChartLegend = memo(LineChartLegendComponent)
