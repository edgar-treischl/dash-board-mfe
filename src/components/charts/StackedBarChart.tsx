import { memo } from 'react'
import {
  CHART_HEIGHT,
  CHART_PADDING,
  CHART_WIDTH,
  SCHOOL_TYPES,
  type SchoolType,
} from '../../retention.ts'

type SegmentData = {
  syear: string
  stype: SchoolType
  group: string
  number: number
  year: string
  total: number
  percentage: number
}

type StackedBarChartProps = {
  data: SegmentData[]
  ariaLabel: string
  legendItems: Array<{ label: string; color: string }>
  year?: string
}

/**
 * Stacked horizontal bar chart component for displaying segmented data by school type
 * Used for gender and migration breakdowns (SexView, MigrationView)
 * 
 * @param data - Array of segment data points (filtered by year)
 * @param ariaLabel - Accessibility label
 * @param legendItems - Legend items with labels and colors
 */
function StackedBarChartComponent({
  data,
  ariaLabel,
  legendItems,
  year,
}: StackedBarChartProps) {
  const chartInnerWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
  const chartInnerHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom
  
  const xScale = (percentage: number) => (percentage / 100) * chartInnerWidth

  // Group data by school type
  const schoolTypesWithData = SCHOOL_TYPES.filter((type) =>
    data.some((d: SegmentData) => d.stype === type)
  )

  // Dynamic bar sizing based on number of school types
  const totalSpacePerType = chartInnerHeight / schoolTypesWithData.length
  const barHeight = Math.min(60, totalSpacePerType * 0.6)

  // Color lookup from legendItems
  const colorMap: Record<string, string> = {}
  legendItems.forEach(item => {
    colorMap[item.label] = item.color
  })

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="class-retention-mfe__chart"
      role="img"
      aria-label={ariaLabel}
    >
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((tick) => {
        const x = CHART_PADDING.left + xScale(tick)
        return (
          <g key={`grid-${tick}`}>
            <line
              x1={x}
              x2={x}
              y1={CHART_PADDING.top}
              y2={CHART_HEIGHT - CHART_PADDING.bottom}
              className="class-retention-mfe__grid-line"
            />
            <text
              x={x}
              y={CHART_HEIGHT - CHART_PADDING.bottom + 24}
              textAnchor="middle"
              className="class-retention-mfe__axis-label"
            >
              {tick}%
            </text>
          </g>
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
        Anteil Wiederholer (%) {year ? `im Jahr ${year}` : ''}
      </text>
      <text
        x={15}
        y={CHART_HEIGHT / 2}
        textAnchor="middle"
        className="class-retention-mfe__axis-title"
        transform={`rotate(-90 15 ${CHART_HEIGHT / 2})`}
        style={{ fontSize: '16px', fontWeight: 500 }}
      >
        Schulart
      </text>

      {/* Stacked bars by school type */}
      {schoolTypesWithData.map((schoolType, typeIndex) => {
        const typeData = data.filter((d: SegmentData) => d.stype === schoolType)
        const startY = CHART_PADDING.top + typeIndex * (chartInnerHeight / schoolTypesWithData.length) + (chartInnerHeight / schoolTypesWithData.length) * 0.5 - barHeight / 2

        // Sort data to ensure consistent stacking order
        const sortedData = typeData.sort((a, b) => {
          const order = legendItems.map(item => item.label)
          return order.indexOf(a.group) - order.indexOf(b.group)
        })

        let stackX = CHART_PADDING.left

        return (
          <g key={schoolType}>
            {/* School type label */}
            <text
              x={CHART_PADDING.left - 10}
              y={startY + barHeight / 2 + 4}
              textAnchor="end"
              className="class-retention-mfe__axis-label"
              style={{ fontSize: '18px', fontWeight: 600 }}
            >
              {schoolType}
            </text>

            {/* Stacked bar segments */}
            {sortedData.map((datum: SegmentData) => {
              const width = xScale(datum.percentage)
              const color = colorMap[datum.group] || '#999'
              const segmentX = stackX
              stackX += width

              return (
                <g key={`${schoolType}-${datum.group}`}>
                  <rect
                    x={segmentX}
                    y={startY}
                    width={width}
                    height={barHeight}
                    fill={color}
                    opacity={0.85}
                    stroke="white"
                    strokeWidth="1"
                  />
                  {/* Percentage value inside segment */}
                  {width > 25 && (
                    <text
                      x={segmentX + width / 2}
                      y={startY + barHeight / 2 + 4}
                      textAnchor="middle"
                      className="class-retention-mfe__bar-label"
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        fill: 'white',
                        pointerEvents: 'none',
                      }}
                    >
                      {datum.percentage.toFixed(1)}%
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}

/**
 * Legend component for StackedBarChart - displays color swatches and labels
 */
function StackedBarChartLegendComponent({ legendItems, label }: { legendItems: Array<{ label: string; color: string }>; label?: string }) {
  return (
    <div className="class-retention-mfe__chart-legend">
      {label && <div className="class-retention-mfe__legend-label">{label}</div>}
      <ul className="class-retention-mfe__legend-list">
        {legendItems.map((item) => (
          <li key={item.label}>
            <span
              className="class-retention-mfe__legend-swatch"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const StackedBarChart = memo(StackedBarChartComponent)
export const StackedBarChartLegend = memo(StackedBarChartLegendComponent)
