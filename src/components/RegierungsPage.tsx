import { memo, useState } from 'react'
import { bavariaMetrics, regions } from '../data/bavaria.ts'
import { COMMON_STYLES } from '../config/chartConfig.ts'
import { InterpretationBox } from './InterpretationBox.tsx'
import { OfficesLeafletMap } from './charts/OfficesLeafletMap.tsx'
import { ViewSwitcher } from './controls/ViewSwitcher.tsx'
import { RegionSelect } from './controls/RegionSelect.tsx'

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
    <>
      {/* Region selector - prominent at top */}
      <section style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '24px 0', borderBottom: '2px solid var(--class-retention-border)', marginBottom: '24px', width: '100%' }}>
        <RegionSelect
          selectedRegionId={selectedRegion}
          onRegionChange={setSelectedRegion}
          label="Wählen Sie eine Region:"
        />
      </section>

      {/* Region-specific metrics */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="class-retention-mfe__stats-header">{currentRegion.shortName} in Zahlen</h3>
        </div>
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
          aria-label="Kennzahlen der ausgewählten Region"
        >
          {(Object.keys(currentRegion.metrics) as MetricKey[]).map((key) => (
            <section key={key} className="class-retention-mfe__stat-card">
              <span className="class-retention-mfe__stat-type">{metricLabels[key]}</span>
              <strong>{currentRegion.metrics[key].toLocaleString()}</strong>
            </section>
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
              <h3 className="class-retention-mfe__story-heading">Schulämter</h3>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <InterpretationBox tabs={interpretationTabs} defaultTab="befund" />
        </div>
      </section>
    </>
  )
}

export const RegierungsView = memo(RegierungsViewComponent)
