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
import { districtData } from '../data/districtData'

type MetricKey = 'students_percent' | 'avgClassSize' | 'schools' |  'studentTeacherRatio' | 'teachersFTE' | 'migrantPercent'

type ViewType = 'map' | 'table'

interface RegierungsRegionInfoPanelProps {
  selectedRegion: string
  selectedMetric: MetricKey
  metricLabels: Record<MetricKey, string>
  formatMetricValue: (key: MetricKey, value: number) => string
  currentRegion: Record<MetricKey, number> & { id: string; name: string; shortName: string }
}

function RegierungsRegionInfoPanel({
  selectedRegion,
  selectedMetric,
  metricLabels,
  formatMetricValue,
  currentRegion,
}: RegierungsRegionInfoPanelProps) {
  // Calculate min, max, average from district data for the selected region
  const regionDistricts = districtData.filter((d) => d.regionId === selectedRegion)
  
  const metricFieldMap: Record<MetricKey, keyof typeof districtData[number]> = {
    students_percent: 'studentsPercent',
    avgClassSize: 'avgClassSize',
    schools: 'schools',
    studentTeacherRatio: 'studentTeacherRatio',
    teachersFTE: 'teachersFTE',
    migrantPercent: 'migrantPercent',
  }

  const fieldKey = metricFieldMap[selectedMetric]
  const dataWithMetrics = regionDistricts
    .map((d) => ({
      ...d,
      value: d[fieldKey] as number,
    }))
    .filter((d) => d.value != null && !isNaN(d.value))

  // Find min/max with district names
  const minData = dataWithMetrics.length ? dataWithMetrics.reduce((prev, curr) => (curr.value < prev.value ? curr : prev)) : null
  const maxData = dataWithMetrics.length ? dataWithMetrics.reduce((prev, curr) => (curr.value > prev.value ? curr : prev)) : null
  const avgValue = dataWithMetrics.length ? dataWithMetrics.reduce((a, b) => a + b.value, 0) / dataWithMetrics.length : null

  const minValue = minData?.value ?? null
  const maxValue = maxData?.value ?? null

  const formatValue = (value: number | null): string => {
    if (value === null) return '—'
    return formatMetricValue(selectedMetric, value)
  }

  // Storytelling labels and descriptions based on metric
  const metricStories: Record<MetricKey, { context: string; avgExplanation: string }> = {
    students_percent: {
      context: 'Schüleranteil in der Region',
      avgExplanation: 'durchschnittlicher Anteil pro Landkreis/kreisfreie Stadt',
    },
    migrantPercent: {
      context: 'Schüler mit Migrationshintergrund',
      avgExplanation: 'durchschnittlicher Anteil pro Landkreis/kreisfreie Stadt',
    },
    teachersFTE: {
      context: 'Lehrkräfte (Vollzeitäquivalente)',
      avgExplanation: 'durchschnittliche Anzahl pro Landkreis/kreisfreie Stadt',
    },
    studentTeacherRatio: {
      context: 'Schüler pro Lehrkraft',
      avgExplanation: 'durchschnittliche Relation pro Landkreis/kreisfreie Stadt',
    },
    avgClassSize: {
      context: 'Durchschnittliche Klassengröße',
      avgExplanation: 'durchschnittliche Größe pro Landkreis/kreisfreie Stadt',
    },
    schools: {
      context: 'Anzahl der Schulen',
      avgExplanation: 'durchschnittliche Anzahl pro Landkreis/kreisfreie Stadt',
    },
  }

  const story = metricStories[selectedMetric]

  return (
    <div style={{
      border: '1px solid var(--bydash-border)',
      borderRadius: '12px',
      background: 'var(--bydash-bg)',
      overflow: 'hidden',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      height: 'fit-content',
    }}>
      {/* Header with larger fonts */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px', marginTop: 0, color: 'var(--bydash-primary)' }}>
          {metricLabels[selectedMetric]}
        </h3>
        <p style={{ fontSize: '0.95rem', opacity: 0.7, marginBottom: 0, marginTop: 0, fontWeight: '500' }}>
          {story.context} in {currentRegion.shortName}
        </p>
      </div>

      {/* Statistics Grid with better spacing and storytelling */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {/* Average */}
        <div style={{
          padding: '16px',
          border: '1px solid var(--bydash-border)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--bydash-text)', fontWeight: '600' }}>
            Durchschnitt
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--bydash-text)', opacity: 0.7 }}>
            {story.avgExplanation}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--bydash-primary)', marginTop: '4px' }}>
            {formatValue(avgValue)}
          </div>
        </div>

        {/* Minimum */}
        <div style={{
          padding: '16px',
          border: '1px solid var(--bydash-border)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--bydash-text)', fontWeight: '600' }}>
            Niedrigster Wert
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--bydash-text)', opacity: 0.65, fontWeight: '600' }}>
            {minData ? minData.key : 'Keine Daten verfügbar'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--bydash-primary)', marginTop: '4px' }}>
            {formatValue(minValue)}
          </div>
        </div>

        {/* Maximum */}
        <div style={{
          padding: '16px',
          border: '1px solid var(--bydash-border)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--bydash-text)', fontWeight: '600' }}>
            Höchster Wert
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--bydash-text)', opacity: 0.65, fontWeight: '600' }}>
            {maxData ? maxData.key : 'Keine Daten verfügbar'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--bydash-primary)', marginTop: '4px' }}>
            {formatValue(maxValue)}
          </div>
        </div>
      </div>

      {/* Info text with better visual hierarchy */}
      <div style={{
        padding: '12px 16px',
        border: '1px solid var(--bydash-border)',
        borderRadius: '6px',
        fontSize: '0.9rem',
        color: 'var(--bydash-text)',
        lineHeight: '1.5',
        fontWeight: '500',
        opacity: 0.75,
        textAlign: 'center',
      }}>
        Statistik basierend auf {dataWithMetrics.length} {dataWithMetrics.length === 1 ? 'Landkreis/kreisfreie Stadt' : 'Landkreisen/kreisfreien Städten'}
      </div>
    </div>
  )
}

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
        
        {/* Persistent Full-Width Region Breadcrumb Selector - Clean Underline Style */}
        <div style={{
          padding: '0 24px',
          borderBottom: '2px solid var(--bydash-border)',
          background: 'transparent',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0',
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
                gap: '8px',
                padding: '12px 16px',
                background: 'transparent',
                color: selectedRegion === region.id 
                  ? 'var(--bydash-accent)' 
                  : 'var(--bydash-text)',
                border: 'none',
                borderBottom: selectedRegion === region.id 
                  ? '2px solid var(--bydash-accent)' 
                  : '2px solid transparent',
                borderRadius: '0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontSize: '0.9rem',
                fontWeight: selectedRegion === region.id ? '600' : '500',
                whiteSpace: 'nowrap',
                width: '100%',
                minHeight: '40px',
              }}
              onMouseEnter={(e) => {
                if (selectedRegion !== region.id) {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--bydash-heading)';
                  (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'rgba(0, 141, 201, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRegion !== region.id) {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--bydash-text)';
                  (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'transparent';
                }
              }}
            >
              <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <RegionIcon regionId={region.id} width={20} height={20} />
              </div>
              <span>{region.shortName}</span>
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

        {/* Indicators Selection - Full Width Above Map - Clean Underline Style */}
        <div style={{
          padding: '0 24px',
          borderBottom: '2px solid var(--bydash-border)',
          background: 'transparent',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '0',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {(Object.keys(metricLabels) as MetricKey[]).map((key) => (
            <button
              key={key}
              className={`bydash-mfe__level-select-btn ${selectedMetric === key ? 'is-active' : ''}`}
              onClick={() => setSelectedMetric(key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'transparent',
                color: selectedMetric === key 
                  ? 'var(--bydash-accent)' 
                  : 'var(--bydash-text)',
                border: 'none',
                borderBottom: selectedMetric === key 
                  ? '2px solid var(--bydash-accent)' 
                  : '2px solid transparent',
                borderRadius: '0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontSize: '0.85rem',
                fontWeight: selectedMetric === key ? '600' : '500',
                textAlign: 'center',
                width: '100%',
                minHeight: '60px',
              }}
              onMouseEnter={(e) => {
                if (selectedMetric !== key) {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--bydash-heading)';
                  (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'rgba(0, 141, 201, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMetric !== key) {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--bydash-text)';
                  (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'transparent';
                }
              }}
            >
              <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {metricIcons[key]}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: 0 }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', fontWeight: selectedMetric === key ? '600' : '500' }}>
                  {metricLabels[key]}
                </strong>
                <div style={{ 
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: selectedMetric === key ? 'var(--bydash-accent)' : 'var(--bydash-text)',
                  opacity: selectedMetric === key ? 1 : 0.6
                }}>
                  {formatMetricValue(key, currentRegion[key])}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Regional Distribution Map and Info Grid */}
        <div style={{ padding: '24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
              alignItems: 'start',
            }}
          >
            {/* Region Map Card - Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
              <div style={{
                border: '1px solid var(--bydash-border)',
                borderRadius: '12px',
                background: 'var(--bydash-bg)',
                overflow: 'hidden'
              }}>
                {/* Card Header */}
                <div className="bydash-mfe__story-header">
                  <h3 className="bydash-mfe__story-heading">Landkreise in {currentRegion.shortName}</h3>
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

            {/* Info Panel - Right column */}
            <RegierungsRegionInfoPanel 
              selectedRegion={selectedRegion}
              selectedMetric={selectedMetric}
              metricLabels={metricLabels}
              formatMetricValue={formatMetricValue}
              currentRegion={currentRegion}
            />
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
