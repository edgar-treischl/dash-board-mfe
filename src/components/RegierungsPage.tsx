import { memo, useState } from 'react'
import { bavariaMetrics, regions } from '../data/bavaria.ts'
import { COMMON_STYLES } from '../config/chartConfig.ts'
import { InterpretationBox } from './InterpretationBox.tsx'
import { OfficesLeafletMap } from './charts/OfficesLeafletMap.tsx'
import { ViewSwitcher } from './controls/ViewSwitcher.tsx'
import { RegionIcon } from './controls/RegionIcon.tsx'
import { SchoolsIcon, PupilsIcon, TeachersIcon, ClassSizeIcon } from '../utils/icons.tsx'

type MetricKey = 'schools' | 'students' | 'teachersFTE' | 'avgClassSize'

type ViewType = 'table' | 'map'

function RegierungsViewComponent() {
  const [view, setView] = useState<ViewType>('table')
  const [selectedRegion, setSelectedRegion] = useState<string>(regions[0].id)

  // Find the currently selected region object
  const currentRegion = regions.find(r => r.id === selectedRegion) || regions[0]

  const metricLabels: Record<MetricKey, string> = {
    schools: 'Schulen',
    students: 'Schüler und Schülerinnen',
    teachersFTE: 'Lehrkräfte (VZÄ)',
    avgClassSize: 'Klassengröße (Ø aller Schularten)',
  }

  const metricDescriptions: Record<MetricKey, string> = {
    schools: 'Anzahl der Schulen',
    students: 'Gesamtzahl der Schüler und Schülerinnen',
    teachersFTE: 'Lehrkräfte in Vollzeitäquivalenten',
    avgClassSize: 'Durchschnittliche Klassengröße',
  }

  const metricIcons: Record<MetricKey, React.ReactNode> = {
    schools: <SchoolsIcon className="class-retention-mfe__grid-icon" />,
    students: <PupilsIcon className="class-retention-mfe__grid-icon" />,
    teachersFTE: <TeachersIcon className="class-retention-mfe__grid-icon" />,
    avgClassSize: <ClassSizeIcon className="class-retention-mfe__grid-icon" />,
  }

  // Build interpretation tabs
  const interpretationTabs = {
    befund: {
      label: 'Befund',
      content: (
        <div>
          <p className="class-retention-mfe__story-text">
            Die Verteilung der Bildungsressourcen in Bayern nach Regierungsbezirken zeigt deutliche regionale Unterschiede. Die dargestellten Daten umfassen Schulen, Schülerinnen und Schüler sowie Lehrkräfte (Vollzeitäquivalente).
          </p>
          <ul className="class-retention-mfe__story-text" style={COMMON_STYLES.bulletList}>
            <li style={COMMON_STYLES.listItem}>
              Vergleichen Sie die Staatlichen Schulämter der einzelnen Regionen in der Tabelle.
            </li>
            <li style={COMMON_STYLES.listItem}>
              Bayern gesamt: {bavariaMetrics.students.toLocaleString()} Schüler und Schülerinnen, {bavariaMetrics.schools.toLocaleString()} Schulen
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
        
        {/* Region Selection Header */}
        <div style={{
          padding: '24px 24px 20px 24px',
          borderBottom: '1px solid var(--class-retention-border)',
          background: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.02), transparent)'
        }}>
          <h1 className="class-retention-mfe__selection-title" style={{ marginBottom: '6px' }}>Regierungsbezirke</h1>
          <small style={{ color: 'var(--class-retention-text)', fontSize: '0.875rem' }}>Bitte wählen Sie einen Regierungsbezirk zur Analyse.</small>
        </div>

        {/* Region Selection Grid */}
        <div style={{ padding: '24px' }}>
          <div 
            className="class-retention-mfe__selection-grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px'
            }}
          >
            {regions.map((region) => (
              <button
                key={region.id}
                className={`class-retention-mfe__level-select-btn ${selectedRegion === region.id ? 'is-active' : ''}`}
                onClick={() => setSelectedRegion(region.id)}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '12px 8px',
                  minHeight: 'auto'
                }}
              >
                <RegionIcon regionId={region.id} width={48} height={48} />
                <strong style={{ fontSize: '0.85rem', textAlign: 'center', lineHeight: '1.2' }}>
                  {region.shortName}
                </strong>
              </button>
            ))}
          </div>
        </div>

        {/* Region-specific Metrics Section */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--class-retention-border)' }}>
          <div style={{
            padding: '0 0 20px 0',
          }}>
            <h2 className="class-retention-mfe__selection-title" style={{ marginBottom: '6px' }}>{currentRegion.shortName} in Zahlen</h2>
            <small style={{ color: 'var(--class-retention-text)', fontSize: '0.875rem' }}>Kennzahlen für den ausgewählten Regierungsbezirk</small>
          </div>

          <div className="class-retention-mfe__selection-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {(Object.keys(metricLabels) as MetricKey[]).map((key) => (
              <div
                key={key}
                style={{
                  background: 'var(--class-retention-bg)',
                  border: '1px solid var(--class-retention-border)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div className="class-retention-mfe__grid-icon-wrapper">
                  {metricIcons[key]}
                </div>
                <strong style={{ fontSize: '0.875rem', textAlign: 'center' }}>{metricLabels[key]}</strong>
                <span className="class-retention-mfe__level-desc" style={{ fontSize: '0.75rem', opacity: 0.7 }}>{metricDescriptions[key]}</span>
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px 12px',
                  background: 'rgba(37, 99, 235, 0.08)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--class-retention-primary)',
                  transition: 'all 0.2s ease'
                }}>
                  {currentRegion.metrics[key].toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart/Table and Interpretation Section */}
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
                  <h3 className="class-retention-mfe__story-heading">Schulämter in {currentRegion.shortName}</h3>
                </div>

                {/* View selector using semantic nav element */}
                <ViewSwitcher
                  options={[
                    { key: 'table', label: 'Überblick' },
                    { key: 'map', label: 'Karte' },
                  ]}
                  activeKey={view}
                  onSelect={(selectedView) => setView(selectedView as ViewType)}
                  ariaLabel="Ansichtsauswahl für Regierungsbezirke"
                  variant="underline"
                />
                <div className="class-retention-mfe__card-heading"></div>

                <div className="class-retention-mfe__chart-frame">
                  {view === 'map' && (
                    <OfficesLeafletMap
                      selectedRegionId={selectedRegion}
                      regions={regions}
                    />
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
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Staatliches Schulamt</th>
                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#1f2937' }}>
                              {metricLabels['schools']}
                            </th>
                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#1f2937' }}>
                              {metricLabels['students']}
                            </th>
                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#1f2937' }}>
                              {metricLabels['teachersFTE']}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRegion.schoolOffices.map((office, idx) => (
                            <tr 
                              key={idx} 
                              style={{ 
                                backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                                borderBottom: '1px solid #e5e7eb',
                              }}
                            >
                              <td style={{ padding: '12px', fontWeight: '500', color: '#374151' }}>
                                {office.name}
                              </td>
                              <td 
                                style={{ 
                                  padding: '12px', 
                                  textAlign: 'right', 
                                  color: '#4b5563',
                                  fontVariantNumeric: 'tabular-nums',
                                }}
                              >
                                {office.schools.toLocaleString()}
                              </td>
                              <td 
                                style={{ 
                                  padding: '12px', 
                                  textAlign: 'right', 
                                  color: '#4b5563',
                                  fontVariantNumeric: 'tabular-nums',
                                }}
                              >
                                {office.students.toLocaleString()}
                              </td>
                              <td 
                                style={{ 
                                  padding: '12px', 
                                  textAlign: 'right', 
                                  color: '#4b5563',
                                  fontVariantNumeric: 'tabular-nums',
                                }}
                              >
                                {office.teachersFTE.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          <tr style={{ backgroundColor: '#f0f9ff', borderTop: '2px solid #d1d5db', fontWeight: '600' }}>
                            <td style={{ padding: '12px', color: '#1f2937' }}>{currentRegion.shortName} (Gesamt)</td>
                            <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937', fontVariantNumeric: 'tabular-nums' }}>
                              {currentRegion.metrics.schools.toLocaleString()}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937', fontVariantNumeric: 'tabular-nums' }}>
                              {currentRegion.metrics.students.toLocaleString()}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937', fontVariantNumeric: 'tabular-nums' }}>
                              {currentRegion.metrics.teachersFTE.toLocaleString()}
                            </td>
                          </tr>
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

export const RegierungsView = memo(RegierungsViewComponent)
