import { memo, useState } from 'react'
import { SCHULEN, DISTRICT_METADATA, AMPEL_COLORS, SUPPLY_CATEGORIES, LONG_TERM_DATA } from '../data/SAmt'
import { SchoolsLeafletMap } from './charts/SchoolsLeafletMap'
import { ViewSwitcher } from './controls/ViewSwitcher'
import { IndicatorSelector } from './controls/IndicatorSelector'
import { SchoolsIcon, PupilsIcon, ClassSizeIcon, StudentTeacherRelationIcon } from '../utils/icons'

type SchoolTypeFilter = 'Alle' | 'Grundschule' | 'Mittelschule'
type StartchancenFilter = 'Alle' | 'Startchancen-Schule'
type SubjectType = 'mat' | 'deu'
type AmpelMode = 'vera' | 'supply' | 'satisfaction'
type NavSection = 'lernstand' | 'belastung' | 'ressourcen'
type AnalysisViewType = 'map' | 'chart'  
type KPIKey = 'schools' | 'students' | 'sozialindex' | 'vera' | 'teacherRatio'

function SAmtPageComponent() {
  const [schoolTypeFilter, setSchoolTypeFilter] = useState<SchoolTypeFilter>('Alle')
  const [startFilter, setStartFilter] = useState<StartchancenFilter>('Alle')
  const [subject, setSubject] = useState<SubjectType>('mat')
  const [ampelMode, setAmpelMode] = useState<AmpelMode>('vera')
  const [navSection, setNavSection] = useState<NavSection>('lernstand')
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null)
  const [analysisView, setAnalysisView] = useState<AnalysisViewType>('map')
  const [selectedKPI, setSelectedKPI] = useState<KPIKey>('schools')

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
    <div className="bydash-mfe__bavaria-container" style={{ width: '100%', margin: '0', padding: '24px', boxSizing: 'border-box' }}>
      
      {/* Main Card Container */}
      <div style={{
        background: 'var(--bydash-surface)',
        border: '1px solid var(--bydash-border)',
        borderRadius: '18px',
        boxShadow: 'var(--bydash-shadow)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '24px 24px 20px 24px',
          borderBottom: '1px solid var(--bydash-border)',
          background: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.02), transparent)'
        }}>
          <h1 className="bydash-mfe__selection-title" style={{ marginBottom: '6px' }}>
            {DISTRICT_METADATA.name}
          </h1>
          <small style={{ color: 'var(--bydash-text)', fontSize: '0.875rem' }}>
            Treffen Sie eine Auswahl: Alle Daten sind fiktiv, orientieren sich aber an typischen Größenordnungen.
          </small>
        </div>

        {/* KPI Indicators at top */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--bydash-border)' }}>
          <IndicatorSelector<KPIKey>
            options={[
              {
                key: 'schools',
                label: 'Schulen',
                icon: <SchoolsIcon />,
                value: summaryMetrics.totalSchools,
              },
              {
                key: 'students',
                label: 'Schüler:innen',
                icon: <PupilsIcon />,
                value: summaryMetrics.totalStudents,
              },
              {
                key: 'sozialindex',
                label: 'Ø Sozialindex',
                icon: <ClassSizeIcon />,
                value: summaryMetrics.avgSozialindex,
              },
              {
                key: 'vera',
                label: `Ø VERA ${subject === 'mat' ? 'Mathe' : 'Deutsch'}`,
                icon: <PupilsIcon />,
                value: subject === 'mat' ? summaryMetrics.avgVeraMat : summaryMetrics.avgVeraDeu,
              },
              {
                key: 'teacherRatio',
                label: 'Ø Schüler/Lehrer',
                icon: <StudentTeacherRelationIcon />,
                value: summaryMetrics.avgTeacherRatio,
              },
            ]}
            selectedKey={selectedKPI}
            onSelect={setSelectedKPI}
            formatValue={(val, key) => {
              if (typeof val !== 'number') return String(val)
              if (key === 'schools' || key === 'students') {
                return val.toLocaleString()
              }
              return val.toFixed(key === 'vera' ? 1 : 2)
            }}
            gridColumns="repeat(5, 1fr)"
            containerPadding="0"
            containerMarginBottom="0"
            interactive={false}
          />
        </div>

        {/* Filters and Map/Chart Section */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--bydash-border)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '40% 60%',
              gap: '20px',
              alignItems: 'start',
            }}
          >
            {/* Left: Filters */}
            <div style={{
              border: '1px solid var(--bydash-border)',
              borderRadius: '12px',
              background: 'var(--bydash-bg)',
              overflow: 'hidden',
              height: '100%',
            }}>
              {/* Card Header */}
              <div className="bydash-mfe__story-header">
                <h3 className="bydash-mfe__story-heading">Filter</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* School Type Filter */}
                <div style={{ padding: '16px 24px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--bydash-text)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Schulart</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(['Alle', 'Grundschule', 'Mittelschule'] as SchoolTypeFilter[]).map(type => (
                      <button
                        key={type}
                        onClick={() => setSchoolTypeFilter(type)}
                        className={`bydash-mfe__filter-pill ${schoolTypeFilter === type ? 'is-active' : ''}`}
                        style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Startchancen Filter */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--bydash-border)' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--bydash-text)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Startchancen</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(['Alle', 'Startchancen-Schule'] as StartchancenFilter[]).map(filter => (
                      <button
                        key={filter}
                        className={`bydash-mfe__filter-pill ${startFilter === filter ? 'is-active' : ''}`}
                        onClick={() => setStartFilter(filter)}
                        style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                      >
                        {filter === 'Alle' ? 'Alle' : 'Nur Startchancen-Schulen'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ampel Mode Filter */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--bydash-border)' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--bydash-text)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ampel-Fokus</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(['vera', 'supply', 'satisfaction'] as AmpelMode[]).map(mode => (
                      <button
                        key={mode}
                        className={`bydash-mfe__filter-pill ${ampelMode === mode ? 'is-active' : ''}`}
                        onClick={() => setAmpelMode(mode)}
                        style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                      >
                        {mode === 'vera' ? 'Leistungen (VERA)' : mode === 'supply' ? 'Lehrerversorgung' : 'Lehrerzufriedenheit'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Map/Chart */}
            <div>
              {/* Analysis Card */}
              <div style={{
                border: '1px solid var(--bydash-border)',
                borderRadius: '12px',
                background: 'var(--bydash-bg)',
                overflow: 'hidden'
              }}>
                {/* Card Header */}
                <div className="bydash-mfe__story-header">
                  <h3 className="bydash-mfe__story-heading">Schulen im Schulamtsbezirk</h3>
                </div>

                {/* View selector */}
                <ViewSwitcher
                  options={[
                    { key: 'map', label: 'Karte' },
                     { key: 'chart', label: 'Auswertung Schulen' },
                  ]}
                  activeKey={analysisView}
                  onSelect={(selectedView) => setAnalysisView(selectedView as AnalysisViewType)}
                  ariaLabel="Ansichtsauswahl für Schulanalyse"
                  variant="underline"
                />
                <div className="bydash-mfe__card-heading"></div>

                <div className="bydash-mfe__chart-frame">

                  {analysisView === 'chart' && (
                    <div style={{ padding: '16px' }}>
                      {/* Subject Filter */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--bydash-border)' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--bydash-text)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fach (Lernstand)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(['mat', 'deu'] as SubjectType[]).map(subj => (
                      <button
                        key={subj}
                        className={`bydash-mfe__filter-pill ${subject === subj ? 'is-active' : ''}`}
                        onClick={() => setSubject(subj)}
                        style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                      >
                        {subj === 'mat' ? 'Mathematik' : 'Deutsch'}
                      </button>
                    ))}
                  </div>
                </div>
                          <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>Schulen – VERA {subject === 'mat' ? 'Mathematik' : 'Deutsch'}</h3>
                          
                          <div style={{ fontSize: '0.8rem' }}>
                            {filteredSchools.sort((a, b) => (subject === 'mat' ? b.veraMat - a.veraMat : b.veraDeu - a.veraDeu)).slice(0, 10).map(school => {
                              const value = subject === 'mat' ? school.veraMat : school.veraDeu
                              return (
                                <div key={school.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                  <div style={{ flex: '0 0 180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{school.name}</div>
                                  <div style={{ flex: '1', height: '8px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(value / 100) * 100}%`, height: '100%', background: 'var(--bydash-primary)', borderRadius: '999px' }} />
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

                  {analysisView === 'map' && (
                    <SchoolsLeafletMap
                      schools={filteredSchools}
                      selectedSchoolId={selectedSchoolId}
                      ampelMode={ampelMode}
                      onSchoolSelect={setSelectedSchoolId}
                    />
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Lernstand/Belastung/Ressourcen */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--bydash-border)' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 className="bydash-mfe__selection-title" style={{ marginBottom: '6px' }}>Steuerungs-Navigation</h2>
            <small style={{ color: 'var(--bydash-text)', fontSize: '0.875rem' }}>
              Die Auswertungen beziehen sich auf die aktuell gefilterten Schulen. Ergänzt um eine 10-Jahres-Entwicklung auf Schulamtsebene.
            </small>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            {(['lernstand', 'belastung', 'ressourcen'] as NavSection[]).map(section => (
              <button 
                key={section} 
                onClick={() => setNavSection(section)} 
                className={`bydash-mfe__filter-pill ${navSection === section ? 'is-active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>{section === 'lernstand' ? '📊' : section === 'belastung' ? '⚖️' : '🧩'}</span>
                <span>{section === 'lernstand' ? 'Lernstand' : section === 'belastung' ? 'Belastung & Zusammensetzung' : 'Ressourcenverteilung'}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: '20px', background: 'var(--bydash-bg)', borderRadius: '12px', border: '1px solid var(--bydash-border)' }}>
            {navSection === 'lernstand' && (<div><h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: 'var(--bydash-heading)' }}>Lernstand (10-Jahres-Trend)</h3><p style={{ fontSize: '0.85rem', color: 'var(--bydash-text)', margin: 0 }}>[Chart: Lernstand über Zeit - Ziel: {LONG_TERM_DATA.targets.lernstand}]</p></div>)}
            {navSection === 'belastung' && (<div><h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: 'var(--bydash-heading)' }}>Belastung & Zusammensetzung (10-Jahres-Trend)</h3><p style={{ fontSize: '0.85rem', color: 'var(--bydash-text)', margin: 0 }}>[Chart: Sozialindex über Zeit - Ziel: {LONG_TERM_DATA.targets.belastung}]</p></div>)}
            {navSection === 'ressourcen' && (<div><h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: 'var(--bydash-heading)' }}>Ressourcenverteilung (10-Jahres-Trend)</h3><p style={{ fontSize: '0.85rem', color: 'var(--bydash-text)', margin: 0 }}>[Chart: Schüler/Lehrer-Verhältnis über Zeit - Ziel: {LONG_TERM_DATA.targets.ratio}]</p></div>)}
          </div>
        </div>

        {/* School Detail View */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--bydash-border)' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 className="bydash-mfe__selection-title" style={{ marginBottom: '6px' }}>Detailansicht Schule</h2>
            <small style={{ color: 'var(--bydash-text)', fontSize: '0.875rem' }}>Eine Schule auswählen (Karte oder Liste), um Ampeln und Kennzahlen zu sehen.</small>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {filteredSchools.slice(0, 8).map(school => (
              <button 
                key={school.id} 
                onClick={() => setSelectedSchoolId(school.id)} 
                className={`bydash-mfe__filter-pill ${selectedSchoolId === school.id ? 'is-active' : ''}`}
                style={{ fontSize: '0.8rem' }}
              >
                {school.name}
              </button>
            ))}
          </div>
          {selectedSchool ? (
            <div style={{ padding: '20px', background: 'var(--bydash-bg)', borderRadius: '12px', border: '1px solid var(--bydash-border)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', color: 'var(--bydash-heading)' }}>{selectedSchool.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'var(--bydash-surface)', borderRadius: '8px', border: '1px solid var(--bydash-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--bydash-text)', marginBottom: '6px', fontWeight: '500' }}>Schüler:innen</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--bydash-heading)' }}>{selectedSchool.students}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bydash-surface)', borderRadius: '8px', border: '1px solid var(--bydash-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--bydash-text)', marginBottom: '6px', fontWeight: '500' }}>Sozialindex</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--bydash-heading)' }}>{selectedSchool.sozialindex}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bydash-surface)', borderRadius: '8px', border: '1px solid var(--bydash-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--bydash-text)', marginBottom: '6px', fontWeight: '500' }}>VERA Mathe</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--bydash-heading)' }}>{selectedSchool.veraMat.toFixed(1)}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bydash-surface)', borderRadius: '8px', border: '1px solid var(--bydash-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--bydash-text)', marginBottom: '6px', fontWeight: '500' }}>VERA Deutsch</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--bydash-heading)' }}>{selectedSchool.veraDeu.toFixed(1)}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bydash-surface)', borderRadius: '8px', border: '1px solid var(--bydash-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--bydash-text)', marginBottom: '6px', fontWeight: '500' }}>Schüler/Lehrer</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--bydash-heading)' }}>{selectedSchool.teacherRatio.toFixed(1)}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bydash-surface)', borderRadius: '8px', border: '1px solid var(--bydash-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--bydash-text)', marginBottom: '6px', fontWeight: '500' }}>Versorgung</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: selectedSchool.supplyCategory === 'gut' ? AMPEL_COLORS.green : selectedSchool.supplyCategory === 'angespannt' ? AMPEL_COLORS.yellow : AMPEL_COLORS.red }}>{SUPPLY_CATEGORIES[selectedSchool.supplyCategory].label}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bydash-surface)', borderRadius: '8px', border: '1px solid var(--bydash-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--bydash-text)', marginBottom: '6px', fontWeight: '500' }}>Startchancen</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--bydash-heading)' }}>{selectedSchool.startchancen === 'Startchancen-Schule' ? '✓' : '–'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '16px', color: 'var(--bydash-text)', fontSize: '0.85rem', fontStyle: 'italic' }}>Noch keine Schule ausgewählt.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export const SAmtPage = memo(SAmtPageComponent)
