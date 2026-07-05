import { memo, useState } from 'react'
import { bavariaMetrics, regions } from '../data/bavaria.ts'
import { COMMON_STYLES } from '../config/chartConfig.ts'
import { InterpretationBox } from './InterpretationBox.tsx'
import { RegierungsbezirkeMap } from './charts/RegierungsMap.tsx'
import { ViewSwitcher } from './controls/ViewSwitcher.tsx'
import { SchoolsIcon, PupilsIcon, TeachersIcon, ClassSizeIcon } from '../utils/icons.tsx'


type MetricKey = 'students' | 'avgClassSize' | 'teachersFTE' | 'schools'


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
    students: 'Schüler und Schülerinnen',
    avgClassSize: 'Klassengröße',
    teachersFTE: 'Lehrkräfte',
    schools: 'Schulen',
  }

  const metricDescriptions: Record<MetricKey, string> = {
    schools: 'Anzahl der Schulen',
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
    <div className="class-retention-mfe__bavaria-container" style={{ width: '100%', margin: '0', padding: '24px', boxSizing: 'border-box' }}>
      
      {/* Main Card Container */}
      <div style={{
        background: 'var(--class-retention-surface)',
        border: '1px solid var(--class-retention-border)',
        borderRadius: '18px',
        boxShadow: 'var(--class-retention-shadow)',
        overflow: 'hidden'
      }}>
        
        {/* Selection Grid Header */}
        <div style={{
          padding: '24px 24px 20px 24px',
          borderBottom: '1px solid var(--class-retention-border)',
          background: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.02), transparent)'
        }}>
          <h1 className="class-retention-mfe__selection-title" style={{ marginBottom: '6px' }}>Bayern im Überblick</h1>
          <small style={{ color: 'var(--class-retention-text)', fontSize: '0.875rem' }}>Wählen Sie einen Indikator zur Analyse der bayerischen Regierungsbezirke.</small>
        </div>

        {/* Selection Grid */}
        <div style={{ padding: '24px' }}>
          <div className="class-retention-mfe__selection-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
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
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px 12px',
                  background: selectedMetric === key ? 'rgba(37, 99, 235, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                  borderRadius: '8px',
                  fontSize: '0.975rem',
                  fontWeight: '600',
                  color: selectedMetric === key ? 'var(--class-retention-primary)' : 'var(--class-retention-text)',
                  transition: 'all 0.2s ease'
                }}>
                  Bayern: {bavariaMetrics[key].toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>   

        {/* Graph/Map Section */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--class-retention-border)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60% 40%',
              gap: '20px',
              alignItems: 'stretch',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
              {/* Chart Card */}
              <div style={{
                border: '1px solid var(--class-retention-border)',
                borderRadius: '12px',
                background: 'var(--class-retention-bg)',
                overflow: 'hidden'
              }}>
            {/* Card Header */}
            <div className="class-retention-mfe__story-header">
              <h3 className="class-retention-mfe__story-heading">{metricLabels[selectedMetric]} nach Regierungsbezirk</h3>
            </div>

            {/* View selector using semantic nav element */}
            <ViewSwitcher
              options={[
                { key: 'chart', label: 'Diagramm' },
                { key: 'map', label: 'Karte' },
                { key: 'table', label: 'Daten' },
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

          {/* Interpretation Container - Right column of grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <InterpretationBox tabs={interpretationTabs} defaultTab="befund" />
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export const BavariaView = memo(BavariaViewComponent)
