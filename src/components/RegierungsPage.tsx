import { memo, useState } from 'react'
import { bavariaMetrics, regions } from '../data/bavaria.ts'
import { COMMON_STYLES } from '../config/chartConfig.ts'
import { InterpretationBox } from './InterpretationBox.tsx'
import { OfficesLeafletMap } from './charts/OfficesLeafletMap.tsx'
import { ViewSwitcher } from './controls/ViewSwitcher.tsx'

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
    avgClassSize: 'Klassengröße (Ø)',
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
      {/* Region-specific metrics */}
      <section className="class-retention-mfe__stats-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="class-retention-mfe__stats-header">{currentRegion.shortName}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="region-select" style={{ marginRight: '4px', fontWeight: '500' }}>Region:</label>
            <select
              id="region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
              }}
            >
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="class-retention-mfe__stats-row" aria-label="Kennzahlen der ausgewählten Region">
          {(Object.keys(currentRegion.metrics) as MetricKey[]).map((key) => (
            <section key={key} className="class-retention-mfe__stat-card">
              <span className="class-retention-mfe__stat-type">{metricLabels[key]}</span>
              <strong>{currentRegion.metrics[key].toLocaleString()}</strong>
            </section>
          ))}
        </div>
      </section>

      <h3 className="class-retention-mfe__stats-header">Nach Regierungsbezirk</h3>



      <section className="class-retention-mfe__explorer-layout">
        <div className="class-retention-mfe__explorer-left">
          {/* Chart Card */}
          <div className="class-retention-mfe__chart-card">
            {/* View selector using semantic nav element */}
            <ViewSwitcher
              options={[
                { key: 'table', label: 'Tabelle' },
                { key: 'map', label: 'Karte' },
              ]}
              activeKey={view}
              onSelect={(selectedView) => setView(selectedView as ViewType)}
              ariaLabel="Ansichtsauswahl für Regierungsbezirke"
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

        <div className="class-retention-mfe__explorer-right">
          <InterpretationBox tabs={interpretationTabs} defaultTab="befund" />
        </div>
      </section>
    </>
  )
}

export const RegierungsView = memo(RegierungsViewComponent)
