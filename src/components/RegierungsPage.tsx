import { memo, useState } from 'react'
import { bavariaMetrics, regionMetrics, schoolOffices } from '../data/bavaria'
import { COMMON_STYLES } from '../config/chartConfig'
import { InterpretationBox } from './InterpretationBox'
import { OfficesLeafletMap } from './charts/OfficesLeafletMap'
import { RegionMapSVG } from './charts/RegionMapSVG'
import { ViewSwitcher } from './controls/ViewSwitcher'
import { RegionIcon } from './controls/RegionIcon'
import { SchoolsIcon, PupilsIcon, ClassSizeIcon, StudentTeacherRelationIcon, GlobeIcon } from '../utils/icons'

type MetricKey = 'students_percent' | 'avgClassSize' | 'schools' |  'studentTeacherRatio' | 'teachersFTE' | 'migrantPercent'

type ViewType = 'map' | 'table'
type TabType = 'regierungsbezirke' | 'mittelfranken'

function RegierungsViewComponent() {
  // Sort metrics alphabetically by name for consistent display
  const sortedMetrics = [...regionMetrics].sort((a, b) => a.shortName.localeCompare(b.shortName))
  const [view, setView] = useState<ViewType>('map')
  const [activeTab, setActiveTab] = useState<TabType>('regierungsbezirke')
  const [selectedRegion, setSelectedRegion] = useState<string>(sortedMetrics[0].id)
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('students_percent')

  // Find the currently selected region object
  const currentRegion = sortedMetrics.find(r => r.id === selectedRegion) || sortedMetrics[0]
  
  // Get school offices for the selected region
  const currentOffices = schoolOffices.filter(o => o.regionId === selectedRegion)

  const metricLabels: Record<MetricKey, string> = {
    students_percent: 'Schülerschaft',
    migrantPercent: 'Migrationshintergrund',
    teachersFTE: 'Lehrkräfte',
    studentTeacherRatio: 'Relation',
    avgClassSize: 'Klassengröße',
    schools: 'Schulen',
    
    
  }

  const metricDescriptions: Record<MetricKey, string> = {
    students_percent: 'Gesamtzahl der SuS',
    migrantPercent: 'Anteil der SuS mit Migrationshintergrund',
    teachersFTE: 'Lehrkräfte (Vollzeitäquivalente)',
    studentTeacherRatio: 'Schüler-Lehrer-Relation',
    avgClassSize: 'Durchschnittliche Klassengröße',
    schools: 'Anzahl der Schulen',
  }

  // Format metric value for display
  const formatMetricValue = (key: MetricKey, value: number): string => {
    if (key === 'studentTeacherRatio' || key === 'avgClassSize') return value.toFixed(2)
    if (key === 'migrantPercent') return value.toFixed(2) + '%'
    return value.toLocaleString()
  }

  const metricIcons: Record<MetricKey, React.ReactNode> = {
    schools: <SchoolsIcon className="bydash-mfe__grid-icon" />,
    students_percent: <PupilsIcon className="bydash-mfe__grid-icon" />,
    studentTeacherRatio: <StudentTeacherRelationIcon className="bydash-mfe__grid-icon" />,
    avgClassSize: <ClassSizeIcon className="bydash-mfe__grid-icon" />,
    teachersFTE: <GlobeIcon className="bydash-mfe__grid-icon" />,
    migrantPercent: <GlobeIcon className="bydash-mfe__grid-icon" />,
  }

  // Build interpretation tabs
  const interpretationTabs = {
    befund: {
      label: 'Befund',
      content: (
        <div>
          <p className="bydash-mfe__story-text">
            Die Verteilung der Bildungsressourcen in Bayern nach Regierungsbezirken zeigt deutliche regionale Unterschiede. Die dargestellten Daten umfassen Schulen, Schülerinnen und Schüler sowie Lehrkräfte (Vollzeitäquivalente).
          </p>
          <ul className="bydash-mfe__story-text" style={COMMON_STYLES.bulletList}>
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
        <p className="bydash-mfe__story-text bydash-mfe__story-text--italic">
          Die Daten basieren auf den sieben Regierungsbezirken Bayerns: Oberbayern, Niederbayern, Oberpfalz, Oberfranken, Mittelfranken, Unterfranken und Schwaben. Die Unterschiede spiegeln sowohl die Bevölkerungsdichte als auch die Bildungsinfrastruktur wider.
        </p>
      ),
    },
  }

  return (
    <div className="bydash-mfe__bavaria-container" style={{ width: '100%', margin: '0', padding: '24px', boxSizing: 'border-box' }}>
      
      {/* Main Card Container */}
      <div style={{
        background: 'var(--bydash-surface)',
        border: '1px solid var(--bydash-border)',
        borderRadius: '18px',
        boxShadow: 'var(--bydash-shadow)',
        overflow: 'hidden'
      }}>
        
        {/* Tab Navigation */}
        <nav style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '2px solid var(--bydash-border)',
          padding: '0 24px',
        }}>
          {[
            { key: 'regierungsbezirke' as const, label: 'Regierungsbezirke' },
            { key: 'mittelfranken' as const, label: 'Schulämter in Mittelfranken' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.key ? '3px solid var(--bydash-primary)' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: activeTab === tab.key ? '600' : '500',
                fontSize: '0.95rem',
                color: activeTab === tab.key ? 'var(--bydash-primary)' : 'var(--bydash-text)',
                transition: 'all 0.2s ease',
                marginBottom: '-2px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Region Selection Header */}
        <div style={{
          padding: '24px 24px 20px 24px',
          borderBottom: '1px solid var(--bydash-border)',
          background: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.02), transparent)'
        }}>
          <h1 className="bydash-mfe__selection-title" style={{ marginBottom: '6px' }}>
            {activeTab === 'regierungsbezirke' ? 'Regierungsbezirke' : 'Schulämter in Mittelfranken'}
          </h1>
          <small style={{ color: 'var(--bydash-text)', fontSize: '0.875rem' }}>
            {activeTab === 'regierungsbezirke' 
              ? 'Bitte wählen Sie einen Regierungsbezirk zur Analyse.'
              : 'Schulämter in der Region Mittelfranken'}
          </small>
        </div>

        {/* Region Selection Grid */}
        <div style={{ padding: '24px' }}>
          <div 
            className="bydash-mfe__selection-grid"
            style={{
              gridTemplateColumns: activeTab === 'mittelfranken' 
                ? 'repeat(auto-fit, minmax(120px, 1fr))' 
                : 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px'
            }}
          >
            {(activeTab === 'mittelfranken' 
              ? sortedMetrics.filter(r => r.id === 'mittelfranken')
              : sortedMetrics
            ).map((region) => (
              <button
                key={region.id}
                className={`bydash-mfe__level-select-btn ${selectedRegion === region.id ? 'is-active' : ''}`}
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

        {/* Indicators / Feature Grid Section */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--bydash-border)' }}>
          <div style={{
            padding: '0 0 20px 0',
          }}>
            <h2 className="bydash-mfe__selection-title" style={{ marginBottom: '6px' }}>Indikatoren</h2>
            <small style={{ color: 'var(--bydash-text)', fontSize: '0.875rem' }}>Wählen Sie einen Indikator zur Visualisierung</small>
          </div>

          <div 
            className="bydash-mfe__metrics-grid" 
            style={{ 
              gap: '16px', 
              marginBottom: '24px' 
            }}
          >
            {(Object.keys(metricLabels) as MetricKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                style={{
                  background: selectedMetric === key ? 'rgba(37, 99, 235, 0.02)' : 'var(--bydash-bg)',
                  border: selectedMetric === key ? '2px solid var(--bydash-primary)' : '1px solid var(--bydash-border)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedMetric === key ? '0 0 0 2px rgba(37, 99, 235, 0.1)' : 'none',
                }}
              >
                <div className="bydash-mfe__grid-icon-wrapper" style={{ width: '48px', height: '48px' }}>
                  {metricIcons[key]}
                </div>
                <strong style={{ fontSize: '1.0rem', textAlign: 'center', lineHeight: '1.3' }}>{metricLabels[key]}</strong>
                <span className="bydash-mfe__level-desc" style={{ fontSize: '0.9rem', opacity: 0.7, textAlign: 'center' }}>{metricDescriptions[key]}</span>
                <div style={{ 
                  marginTop: '8px', 
                  padding: '12px 16px',
                  background: 'rgba(37, 99, 235, 0.08)',
                  borderRadius: '8px',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  color: 'var(--bydash-primary)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}>
                  {formatMetricValue(key, currentRegion[key])}
                </div>
              </button>
            ))}
          </div>

          {/* Info text for selected metric */}
        </div>

        {/* Regional Distribution Map */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--bydash-border)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60% 40%',
              gap: '20px',
              alignItems: 'stretch',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
              {/* Region Map Card */}
              <div style={{
                border: '1px solid var(--bydash-border)',
                borderRadius: '12px',
                background: 'var(--bydash-bg)',
                overflow: 'hidden'
              }}>
                {/* Card Header */}
                <div className="bydash-mfe__story-header">
                  <h3 className="bydash-mfe__story-heading">Landkreise in {currentRegion.shortName} - {metricLabels[selectedMetric]}</h3>
                </div>
                <div className="bydash-mfe__card-heading"></div>

                <div className="bydash-mfe__chart-frame">
                  <RegionMapSVG
                    selectedMetric={selectedMetric}
                    selectedRegion={selectedRegion}
                    regions={sortedMetrics}
                  />
                </div>
              </div>
            </div>

            {/* Interpretation Container - Right column of grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InterpretationBox tabs={interpretationTabs} defaultTab="befund" />
            </div>
          </div>
        </div>

        {/* Chart/Table and Interpretation Section */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--bydash-border)' }}>
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
                border: '1px solid var(--bydash-border)',
                borderRadius: '12px',
                background: 'var(--bydash-bg)',
                overflow: 'hidden'
              }}>
                {/* Card Header */}
                <div className="bydash-mfe__story-header">
                  <h3 className="bydash-mfe__story-heading">Schulämter in {currentRegion.shortName}</h3>
                </div>

                {/* View selector using semantic nav element */}
                <ViewSwitcher
                  options={[
                    { key: 'map', label: 'Karte' },
                    { key: 'table', label: 'Überblick' },
                  ]}
                  activeKey={view}
                  onSelect={(selectedView) => setView(selectedView as ViewType)}
                  ariaLabel="Ansichtsauswahl für Regierungsbezirke"
                  variant="underline"
                />
                <div className="bydash-mfe__card-heading"></div>

                <div className="bydash-mfe__chart-frame">
                  {view === 'map' && (
                    <OfficesLeafletMap
                      selectedRegionId={selectedRegion}
                      regionMetrics={sortedMetrics}
                      schoolOffices={schoolOffices}
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
                              {metricLabels['students_percent']}
                            </th>
                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#1f2937' }}>
                              {metricLabels['studentTeacherRatio']}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOffices.map((office, idx) => (
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
                                {office.studentTeacherRatio.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr style={{ backgroundColor: '#f0f9ff', borderTop: '2px solid #d1d5db', fontWeight: '600' }}>
                            <td style={{ padding: '12px', color: '#1f2937' }}>{currentRegion.shortName} (Gesamt)</td>
                            <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937', fontVariantNumeric: 'tabular-nums' }}>
                              {currentRegion.schools.toLocaleString()}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937', fontVariantNumeric: 'tabular-nums' }}>
                              {currentRegion.students_percent.toFixed(2)}%
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937', fontVariantNumeric: 'tabular-nums' }}>
                              {currentRegion.studentTeacherRatio.toFixed(2)}
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
