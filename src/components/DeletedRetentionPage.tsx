import { memo, useState } from 'react'
import { bavariaMetrics, regions } from '../data/bavaria.ts'
import { COMMON_STYLES } from '../config/chartConfig.ts'
import { InterpretationBox } from './InterpretationBox.tsx'

type MetricKey = 'schools' | 'students' | 'teachersFTE' | 'avgClassSize'

type BavariaViewProps = {
  selectedMetric?: MetricKey
  onMetricChange?: (metric: MetricKey) => void
}

function BavariaViewComponent({
  selectedMetric: propSelectedMetric,
  onMetricChange: propOnMetricChange,
}: BavariaViewProps) {
  const [internalMetric, setInternalMetric] = useState<MetricKey>('students')
  
  const selectedMetric = propSelectedMetric || internalMetric
  const onMetricChange = propOnMetricChange || setInternalMetric

  const metricLabels: Record<MetricKey, string> = {
    schools: 'Schulen',
    students: 'Schüler',
    teachersFTE: 'Lehrkräfte (VZÄ)',
    avgClassSize: 'Ø Klassengröße',
  }

  const metricColors: Record<MetricKey, string> = {
    schools: '#3b82f6',
    students: '#ef4444',
    teachersFTE: '#10b981',
    avgClassSize: '#f59e0b',
  }

  // Sort regions by selected metric value
  const sortedRegions = [...regions].sort((a, b) => {
    return b.metrics[selectedMetric] - a.metrics[selectedMetric]
  })

  // Build interpretation tabs
  const interpretationTabs = {
    befund: {
      label: 'Befund',
      content: (
        <div>
          <p className="class-retention-mfe__story-text">
            Die Verteilung der Bildungsressourcen in Bayern nach Regierungsbezirken zeigt deutliche regionale Unterschiede. Die Metriken umfassen Schulen, Schülerinnen und Schüler, Lehrkräfte (Vollzeitäquivalente) und durchschnittliche Klassengröße.
          </p>
          <ul className="class-retention-mfe__story-text" style={COMMON_STYLES.bulletList}>
            <li style={COMMON_STYLES.listItem}>
              <strong>{sortedRegions[0].shortName}</strong> hat mit {sortedRegions[0].metrics[selectedMetric].toLocaleString()} die höchste Anzahl an <strong>{metricLabels[selectedMetric]}</strong>.
            </li>
            <li style={COMMON_STYLES.listItem}>
              Bayern gesamt: {bavariaMetrics[selectedMetric].toLocaleString()} {metricLabels[selectedMetric]}
            </li>
          </ul>
        </div>
      ),
    },
    hinweis: {
      label: 'Hinweis',
      content: (
        <p className="class-retention-mfe__story-text class-retention-mfe__story-text--italic">
          Die Daten basieren auf den sieben Regierungsbezirken Bayerns: Oberbayern, Niederbayern, Oberpfalz, Oberfranken, Mittelfranken, Unterfranken und Schwaben. Die Unterschiede spiegeln sowohl die Bevölkerungsdichte als auch die Bildungsinfrastruktur wider.
        </p>
      ),
    },
  }

  return (
    <>
      {/* Bavaria-wide metrics */}
      <section className="class-retention-mfe__stats-section">
        <h3 className="class-retention-mfe__stats-header">Bayern Gesamt</h3>
        <div className="class-retention-mfe__stats-row" aria-label="Bayernweite Kennzahlen">
          {(Object.keys(bavariaMetrics) as MetricKey[]).map((key) => (
            <section key={key} className="class-retention-mfe__stat-card">
              <span className="class-retention-mfe__stat-type">{metricLabels[key]}</span>
              <strong>{bavariaMetrics[key].toLocaleString()}</strong>
            </section>
          ))}
        </div>
      </section>

      <section className="class-retention-mfe__explorer-layout">
        <div className="class-retention-mfe__explorer-left">
          {/* Chart */}
          <div className="class-retention-mfe__chart-card">
            <div className="class-retention-mfe__card-heading"></div>

            <div className="class-retention-mfe__controls-section">
              <label htmlFor="metric-select" style={{ marginRight: '8px' }}>Kennzahl:</label>
              <select
                id="metric-select"
                value={selectedMetric}
                onChange={(e) => onMetricChange(e.target.value as MetricKey)}
                style={{
                  padding: '6px 12px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                }}
              >
                {(Object.keys(metricLabels) as MetricKey[]).map((key) => (
                  <option key={key} value={key}>
                    {metricLabels[key]}
                  </option>
                ))}
              </select>
            </div>

            <div className="class-retention-mfe__chart-frame">
              {/* Simple bar chart for regions */}
              <svg width="100%" height="400" style={{ overflow: 'visible' }}>
                {sortedRegions.map((region, idx) => {
                  const maxValue = Math.max(...regions.map(r => r.metrics[selectedMetric]))
                  const barWidth = (region.metrics[selectedMetric] / maxValue) * 80 // 80% max width
                  
                  return (
                    <g key={region.id} transform={`translate(0, ${idx * 50 + 20})`}>
                      <text x="0" y="15" fontSize="14" fill="#374151">
                        {region.shortName}
                      </text>
                      <rect
                        x="150"
                        y="0"
                        width={`${barWidth}%`}
                        height="30"
                        fill={metricColors[selectedMetric]}
                        opacity="0.8"
                      />
                      <text x={`calc(150px + ${barWidth}% + 8px)`} y="20" fontSize="12" fill="#6b7280">
                        {region.metrics[selectedMetric].toLocaleString()}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        </div>

        <div className="class-retention-mfe__explorer-right">
          <InterpretationBox tabs={interpretationTabs} defaultTab="befund" />
        </div>
      </section>
    </>
  )
}

export const BavariaView = memo(BavariaViewComponent)
