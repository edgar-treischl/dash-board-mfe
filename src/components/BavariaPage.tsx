import { memo, useState } from 'react'
import { bavariaMetrics, regions } from '../data/bavaria.ts'
import { COMMON_STYLES } from '../config/chartConfig.ts'
import { InterpretationBox } from './InterpretationBox.tsx'
import { RegierungsbezirkeMap } from './charts/RegierungsMap.tsx'
import { ViewSwitcher } from './controls/ViewSwitcher.tsx'

type MetricKey = 'schools' | 'students' | 'teachersFTE' | 'avgClassSize'

type BavariaViewProps = {
  selectedMetric?: MetricKey
  onMetricChange?: (metric: MetricKey) => void
}

type ViewType = 'chart' | 'map'

function BavariaViewComponent({
  selectedMetric: propSelectedMetric,
  onMetricChange: propOnMetricChange,
}: BavariaViewProps) {
  const [internalMetric, setInternalMetric] = useState<MetricKey>('students')
  const [view, setView] = useState<ViewType>('chart')
  
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

      <h3 className="class-retention-mfe__stats-header">Nach Regierungsbezirk</h3>

      {/* View selector using semantic nav element */}
      <ViewSwitcher
        options={[
          { key: 'chart', label: 'Balkendiagramm' },
          { key: 'map', label: 'Karte' },
        ]}
        activeKey={view}
        onSelect={(selectedView) => setView(selectedView as ViewType)}
        ariaLabel="Ansichtsauswahl für Regierungsbezirke"
      />

      <section className="class-retention-mfe__explorer-layout">
        <div className="class-retention-mfe__explorer-left">
          {/* Chart Card */}
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
              {view === 'chart' && (
                <svg width="100%" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
                  {/* Title/Label for Y-axis */}
                  <text x="20" y="20" fontSize="13" fontWeight="600" fill="#1f2937">
                    {metricLabels[selectedMetric]}
                  </text>
                  
                  {/* Grid lines and scale labels */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const maxValue = Math.max(...regions.map(r => r.metrics[selectedMetric]))
                    const xPos = 200 + ratio * 600
                    const value = Math.round(maxValue * ratio)
                    
                    return (
                      <g key={`scale-${ratio}`}>
                        <line
                          x1={xPos}
                          y1="50"
                          x2={xPos}
                          y2={50 + sortedRegions.length * 50}
                          stroke="#e5e7eb"
                          strokeDasharray="2,2"
                          opacity="0.5"
                        />
                        <text
                          x={xPos}
                          y={50 + sortedRegions.length * 50 + 20}
                          fontSize="11"
                          fill="#6b7280"
                          textAnchor="middle"
                        >
                          {value.toLocaleString()}
                        </text>
                      </g>
                    )
                  })}
                  
                  {/* Bars and labels */}
                  {sortedRegions.map((region, idx) => {
                    const maxValue = Math.max(...regions.map(r => r.metrics[selectedMetric]))
                    const barWidth = (region.metrics[selectedMetric] / maxValue) * 600
                    const yPos = idx * 50 + 50
                    
                    return (
                      <g key={region.id}>
                        {/* Region label */}
                        <text
                          x="10"
                          y={yPos + 20}
                          fontSize="13"
                          fill="#374151"
                          fontWeight="500"
                        >
                          {region.shortName}
                        </text>
                        
                        {/* Value label above bar */}
                        <text
                          x="200"
                          y={yPos - 8}
                          fontSize="12"
                          fill="#374151"
                          fontWeight="600"
                        >
                          {region.metrics[selectedMetric].toLocaleString()}
                        </text>
                        
                        {/* Bar */}
                        <rect
                          x="200"
                          y={yPos + 3}
                          width={barWidth}
                          height="30"
                          fill={metricColors[selectedMetric]}
                          opacity="0.85"
                          rx="4"
                        />
                      </g>
                    )
                  })}
                  
                  {/* X-axis label */}
                  <text
                    x="500"
                    y={50 + sortedRegions.length * 50 + 50}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    Wert
                  </text>
                </svg>
              )}

              {view === 'map' && (
                <div style={{ padding: '1rem' }}>
                  <RegierungsbezirkeMap selectedMetric={selectedMetric} regions={regions} />
                </div>
              )}
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
