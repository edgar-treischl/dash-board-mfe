import { memo, useState } from 'react'
import { bavariaMetrics, regions } from '../data/bavaria.ts'
import { COMMON_STYLES } from '../config/chartConfig.ts'
import { InterpretationBox } from './InterpretationBox.tsx'
import { RegierungsbezirkeMap } from './charts/RegierungsMap.tsx'
import { ViewSwitcher } from './controls/ViewSwitcher.tsx'
import { SchoolsIcon, PupilsIcon, TeachersIcon, ClassSizeIcon } from '../utils/icons.tsx'


type MetricKey = 'schools' | 'students' | 'teachersFTE' | 'avgClassSize'

type BavariaViewProps = {
  selectedMetric?: MetricKey
  onMetricChange?: (metric: MetricKey) => void
}

type ViewType = 'chart' | 'map' | 'table'

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
    students: 'Schüler und Schülerinnen',
    teachersFTE: 'Lehrkräfte',
    avgClassSize: 'Klassengröße',
  }

  const metricDescriptions: Record<MetricKey, string> = {
    schools: 'Anzahl der Schulen pro Regierungsbezirk',
    students: 'Gesamtzahl der Schüler und Schülerinnen',
    teachersFTE: 'Lehrkräfte in Vollzeitäquivalenten',
    avgClassSize: 'Durchschnittliche Klassengröße',
  }

  const metricColors: Record<MetricKey, string> = {
    schools: '#3b82f6',
    students: '#ef4444',
    teachersFTE: '#10b981',
    avgClassSize: '#f59e0b',
  }

  const metricIcons: Record<MetricKey, React.ReactNode> = {
    schools: <SchoolsIcon className="class-retention-mfe__grid-icon" />,
    students: <PupilsIcon className="class-retention-mfe__grid-icon" />,
    teachersFTE: <TeachersIcon className="class-retention-mfe__grid-icon" />,
    avgClassSize: <ClassSizeIcon className="class-retention-mfe__grid-icon" />,
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
      {/* Metric Selection Grid Section */}
      <section className="class-retention-mfe__selection-section" style={{ width: '100%', maxWidth: 'none' }}>
        <h2 className="class-retention-mfe__selection-title">Indikator</h2>
        <small>Bitte wählen Sie einen Indikator zur Analyse aus.</small>
        <div className="class-retention-mfe__selection-grid">
          {(Object.keys(metricLabels) as MetricKey[]).map((key) => (
            <button
              key={key}
              className={`class-retention-mfe__level-select-btn ${selectedMetric === key ? 'is-active' : ''}`}
              onClick={() => onMetricChange(key)}
            >
              <div className="class-retention-mfe__grid-icon-wrapper">
                {metricIcons[key]}
              </div>
              <strong>{metricLabels[key]}</strong>
              <span className="class-retention-mfe__level-desc">{metricDescriptions[key]}</span>
            </button>
          ))}
        </div>
      </section>

      <section 
        style={{
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          gap: '20px',
          marginBottom: '16px',
          alignItems: 'stretch',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          {/* Chart Card */}
          <div className="class-retention-mfe__chart-card">
            {/* Card Header */}
            <div className="class-retention-mfe__story-header">
              <h3 className="class-retention-mfe__story-heading"> {metricLabels[selectedMetric]}</h3>
            </div>

            {/* View selector using semantic nav element */}
            <ViewSwitcher
              options={[
                { key: 'chart', label: 'Balkendiagramm' },
                { key: 'map', label: 'Karte' },
                { key: 'table', label: 'Tabelle' },
              ]}
              activeKey={view}
              onSelect={(selectedView) => setView(selectedView as ViewType)}
              ariaLabel="Ansichtsauswahl für Regierungsbezirke"
              variant="underline"
              />
            <div className="class-retention-mfe__card-heading"></div>

            <div className="class-retention-mfe__chart-frame">
              {view === 'chart' && (
                <svg width="100%" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
                  
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
                          fontSize="14"
                          fill="#6b7280"
                          textAnchor="middle"
                          fontWeight="500"
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
                          fontSize="18"
                          fill="#374151"
                          fontWeight="500"
                        >
                          {region.shortName}
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
                         
                        {/* Value label on top of bar (end of bar) */}
                        <text
                          x={200 + barWidth + 8}
                          y={yPos + 20}
                          fontSize="16"
                          fill="#374151"
                          fontWeight="600"
                          dominantBaseline="middle"
                        >
                          {region.metrics[selectedMetric].toLocaleString()}
                        </text>
                      </g>
                    )
                  })}
                  
                  {/* X-axis label */}
                  <text
                    x="500"
                    y={50 + sortedRegions.length * 50 + 50}
                    fontSize="16"
                    fill="#6b7280"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    Wert
                  </text>
                </svg>
              )}

              {view === 'map' && (
                <RegierungsbezirkeMap selectedMetric={selectedMetric} regions={regions} />
              )}

              {view === 'table' && (
                <div style={{ padding: '1rem', overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px',
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Regierungsbezirk</th>
                        {(Object.keys(metricLabels) as MetricKey[]).map((key) => (
                          <th key={key} style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#1f2937' }}>
                            {metricLabels[key]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {regions.map((region, idx) => (
                        <tr 
                          key={region.id} 
                          style={{ 
                            backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                            borderBottom: '1px solid #e5e7eb',
                          }}
                        >
                          <td style={{ padding: '12px', fontWeight: '500', color: '#374151' }}>
                            {region.shortName}
                          </td>
                          {(Object.keys(metricLabels) as MetricKey[]).map((key) => (
                            <td 
                              key={key} 
                              style={{ 
                                padding: '12px', 
                                textAlign: 'right', 
                                color: '#4b5563',
                                fontVariantNumeric: 'tabular-nums',
                              }}
                            >
                              {typeof region.metrics[key] === 'number' && region.metrics[key] % 1 !== 0
                                ? region.metrics[key].toFixed(1)
                                : region.metrics[key].toLocaleString()
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <InterpretationBox tabs={interpretationTabs} defaultTab="befund" />
        </div>
      </section>

            {/* Bavaria-wide metrics */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <h3 className="class-retention-mfe__stats-header">Insgesamt</h3>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '12px',
            width: '100%',
            background: 'var(--class-retention-surface)',
            border: '1px solid var(--class-retention-border)',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: 'var(--class-retention-shadow)',
          }}
          aria-label="Bayernweite Kennzahlen"
        >
          {(Object.keys(bavariaMetrics) as MetricKey[]).map((key) => (
            <section key={key} className="class-retention-mfe__stat-card">
              <span className="class-retention-mfe__stat-type">{metricLabels[key]}</span>
              <strong>{bavariaMetrics[key].toLocaleString()}</strong>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}

export const BavariaView = memo(BavariaViewComponent)
