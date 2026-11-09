import { type ChartGroup, STUFEN_COLORS, STUFEN_LABEL_COLORS, formatPercentage } from '../iqb.ts'
import './StackedBarChart.css'

type StackedBarChartProps = {
  groups: ChartGroup[]
  showLegend?: boolean
}

export function StackedBarChart({ groups, showLegend = true }: StackedBarChartProps) {
  if (groups.length === 0) {
    return <div className="chart-empty">Keine Daten verfügbar</div>
  }

  return (
    <div className="stacked-bar-chart">
      <div className="chart-bars">
        {groups.map((group, groupIdx) => {
          // Calculate cumulative percentages for positioning
          let cumulative = 0
          const bars = group.data.map((item) => {
            const bar = {
              stufe: item.stufe,
              percentage: item.percentage,
              start: cumulative,
              width: item.percentage,
            }
            cumulative += item.percentage
            return bar
          })

          return (
            <div key={groupIdx} className="chart-row">
              <div className="chart-label">{group.label}</div>
              <div className="chart-bar-container">
                {bars.map((bar, barIdx) => (
                  <div
                    key={barIdx}
                    className="chart-bar-segment"
                    style={{
                      width: `${bar.width}%`,
                      backgroundColor: STUFEN_COLORS[bar.stufe],
                    }}
                  >
                    <span
                      className="chart-bar-label"
                      style={{
                        color: STUFEN_LABEL_COLORS[bar.stufe],
                      }}
                    >
                      {formatPercentage(bar.percentage)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {showLegend && (
        <div className="chart-legend">
          <div className="legend-title">Kompetenzstufe:</div>
          <div className="legend-items">
            {['V', 'IV', 'III', 'II', 'Ib', 'Ia'].map((stufe) => (
              <div key={stufe} className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: STUFEN_COLORS[stufe as keyof typeof STUFEN_COLORS] }}
                />
                <span>{stufe}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
