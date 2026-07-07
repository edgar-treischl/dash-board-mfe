import { memo, useState } from 'react'
import { SCHULEN, DISTRICT_METADATA, AMPEL_COLORS, SUPPLY_CATEGORIES, LONG_TERM_DATA } from '../data/SAmt'
import { COMMON_STYLES } from '../config/chartConfig'
import { SchoolsLeafletMap } from './charts/SchoolsLeafletMap'
import { ViewSwitcher } from './controls/ViewSwitcher'
import { InterpretationBox } from './InterpretationBox'

type SchoolTypeFilter = 'Alle' | 'Grundschule' | 'Mittelschule'
type StartchancenFilter = 'Alle' | 'Startchancen-Schule'
type SubjectType = 'mat' | 'deu'
type AmpelMode = 'vera' | 'supply' | 'satisfaction'
type NavSection = 'lernstand' | 'belastung' | 'ressourcen'
type AnalysisViewType = 'map' | 'chart'

function SAmtPageComponent() {
  const [schoolTypeFilter, setSchoolTypeFilter] = useState<SchoolTypeFilter>('Alle')
  const [startFilter, setStartFilter] = useState<StartchancenFilter>('Alle')
  const [subject, setSubject] = useState<SubjectType>('mat')
  const [ampelMode, setAmpelMode] = useState<AmpelMode>('vera')
  const [navSection, setNavSection] = useState<NavSection>('lernstand')
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null)
  const [analysisView, setAnalysisView] = useState<AnalysisViewType>('map')

  // Filter schools based on current filters
  const filteredSchools = SCHULEN.filter(school => {
    if (schoolTypeFilter !== 'Alle' && school.type !== schoolTypeFilter) return false
    if (startFilter !== 'Alle' && school.startchancen !== startFilter) return false
    return true
  })

  // Calculate summary metrics for filtered schools
  const summaryMetrics = {
    totalSchools: filteredSchools.length,
    totalStudents: filteredSchools.reduce((sum, s) => sum + s.students, 0),
    avgSozialindex: filteredSchools.length > 0 
      ? filteredSchools.reduce((sum, s) => sum + s.sozialindex, 0) / filteredSchools.length 
      : 0,
    avgVeraMat: filteredSchools.length > 0
      ? filteredSchools.reduce((sum, s) => sum + s.veraMat, 0) / filteredSchools.length
      : 0,
    avgVeraDeu: filteredSchools.length > 0
      ? filteredSchools.reduce((sum, s) => sum + s.veraDeu, 0) / filteredSchools.length
      : 0,
    avgTeacherRatio: filteredSchools.length > 0
      ? filteredSchools.reduce((sum, s) => sum + s.teacherRatio, 0) / filteredSchools.length
      : 0
  }

  const selectedSchool = selectedSchoolId ? SCHULEN.find(s => s.id === selectedSchoolId) : null

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
        
        {/* Header */}
        <div style={{
          padding: '24px 24px 20px 24px',
          borderBottom: '1px solid var(--class-retention-border)',
          background: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.02), transparent)'
        }}>
          <h1 className="class-retention-mfe__selection-title" style={{ marginBottom: '6px' }}>
            Schulamts-Dashboard – {DISTRICT_METADATA.name}
          </h1>
          <small style={{ color: 'var(--class-retention-text)', fontSize: '0.875rem' }}>
            Treffen Sie eine Auswahl: Alle Daten sind fiktiv, orientieren sich aber an typischen Größenordnungen.
          </small>
        </div>

        {/* Filter and Overview Section */}
        <div style={{ padding: '24px' }}>
          {/* School Type Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--class-retention-text)' }}>Schulart:</span>
            {(['Alle', 'Grundschule', 'Mittelschule'] as SchoolTypeFilter[]).map(type => (
              <button
                key={type}
                onClick={() => setSchoolTypeFilter(type)}
                className={`class-retention-mfe__filter-pill ${schoolTypeFilter === type ? 'is-active' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Startchancen Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--class-retention-text)' }}>Startchancen:</span>
            {(['Alle', 'Startchancen-Schule'] as StartchancenFilter[]).map(filter => (
              <button
                key={filter}
                className={`class-retention-mfe__filter-pill ${startFilter === filter ? 'is-active' : ''}`}
                onClick={() => setStartFilter(filter)}
              >
                {filter === 'Alle' ? 'Alle' : 'Nur Startchancen-Schulen'}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--class-retention-text)' }}>Fach (Lernstand):</span>
            {(['mat', 'deu'] as SubjectType[]).map(subj => (
              <button
                key={subj}
                className={`class-retention-mfe__filter-pill ${subject === subj ? 'is-active' : ''}`}
                onClick={() => setSubject(subj)}
              >
                {subj === 'mat' ? 'Mathematik' : 'Deutsch'}
              </button>
            ))}
          </div>

          {/* Ampel Mode Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--class-retention-text)' }}>Ampel-Fokus:</span>
            {(['vera', 'supply', 'satisfaction'] as AmpelMode[]).map(mode => (
              <button
                key={mode}
                className={`class-retention-mfe__filter-pill ${ampelMode === mode ? 'is-active' : ''}`}
                onClick={() => setAmpelMode(mode)}
              >
                {mode === 'vera' ? 'Leistungen (VERA)' : mode === 'supply' ? 'Lehrerversorgung' : 'Lehrerzufriedenheit'}
              </button>
            ))}
          </div>

          {/* Summary Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '12px', 
            marginTop: '20px' 
          }}>
            <div style={{ background: 'var(--class-retention-bg)', border: '1px solid var(--class-retention-border)', borderRadius: '12px', padding: '12px' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Schulen</strong>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--class-retention-primary)' }}>
                {summaryMetrics.totalSchools}
              </div>
            </div>
            <div style={{ background: 'var(--class-retention-bg)', border: '1px solid var(--class-retention-border)', borderRadius: '12px', padding: '12px' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Schüler:innen</strong>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--class-retention-primary)' }}>
                {summaryMetrics.totalStudents.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'var(--class-retention-bg)', border: '1px solid var(--class-retention-border)', borderRadius: '12px', padding: '12px' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Ø Sozialindex</strong>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--class-retention-primary)' }}>
                {summaryMetrics.avgSozialindex.toFixed(2)}
              </div>
            </div>
            <div style={{ background: 'var(--class-retention-bg)', border: '1px solid var(--class-retention-border)', borderRadius: '12px', padding: '12px' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Ø VERA {subject === 'mat' ? 'Mathe' : 'Deutsch'}</strong>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--class-retention-primary)' }}>
                {(subject === 'mat' ? summaryMetrics.avgVeraMat : summaryMetrics.avgVeraDeu).toFixed(1)}
              </div>
            </div>
            <div style={{ background: 'var(--class-retention-bg)', border: '1px solid var(--class-retention-border)', borderRadius: '12px', padding: '12px' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Ø Schüler/Lehrer</strong>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--class-retention-primary)' }}>
                {summaryMetrics.avgTeacherRatio.toFixed(1)}
              </div>
            </div>
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
              {/* Analysis Card */}
              <div style={{
                border: '1px solid var(--class-retention-border)',
                borderRadius: '12px',
                background: 'var(--class-retention-bg)',
                overflow: 'hidden'
              }}>
                {/* Card Header */}
                <div className="class-retention-mfe__story-header">
                  <h3 className="class-retention-mfe__story-heading">Schulen im Schulamtsbezirk</h3>
                </div>

                {/* View selector */}
                <ViewSwitcher
                  options={[
                    { key: 'map', label: 'Karte' },
                    { key: 'chart', label: 'Auswertung' },
                  ]}
                  activeKey={analysisView}
                  onSelect={(selectedView) => setAnalysisView(selectedView as AnalysisViewType)}
                  ariaLabel="Ansichtsauswahl für Schulanalyse"
                  variant="underline"
                />
                <div className="class-retention-mfe__card-heading"></div>

                <div className="class-retention-mfe__chart-frame">
                  {analysisView === 'map' && (
                    <div style={{ borderRadius: '0 0 12px 12px', overflow: 'hidden', border: 'none' }}>
                      <SchoolsLeafletMap
                        schools={filteredSchools}
                        selectedSchoolId={selectedSchoolId}
                        ampelMode={ampelMode}
                        onSchoolSelect={setSelectedSchoolId}
                      />
                    </div>
                  )}

                  {analysisView === 'chart' && (
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>Schulen – VERA {subject === 'mat' ? 'Mathematik' : 'Deutsch'}</h3>
                          <div style={{ fontSize: '0.8rem' }}>
                            {filteredSchools.sort((a, b) => (subject === 'mat' ? b.veraMat - a.veraMat : b.veraDeu - a.veraDeu)).slice(0, 10).map(school => {
                              const value = subject === 'mat' ? school.veraMat : school.veraDeu
                              return (
                                <div key={school.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                  <div style={{ flex: '0 0 180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{school.name}</div>
                                  <div style={{ flex: '1', height: '8px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(value / 100) * 100}%`, height: '100%', background: 'var(--class-retention-primary)', borderRadius: '999px' }} />
                                  </div>
                                  <div style={{ flex: '0 0 50px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{value.toFixed(1)}</div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>Schulen – Lehrerversorgung (Schüler/Lehrer)</h3>
                          <div style={{ fontSize: '0.8rem' }}>
                            {filteredSchools.sort((a, b) => a.teacherRatio - b.teacherRatio).slice(0, 10).map(school => (
                              <div key={school.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <div style={{ flex: '0 0 180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{school.name}</div>
                                <div style={{ flex: '1', height: '8px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                                  <div style={{ width: `${(school.teacherRatio / 30) * 100}%`, height: '100%', background: school.supplyCategory === 'gut' ? AMPEL_COLORS.green : school.supplyCategory === 'angespannt' ? AMPEL_COLORS.yellow : AMPEL_COLORS.red, borderRadius: '999px' }} />
                                </div>
                                <div style={{ flex: '0 0 50px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{school.teacherRatio.toFixed(1)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interpretation Container - Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InterpretationBox 
                tabs={{
                  befund: {
                    label: 'Befund',
                    content: (
                      <div>
                        <p className="class-retention-mfe__story-text">
                          Das Schulamts-Dashboard des {DISTRICT_METADATA.name} zeigt die Verteilung der Schulen, Schüler:innen und Ressourcen im Bezirk. Die Ampel-Kodierung visualisiert den Status nach dem gewählten Fokus.
                        </p>
                        <ul className="class-retention-mfe__story-text" style={COMMON_STYLES.bulletList}>
                          <li style={COMMON_STYLES.listItem}>
                            <strong>Insgesamt {filteredSchools.length} Schulen</strong> mit {summaryMetrics.totalStudents.toLocaleString()} Schüler:innen
                          </li>
                          <li style={COMMON_STYLES.listItem}>
                            <strong>Durchschnittlicher Sozialindex:</strong> {summaryMetrics.avgSozialindex.toFixed(2)}
                          </li>
                          <li style={COMMON_STYLES.listItem}>
                            <strong>Lehrerversorgung (Ø Schüler/Lehrer):</strong> {summaryMetrics.avgTeacherRatio.toFixed(1)}
                          </li>
                        </ul>
                      </div>
                    ),
                  },
                  hinweis: {
                    label: 'Hinweis',
                    content: (
                      <p className="class-retention-mfe__story-text class-retention-mfe__story-text--italic">
                        Die Daten sind fiktiv, orientieren sich aber an typischen Größenordnungen. Die Ampel-Kodierung berücksichtigt sowohl Leistungsindikatoren (VERA) als auch Ressourcen (Lehrerversorgung) und Zufriedenheit. Nutzen Sie die Filter zum Erkunden verschiedener Schularten und Startchancen-Schulen.
                      </p>
                    ),
                  },
                }}
                defaultTab="befund"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Lernstand/Belastung/Ressourcen */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--class-retention-border)' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 className="class-retention-mfe__selection-title" style={{ marginBottom: '6px' }}>Steuerungs-Navigation</h2>
            <small style={{ color: 'var(--class-retention-text)', fontSize: '0.875rem' }}>
              Die Auswertungen beziehen sich auf die aktuell gefilterten Schulen. Ergänzt um eine 10-Jahres-Entwicklung auf Schulamtsebene.
            </small>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            {(['lernstand', 'belastung', 'ressourcen'] as NavSection[]).map(section => (
              <button 
                key={section} 
                onClick={() => setNavSection(section)} 
                className={`class-retention-mfe__filter-pill ${navSection === section ? 'is-active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>{section === 'lernstand' ? '📊' : section === 'belastung' ? '⚖️' : '🧩'}</span>
                <span>{section === 'lernstand' ? 'Lernstand' : section === 'belastung' ? 'Belastung & Zusammensetzung' : 'Ressourcenverteilung'}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: '20px', background: 'var(--class-retention-bg)', borderRadius: '12px', border: '1px solid var(--class-retention-border)' }}>
            {navSection === 'lernstand' && (<div><h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: 'var(--class-retention-heading)' }}>Lernstand (10-Jahres-Trend)</h3><p style={{ fontSize: '0.85rem', color: 'var(--class-retention-text)', margin: 0 }}>[Chart: Lernstand über Zeit - Ziel: {LONG_TERM_DATA.targets.lernstand}]</p></div>)}
            {navSection === 'belastung' && (<div><h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: 'var(--class-retention-heading)' }}>Belastung & Zusammensetzung (10-Jahres-Trend)</h3><p style={{ fontSize: '0.85rem', color: 'var(--class-retention-text)', margin: 0 }}>[Chart: Sozialindex über Zeit - Ziel: {LONG_TERM_DATA.targets.belastung}]</p></div>)}
            {navSection === 'ressourcen' && (<div><h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: 'var(--class-retention-heading)' }}>Ressourcenverteilung (10-Jahres-Trend)</h3><p style={{ fontSize: '0.85rem', color: 'var(--class-retention-text)', margin: 0 }}>[Chart: Schüler/Lehrer-Verhältnis über Zeit - Ziel: {LONG_TERM_DATA.targets.ratio}]</p></div>)}
          </div>
        </div>

        {/* School Detail View */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--class-retention-border)' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 className="class-retention-mfe__selection-title" style={{ marginBottom: '6px' }}>Detailansicht Schule</h2>
            <small style={{ color: 'var(--class-retention-text)', fontSize: '0.875rem' }}>Eine Schule auswählen (Karte oder Liste), um Ampeln und Kennzahlen zu sehen.</small>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {filteredSchools.slice(0, 8).map(school => (
              <button 
                key={school.id} 
                onClick={() => setSelectedSchoolId(school.id)} 
                className={`class-retention-mfe__filter-pill ${selectedSchoolId === school.id ? 'is-active' : ''}`}
                style={{ fontSize: '0.8rem' }}
              >
                {school.name}
              </button>
            ))}
          </div>
          {selectedSchool ? (
            <div style={{ padding: '20px', background: 'var(--class-retention-bg)', borderRadius: '12px', border: '1px solid var(--class-retention-border)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', color: 'var(--class-retention-heading)' }}>{selectedSchool.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'var(--class-retention-surface)', borderRadius: '8px', border: '1px solid var(--class-retention-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '6px', fontWeight: '500' }}>Schüler:innen</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--class-retention-heading)' }}>{selectedSchool.students}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--class-retention-surface)', borderRadius: '8px', border: '1px solid var(--class-retention-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '6px', fontWeight: '500' }}>Sozialindex</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--class-retention-heading)' }}>{selectedSchool.sozialindex}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--class-retention-surface)', borderRadius: '8px', border: '1px solid var(--class-retention-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '6px', fontWeight: '500' }}>VERA Mathe</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--class-retention-heading)' }}>{selectedSchool.veraMat.toFixed(1)}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--class-retention-surface)', borderRadius: '8px', border: '1px solid var(--class-retention-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '6px', fontWeight: '500' }}>VERA Deutsch</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--class-retention-heading)' }}>{selectedSchool.veraDeu.toFixed(1)}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--class-retention-surface)', borderRadius: '8px', border: '1px solid var(--class-retention-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '6px', fontWeight: '500' }}>Schüler/Lehrer</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--class-retention-heading)' }}>{selectedSchool.teacherRatio.toFixed(1)}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--class-retention-surface)', borderRadius: '8px', border: '1px solid var(--class-retention-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '6px', fontWeight: '500' }}>Versorgung</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: selectedSchool.supplyCategory === 'gut' ? AMPEL_COLORS.green : selectedSchool.supplyCategory === 'angespannt' ? AMPEL_COLORS.yellow : AMPEL_COLORS.red }}>{SUPPLY_CATEGORIES[selectedSchool.supplyCategory].label}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--class-retention-surface)', borderRadius: '8px', border: '1px solid var(--class-retention-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '6px', fontWeight: '500' }}>Startchancen</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--class-retention-heading)' }}>{selectedSchool.startchancen === 'Startchancen-Schule' ? '✓' : '–'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '16px', color: 'var(--class-retention-text)', fontSize: '0.85rem', fontStyle: 'italic' }}>Noch keine Schule ausgewählt.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export const SAmtPage = memo(SAmtPageComponent)
