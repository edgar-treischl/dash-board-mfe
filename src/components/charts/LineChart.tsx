import { memo, useMemo, useState } from 'react'
import { scaleLinear, scalePoint } from 'd3-scale'
import { line, curveMonotoneX } from 'd3-shape'
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

function LineChartComponent({
  data,
  minYear,
  maxYear,
}: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint>(null)

  const chartInnerWidth =
    CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right

  const chartInnerHeight =
    CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom

  /*
   * Collect and sort all years appearing in the data.
   */
  const allYears = useMemo(() => {
    const years = new Set<number>()

    data.forEach((schoolTypeData) => {
      schoolTypeData.forEach((d) => {
        years.add(Number(d.year))
      })
    })

    return Array.from(years).sort((a, b) => a - b)
  }, [data])

  /*
   * Map numeric year -> school year label.
   */
  const schoolYearMap = useMemo(() => {
    const map = new Map<number, string>()

    data.forEach((schoolTypeData) => {
      schoolTypeData.forEach((d) => {
        map.set(Number(d.year), d.syear)
      })
    })

    return map
  }, [data])

  /*
   * Maximum value across all series.
   */
  const maxRetention = useMemo(() => {
    let max = 0

    data.forEach((schoolTypeData) => {
      schoolTypeData.forEach((d) => {
        max = Math.max(max, d.number)
      })
    })

    return max
  }, [data])

  /*
   * D3 scales.
   */
  const xScale = useMemo(
    () =>
      scalePoint<number>()
        .domain(allYears)
        .range([
          CHART_PADDING.left,
          CHART_WIDTH - CHART_PADDING.right,
        ])
        .padding(0),
    [allYears],
  )

  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxRetention])
        .range([
          CHART_HEIGHT - CHART_PADDING.bottom,
          CHART_PADDING.top,
        ])
        .nice(),
    [maxRetention],
  )

  /*
   * Y-axis tick values.
   */
  const yTicks = useMemo(
    () => yScale.ticks(4),
    [yScale],
  )

  /*
   * D3 line generator.
   */
  const lineGenerator = useMemo(
    () =>
      line<RetentionDatum>()
        .x((d) => xScale(Number(d.year)) ?? 0)
        .y((d) => yScale(d.number))
        .curve(curveMonotoneX),
    [xScale, yScale],
  )

  const handleMouseEnter = (
    schoolType: SchoolType,
    d: RetentionDatum,
  ) => {
    const x = xScale(Number(d.year))
    const y = yScale(d.number)

    if (x == null) return

    setHoveredPoint({
      schoolType,
      syear: d.syear,
      value: d.number,
      x,
      y,
    })
  }

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="class-retention-mfe__chart"
      role="img"
      aria-label="Liniendiagramm der Klassenwiederholungen im Zeitverlauf nach Schultyp"
    >
      {/* Y-axis grid */}
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
              textAnchor="end"
              className="class-retention-mfe__axis-label class-retention-mfe__axis-label--y"
            >
              {formatNumber(tick)}
            </text>
          </g>
        )
      })}

      {/* X-axis labels */}
      {allYears.map((year) => {
        const x = xScale(year)

        if (x == null) return null

        return (
          <text
            key={`x-${year}`}
            x={x}
            y={CHART_HEIGHT - CHART_PADDING.bottom + 24}
            textAnchor="middle"
            className="class-retention-mfe__axis-label"
          >
            {schoolYearMap.get(year) ?? year}
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

      {/* Axis titles */}
      <text
        x={CHART_WIDTH / 2}
        y={CHART_HEIGHT - 10}
        textAnchor="middle"
        className="class-retention-mfe__axis-title"
        style={{
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        Schuljahr {minYear}/{maxYear}
      </text>

      <text
        x={15}
        y={CHART_HEIGHT / 2}
        textAnchor="middle"
        className="class-retention-mfe__axis-title"
        transform={`rotate(-90 15 ${CHART_HEIGHT / 2})`}
        style={{
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        Anzahl Wiederholungen
      </text>

      {/* Data series */}
      {SCHOOL_TYPES.map((schoolType) => {
        const schoolTypeData = data.get(schoolType) ?? []

        if (!schoolTypeData.length) {
          return null
        }

        return (
          <g key={schoolType}>
            {/* Line */}
            <path
              d={lineGenerator(schoolTypeData) ?? ''}
              stroke={SCHOOL_TYPE_COLORS[schoolType]}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {schoolTypeData.map((d) => {
              const cx = xScale(Number(d.year))

              if (cx == null) return null

              const cy = yScale(d.number)

              const isHovered =
                hoveredPoint?.schoolType === schoolType &&
                hoveredPoint?.syear === d.syear

              return (
                <circle
                  key={`${schoolType}-${d.year}`}
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : 5}
                  fill={SCHOOL_TYPE_COLORS[schoolType]}
                  style={{
                    cursor: 'pointer',
                    transition: 'r 0.2s',
                  }}
                  onMouseEnter={() =>
                    handleMouseEnter(schoolType, d)
                  }
                  onMouseLeave={() =>
                    setHoveredPoint(null)
                  }
                />
              )
            })}
          </g>
        )
      })}

      {/* Tooltip */}
      {hoveredPoint && (
        <Tooltip point={hoveredPoint} />
      )}
    </svg>
  )
}

function Tooltip({
  point,
}: {
  point: NonNullable<HoveredPoint>
}) {
  const tooltipHeight = 50
  const tooltipWidth = 130
  const tooltipPadding = 10

  const showBelow =
    point.y - tooltipHeight - tooltipPadding <
    CHART_PADDING.top

  const tooltipY = showBelow
    ? point.y + tooltipPadding + 10
    : point.y - tooltipHeight - tooltipPadding

  /*
   * Keep the tooltip inside the SVG horizontally.
   */
  const tooltipX = Math.max(
    tooltipWidth / 2,
    Math.min(
      CHART_WIDTH - tooltipWidth / 2,
      point.x,
    ),
  )

  return (
    <g
      pointerEvents="none"
      className="class-retention-mfe__tooltip"
    >
      <rect
        x={tooltipX - tooltipWidth / 2}
        y={tooltipY}
        width={tooltipWidth}
        height={tooltipHeight}
        rx={6}
        fill="white"
        stroke={SCHOOL_TYPE_COLORS[point.schoolType]}
        strokeWidth={2}
        className="class-retention-mfe__tooltip-bg"
      />

      <text
        x={tooltipX}
        y={tooltipY + 16}
        textAnchor="middle"
        className="class-retention-mfe__tooltip-text class-retention-mfe__tooltip-label"
        style={{
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        {point.schoolType}
      </text>

      <text
        x={tooltipX}
        y={tooltipY + 28}
        textAnchor="middle"
        className="class-retention-mfe__tooltip-text class-retention-mfe__tooltip-label"
        style={{
          fontSize: '12px',
          fill: '#666',
          fontWeight: 400,
        }}
      >
        {point.syear}
      </text>

      <text
        x={tooltipX}
        y={tooltipY + 42}
        textAnchor="middle"
        className="class-retention-mfe__tooltip-text"
        style={{
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        {formatNumber(point.value)}
      </text>
    </g>
  )
}

function LineChartLegendComponent() {
  return (
    <div className="class-retention-mfe__chart-legend">
      <div className="class-retention-mfe__legend-label">
        Schultyp
      </div>

      <ul className="class-retention-mfe__legend-list">
        {SCHOOL_TYPES.map((schoolType) => (
          <li key={schoolType}>
            <span
              className="class-retention-mfe__legend-swatch"
              style={{
                backgroundColor:
                  SCHOOL_TYPE_COLORS[schoolType],
              }}
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
