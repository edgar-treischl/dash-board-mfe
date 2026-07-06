import { memo } from 'react'
import {
  CHART_HEIGHT,
  CHART_PADDING,
  CHART_WIDTH,
  formatPercent,
  SCHOOL_TYPE_COLORS,
  type SchoolType,
} from '../../retention'

type BarData = {
  type: SchoolType
  count: number
  percent: number
}

type BarPlotProps = {
  data: BarData[]
  year: string
  maxPercent?: number
}

/**
 * Horizontal bar chart component for displaying retention rates by school type
 * 
 * @param data - Array of school type data with percentages
 * @param year - School year for display in axis label
 * @param maxPercent - Optional max percent for x-axis scale (defaults to max of data or 50)
 */
function BarPlotComponent({ data, year, maxPercent: customMaxPercent }: BarPlotProps) {
  const chartInnerWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
  
  // Calculate bar dimensions
  const maxPercent = customMaxPercent ?? Math.max(...data.map(d => d.percent), 50)
  const xScale = (value: number) => (value / maxPercent) * chartInnerWidth
  const barHeight = 50
  const barSpacing = 20

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="class-retention-mfe__chart"
      role="img"
      aria-label={`Balkendiagramm der Wiederholungsquoten für ${year}`}
    >
      {/* Grid lines */}
      {[0, 10, 20, 30, 40, 50].map((tick) => {
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
        Wiederholungsquote (%) im Jahr {year}
      </text>
      <text
        x={15}
        y={CHART_HEIGHT / 2}
        textAnchor="middle"
        className="class-retention-mfe__axis-title"
        transform={`rotate(-90 15 ${CHART_HEIGHT / 2})`}
        style={{ fontSize: '16px', fontWeight: 500 }}
      >
        Schultyp
      </text>

      {/* Bars */}
      {data.map((item, index) => {
        const y = CHART_PADDING.top + index * (barHeight + barSpacing)
        const width = xScale(item.percent)

        return (
          <g key={item.type}>
            <rect
              x={CHART_PADDING.left}
              y={y}
              width={width}
              height={barHeight}
              fill={SCHOOL_TYPE_COLORS[item.type]}
              opacity={0.8}
            />
            <text
              x={CHART_PADDING.left - 10}
              y={y + barHeight / 2 + 5}
              textAnchor="end"
              className="class-retention-mfe__axis-label"
              style={{ fontSize: '18px', fontWeight: 600 }}
            >
              {item.type}
            </text>
            <text
              x={CHART_PADDING.left + width + 10}
              y={y + barHeight / 2 + 5}
              className="class-retention-mfe__bar-label"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              {formatPercent(item.percent)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export const BarPlot = memo(BarPlotComponent)
