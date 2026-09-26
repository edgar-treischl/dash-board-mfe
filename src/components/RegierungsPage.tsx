import { memo, useState } from 'react'
import { bavariaMetrics, regionMetrics, schoolOffices } from '../data/bavaria'
import { COMMON_STYLES } from '../config/chartConfig'
import { InterpretationBox } from './InterpretationBox'
import { OfficesLeafletMap } from './charts/OfficesLeafletMap'
import { RegionMapSVG } from './charts/RegionMapSVG'
import { ViewSwitcher } from './controls/ViewSwitcher'
import { RegionIcon } from './controls/RegionIcon'
import { SchoolsIcon, PupilsIcon, ClassSizeIcon, StudentTeacherRelationIcon, GlobeIcon } from '../utils/icons'
import styles from './RegierungsPage.module.css'

type MetricKey = 'students_percent' | 'avgClassSize' | 'schools' |  'studentTeacherRatio' | 'teachersFTE' | 'migrantPercent'

type ViewType = 'map' | 'table'

function RegierungsViewComponent() {
  // Sort metrics alphabetically by name for consistent display
  const sortedMetrics = [...regionMetrics].sort((a, b) => a.shortName.localeCompare(b.shortName))
  const [view, setView] = useState<ViewType>('map')
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
    <div className={styles.container}>
      
      {/* Main Card Container */}
      <div className={styles.card}>
        
        {/* Persistent Full-Width Region Breadcrumb Selector - Subtle Design */}
        <div style={{
          padding: '10px 24px',
          borderBottom: '1px solid var(--bydash-border)',
          background: 'transparent',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {sortedMetrics.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: selectedRegion === region.id 
                  ? 'rgba(37, 99, 235, 0.1)' 
                  : 'transparent',
                color: 'var(--bydash-text)',
                border: selectedRegion === region.id 
                  ? '1px solid var(--bydash-primary)' 
                  : '1px solid var(--bydash-border)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontSize: '0.9rem',
                fontWeight: selectedRegion === region.id ? '600' : '500',
                whiteSpace: 'nowrap',
                width: '100%',
                minHeight: '40px',
                opacity: selectedRegion === region.id ? 1 : 0.7,
              }}
              onMouseEnter={(e) => {
                if (selectedRegion !== region.id) {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRegion !== region.id) {
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <RegionIcon regionId={region.id} width={20} height={20} />
              </div>
              <span style={{ flex: 1, textAlign: 'center' }}>{region.shortName}</span>
            </button>
          ))}
        </div>

        {/* Active Region Display - Integrated */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px' }}>
          <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>
            <RegionIcon regionId={selectedRegion} width={40} height={40} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Aktiver Regierungsbezirk</div>
            <h1 className="bydash-mfe__selection-title" style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
              {currentRegion.shortName}
            </h1>
          </div>
        </div>

        {/* Regional Distribution Map and Indicators Grid */}
        <div style={{ padding: '24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '20px',
              alignItems: 'start',
            }}
          >
            {/* Indicators Selection - Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Indicators Panel */}
              <div style={{
                border: '1px solid var(--bydash-border)',
                borderRadius: '12px',
                background: 'var(--bydash-bg)',
                overflow: 'hidden',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px', marginTop: 0 }}>
                  Indikatoren
                </h2>
                <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '16px', marginTop: 0 }}>
                  Wählen Sie einen Indikator
                </p>

                {/* Indicators Grid - Single Column */}
                <div className="bydash-mfe__selection-grid" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  {(Object.keys(metricLabels) as MetricKey[]).map((key) => (
                    <button
                      key={key}
                      className={`bydash-mfe__level-select-btn ${selectedMetric === key ? 'is-active' : ''}`}
                      onClick={() => setSelectedMetric(key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        background: selectedMetric === key ? 'var(--bydash-surface)' : 'transparent',
                        border: '1px solid var(--bydash-border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        color: 'var(--bydash-text)',
                        fontSize: '0.9rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = selectedMetric === key ? 'var(--bydash-surface)' : 'rgba(37, 99, 235, 0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = selectedMetric === key ? 'var(--bydash-surface)' : 'transparent';
                      }}
                    >
                      <div className="bydash-mfe__grid-icon-wrapper" style={{ flexShrink: 0, width: '20px', height: '20px' }}>
                        {metricIcons[key]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem' }}>{metricLabels[key]}</strong>
                      </div>
                      <div style={{ 
                        padding: '4px 8px',
                        background: 'transparent',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: selectedMetric === key ? 'var(--bydash-primary)' : 'var(--bydash-text)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        opacity: selectedMetric === key ? 1 : 0.8
                      }}>
                        {formatMetricValue(key, currentRegion[key])}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Region Map Card - Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
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
