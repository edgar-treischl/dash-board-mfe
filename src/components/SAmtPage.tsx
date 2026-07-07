import { memo, useState } from 'react'
import { SCHULEN, DISTRICT_METADATA, AMPEL_COLORS, SUPPLY_CATEGORIES, LONG_TERM_DATA } from '../data/SAmt'

type SchoolTypeFilter = 'Alle' | 'Grundschule' | 'Mittelschule'
type StartchancenFilter = 'Alle' | 'Startchancen-Schule'
type SubjectType = 'mat' | 'deu'
type AmpelMode = 'vera' | 'supply' | 'satisfaction'
type NavSection = 'lernstand' | 'belastung' | 'ressourcen'

function SAmtPageComponent() {
  const [schoolTypeFilter, setSchoolTypeFilter] = useState<SchoolTypeFilter>('Alle')
  const [startFilter, setStartFilter] = useState<StartchancenFilter>('Alle')
  const [subject, setSubject] = useState<SubjectType>('mat')
  const [ampelMode, setAmpelMode] = useState<AmpelMode>('vera')
  const [navSection, setNavSection] = useState<NavSection>('lernstand')
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null)

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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--class-retention-text)', marginRight: '8px' }}>Schulart:</span>
            {(['Alle', 'Grundschule', 'Mittelschule'] as SchoolTypeFilter[]).map(type => (
              <button
                key={type}
                onClick={() => setSchoolTypeFilter(type)}
                className={schoolTypeFilter === type ? 'is-active' : ''}
                style={{
                  padding: '6px 14px',
                  border: '1px solid var(--class-retention-border)',
                  borderRadius: '999px',
                  background: schoolTypeFilter === type ? 'var(--class-retention-primary)' : 'var(--class-retention-bg)',
                  color: schoolTypeFilter === type ? '#fff' : 'var(--class-retention-text)',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Startchancen Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--class-retention-text)', marginRight: '8px' }}>Startchancen:</span>
            {(['Alle', 'Startchancen-Schule'] as StartchancenFilter[]).map(filter => (
              <button
                key={filter}
                onClick={() => setStartFilter(filter)}
                className={startFilter === filter ? 'is-active' : ''}
                style={{
                  padding: '6px 14px',
                  border: '1px solid var(--class-retention-border)',
                  borderRadius: '999px',
                  background: startFilter === filter ? 'var(--class-retention-primary)' : 'var(--class-retention-bg)',
                  color: startFilter === filter ? '#fff' : 'var(--class-retention-text)',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {filter === 'Alle' ? 'Alle' : 'Nur Startchancen-Schulen'}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--class-retention-text)', marginRight: '8px' }}>Fach (Lernstand):</span>
            {(['mat', 'deu'] as SubjectType[]).map(subj => (
              <button
                key={subj}
                onClick={() => setSubject(subj)}
                className={subject === subj ? 'is-active' : ''}
                style={{
                  padding: '6px 14px',
                  border: '1px solid var(--class-retention-border)',
                  borderRadius: '999px',
                  background: subject === subj ? 'var(--class-retention-primary)' : 'var(--class-retention-bg)',
                  color: subject === subj ? '#fff' : 'var(--class-retention-text)',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {subj === 'mat' ? 'Mathematik' : 'Deutsch'}
              </button>
            ))}
          </div>

          {/* Ampel Mode Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--class-retention-text)', marginRight: '8px' }}>Ampel-Fokus:</span>
            {(['vera', 'supply', 'satisfaction'] as AmpelMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setAmpelMode(mode)}
                className={ampelMode === mode ? 'is-active' : ''}
                style={{
                  padding: '6px 14px',
                  border: '1px solid var(--class-retention-border)',
                  borderRadius: '999px',
                  background: ampelMode === mode ? 'var(--class-retention-primary)' : 'var(--class-retention-bg)',
                  color: ampelMode === mode ? '#fff' : 'var(--class-retention-text)',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
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

        {/* Map Section */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--class-retention-border)' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Karte – Schulen im Schulamtsbezirk</h2>
          <small style={{ color: 'var(--class-retention-text)', fontSize: '0.85rem' }}>
            Jeder Punkt ist eine Schule. Farbe = Ampel nach gewähltem Fokus.
          </small>
          <div style={{ height: '360px', background: 'var(--class-retention-bg)', border: '1px solid var(--class-retention-border)', borderRadius: '12px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--class-retention-text)' }}>
            [Karte: {filteredSchools.length} Schulen]
          </div>
        </div>

        {/* School Analysis - Two Column Bars */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--class-retention-border)' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Auswertung nach Schule</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
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

        {/* Navigation Tabs - Lernstand/Belastung/Ressourcen */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--class-retention-border)' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Steuerungs-Navigation: Lernstand · Belastung · Ressourcen</h2>
          <small style={{ color: 'var(--class-retention-text)', fontSize: '0.85rem' }}>
            Die Auswertungen beziehen sich auf die aktuell gefilterten Schulen. Ergänzt um eine 10-Jahres-Entwicklung auf Schulamtsebene.
          </small>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            {(['lernstand', 'belastung', 'ressourcen'] as NavSection[]).map(section => (
              <button key={section} onClick={() => setNavSection(section)} className={navSection === section ? 'is-active' : ''} style={{ padding: '8px 16px', border: '1px solid var(--class-retention-border)', borderRadius: '999px', background: navSection === section ? 'var(--class-retention-primary)' : 'var(--class-retention-bg)', color: navSection === section ? '#fff' : 'var(--class-retention-text)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{section === 'lernstand' ? '📊' : section === 'belastung' ? '⚖️' : '🧩'}</span>
                <span>{section === 'lernstand' ? 'Lernstand' : section === 'belastung' ? 'Belastung & Zusammensetzung' : 'Ressourcenverteilung'}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '16px', background: 'var(--class-retention-bg)', borderRadius: '12px', border: '1px solid var(--class-retention-border)' }}>
            {navSection === 'lernstand' && (<div><h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>Lernstand (10-Jahres-Trend)</h3><p style={{ fontSize: '0.85rem', color: 'var(--class-retention-text)' }}>[Chart: Lernstand über Zeit - Ziel: {LONG_TERM_DATA.targets.lernstand}]</p></div>)}
            {navSection === 'belastung' && (<div><h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>Belastung & Zusammensetzung (10-Jahres-Trend)</h3><p style={{ fontSize: '0.85rem', color: 'var(--class-retention-text)' }}>[Chart: Sozialindex über Zeit - Ziel: {LONG_TERM_DATA.targets.belastung}]</p></div>)}
            {navSection === 'ressourcen' && (<div><h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>Ressourcenverteilung (10-Jahres-Trend)</h3><p style={{ fontSize: '0.85rem', color: 'var(--class-retention-text)' }}>[Chart: Schüler/Lehrer-Verhältnis über Zeit - Ziel: {LONG_TERM_DATA.targets.ratio}]</p></div>)}
          </div>
        </div>

        {/* School Detail View */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--class-retention-border)' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Detailansicht Schule</h2>
          <small style={{ color: 'var(--class-retention-text)', fontSize: '0.85rem' }}>Eine Schule auswählen (Karte oder Liste), um Ampeln und Kennzahlen zu sehen.</small>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
            {filteredSchools.slice(0, 8).map(school => (
              <button key={school.id} onClick={() => setSelectedSchoolId(school.id)} className={selectedSchoolId === school.id ? 'is-active' : ''} style={{ padding: '6px 12px', border: '1px solid var(--class-retention-border)', borderRadius: '999px', background: selectedSchoolId === school.id ? 'var(--class-retention-primary)' : 'var(--class-retention-bg)', color: selectedSchoolId === school.id ? '#fff' : 'var(--class-retention-text)', fontSize: '0.75rem', cursor: 'pointer' }}>{school.name}</button>
            ))}
          </div>
          {selectedSchool ? (
            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--class-retention-bg)', borderRadius: '12px', border: '1px solid var(--class-retention-border)' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem' }}>{selectedSchool.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '4px' }}>Schüler:innen</div><div style={{ fontSize: '1rem', fontWeight: '600' }}>{selectedSchool.students}</div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '4px' }}>Sozialindex</div><div style={{ fontSize: '1rem', fontWeight: '600' }}>{selectedSchool.sozialindex}</div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '4px' }}>VERA Mathe</div><div style={{ fontSize: '1rem', fontWeight: '600' }}>{selectedSchool.veraMat.toFixed(1)}</div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '4px' }}>VERA Deutsch</div><div style={{ fontSize: '1rem', fontWeight: '600' }}>{selectedSchool.veraDeu.toFixed(1)}</div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '4px' }}>Schüler/Lehrer</div><div style={{ fontSize: '1rem', fontWeight: '600' }}>{selectedSchool.teacherRatio.toFixed(1)}</div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '4px' }}>Versorgung</div><div style={{ fontSize: '0.85rem', fontWeight: '600', color: selectedSchool.supplyCategory === 'gut' ? AMPEL_COLORS.green : selectedSchool.supplyCategory === 'angespannt' ? AMPEL_COLORS.yellow : AMPEL_COLORS.red }}>{SUPPLY_CATEGORIES[selectedSchool.supplyCategory].label}</div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--class-retention-text)', marginBottom: '4px' }}>Startchancen</div><div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{selectedSchool.startchancen === 'Startchancen-Schule' ? '✓' : '–'}</div></div>
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
