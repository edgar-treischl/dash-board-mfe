import { memo, useMemo, useState } from 'react'
import { BEREICHE, groupDataForChart, filterData, type Bereich } from './iqb.ts'
import { StackedBarChart } from './charts/StackedBarChart.tsx'
import { ReadingIcon, SpellingIcon, ListeningIcon } from '../utils/icons'
import './DeutschPage.css'
import styles from './RegierungsPage.module.css'

type LanguageCode = 'de'

type CompetencyInfo = {
  bereich: Bereich
  description: string
  skillLevelInfo: string
  icon: React.ReactNode
}

const DEUTSCH_COMPETENCIES: Record<LanguageCode, Array<CompetencyInfo>> = {
  de: [
    {
      bereich: 'Lesen',
      description:
        'Die Fähigkeit, geschriebene Texte zu verstehen, zu nutzen und über sie zu reflektieren.',
      skillLevelInfo: `
V (Optimalstandard): Umfasst die optimale Leistung bei komplexen Aufgaben
IV (Regelstandard Plus): Sichere Beherrschung über die Anforderungen hinaus
III (Regelstandard): Erfüllt alle wesentlichen Anforderungen
II (Mindeststandard Plus): Erfüllt Mindestanforderungen mit Sicherheit
Ib (Mindeststandard): Erreicht gerade noch die Mindestanforderungen
Ia (Unter Mindeststandard): Unterschreitet die Mindestanforderungen    `,
      icon: <ReadingIcon className="bydash-mfe__grid-icon" />,
    },
    {
      bereich: 'Orthografie',
      description:
        'Die Fähigkeit, Wörter, Sätze und Texte normgerecht zu schreiben und Rechtschreibregeln anzuwenden.',
      skillLevelInfo: `
V (Optimalstandard): Umfasst die optimale Leistung bei komplexen Aufgaben
IV (Regelstandard Plus): Sichere Beherrschung über die Anforderungen hinaus
III (Regelstandard): Erfüllt alle wesentlichen Anforderungen
II (Mindeststandard Plus): Erfüllt Mindestanforderungen mit Sicherheit
Ib (Mindeststandard): Erreicht gerade noch die Mindestanforderungen
Ia (Unter Mindeststandard): Unterschreitet die Mindestanforderungen    `,
      icon: <SpellingIcon className="bydash-mfe__grid-icon" />,
    },
    {
      bereich: 'Zuhören',
      description:
        'Die Fähigkeit, gesprochene Texte zu verstehen, zu verarbeiten und Hauptaussagen sowie Details zu erfassen.',
      skillLevelInfo: `
V (Optimalstandard): Umfasst die optimale Leistung bei komplexen Aufgaben
IV (Regelstandard Plus): Sichere Beherrschung über die Anforderungen hinaus
III (Regelstandard): Erfüllt alle wesentlichen Anforderungen
II (Mindeststandard Plus): Erfüllt Mindestanforderungen mit Sicherheit
Ib (Mindeststandard): Erreicht gerade noch die Mindestanforderungen
Ia (Unter Mindeststandard): Unterschreitet die Mindestanforderungen    `,
      icon: <ListeningIcon className="bydash-mfe__grid-icon" />,
    },
  ],
}

const LANGUAGES: Array<{ code: LanguageCode; label: string }> = [
  { code: 'de', label: 'Deutsch' },
  // Future languages will be added here
]

function DeutschViewComponent() {
  const [language, setLanguage] = useState<LanguageCode>('de')
  const [selectedSkill, setSelectedSkill] = useState<Bereich>(BEREICHE[0])
  const [showSkillLevels, setShowSkillLevels] = useState(false)

  const competencies = DEUTSCH_COMPETENCIES[language]

  const competenciesByBereich = useMemo(() => {
    return new Map(competencies.map((c) => [c.bereich, c]))
  }, [competencies])

  const chartData = useMemo(() => {
    const filteredData = filterData('Alle', 'Alle', 'alle').filter((d) =>
      d.bereich === selectedSkill
    )
    return groupDataForChart(filteredData, { showBulaInLabel: true })
  }, [selectedSkill])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Language Selector Header — Full-Width Breadcrumb Style */}
        <div style={{
          padding: '0 24px',
          borderBottom: '2px solid var(--bydash-border)',
          background: 'transparent',
          display: 'grid',
          gridTemplateColumns: `repeat(${LANGUAGES.length}, 1fr)`,
          gap: '0',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'transparent',
                color: language === lang.code
                  ? 'var(--bydash-accent)'
                  : 'var(--bydash-text)',
                border: 'none',
                borderBottom: language === lang.code
                  ? '2px solid var(--bydash-accent)'
                  : '2px solid transparent',
                borderRadius: '0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontSize: '0.9rem',
                fontWeight: language === lang.code ? '600' : '500',
                whiteSpace: 'nowrap',
                width: '100%',
                minHeight: '40px',
              }}
              onMouseEnter={(e) => {
                if (language !== lang.code) {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--bydash-heading)';
                  (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'rgba(0, 141, 201, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (language !== lang.code) {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--bydash-text)';
                  (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'transparent';
                }
              }}
            >
              <span>{lang.label}</span>
            </button>
          ))}
        </div>

        {/* Title and Subtitle Section */}
        <div style={{ padding: '0 24px', paddingTop: '24px', marginBottom: '24px' }}>
          <div>
            <h2 style={{
              fontSize: '2.25rem',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: 'var(--bydash-heading)',
            }}>
              Deutschkompetenz
            </h2>
            <p style={{
              fontSize: '1rem',
              margin: '0',
              color: 'var(--bydash-text)',
              opacity: 0.8,
              lineHeight: '1.5',
            }}>
              Kompetenzstufenverteilung in Jahrgangsstufe 9 — IQB-Bildungstrend 2022. Vergleich Bayern vs. Deutschland.
            </p>
          </div>
        </div>

        {/* Skills Grid / Feature Selector - Icon Based */}
        <div style={{
          padding: '0 24px',
          marginBottom: '24px',
        }}>
          <div style={{
            borderBottom: '1px solid var(--bydash-border)',
            paddingBottom: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0',
            marginBottom: '16px',
          }}>
            {competencies.map((competency) => {
              const isSelected = selectedSkill === competency.bereich
              return (
                <button
                  key={competency.bereich}
                  onClick={() => setSelectedSkill(competency.bereich)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    background: 'transparent',
                    color: isSelected ? 'var(--bydash-accent)' : 'var(--bydash-text)',
                    border: 'none',
                    borderBottom: isSelected
                      ? '2px solid var(--bydash-accent)'
                      : '2px solid transparent',
                    borderRadius: '0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? '600' : '500',
                    textAlign: 'center',
                    width: '100%',
                    minHeight: '80px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--bydash-heading)';
                      (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'rgba(0, 141, 201, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--bydash-text)';
                      (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'transparent';
                    }
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: isSelected ? 'var(--bydash-accent)' : 'inherit',
                    }}
                  >
                    {competency.icon}
                  </div>

                  {/* Label */}
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? '600' : '500',
                    }}
                  >
                    {competency.bereich}
                  </strong>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
              alignItems: 'start',
            }}
          >
            {/* Left: Chart Component */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
              <div style={{
                border: '1px solid var(--bydash-border)',
                borderRadius: '12px',
                background: 'var(--bydash-bg)',
                overflow: 'hidden',
                padding: '24px',
              }}>
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  color: 'var(--bydash-heading)',
                }}>
                  Kompetenzverteilung nach Stufe
                </h3>
                <StackedBarChart
                  groups={chartData}
                  showLegend={true}
                />
              </div>

              {/* Skill Level Toggle - After Chart */}
              <button
                onClick={() => setShowSkillLevels(!showSkillLevels)}
                style={{
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  background: 'transparent',
                  border: '1px solid var(--bydash-border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: 'var(--bydash-text)',
                  transition: 'all 0.15s ease',
                  fontWeight: '500',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--bydash-accent)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--bydash-accent)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0, 141, 201, 0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--bydash-border)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--bydash-text)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {showSkillLevels ? '▲ Weniger' : '▼ Mehr'} über die Kompetenzmessung
              </button>
            </div>

            {/* Right: Info Panel / Storytelling */}
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
              {/* Selected Skill Display */}
              <div style={{
                paddingBottom: '16px',
                borderBottom: '1px solid var(--bydash-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--bydash-accent)',
                }}>
                  {competenciesByBereich.get(selectedSkill)?.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '600',
                  }}>
                    Ausgewählte Kompetenz
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    margin: 0,
                    color: 'var(--bydash-accent)',
                  }}>
                    {selectedSkill}
                  </div>
                </div>
              </div>

              {/* Selected Skill Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(() => {
                  const competency = competenciesByBereich.get(selectedSkill)
                  return competency ? (
                    <>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: 'var(--bydash-heading)',
                      }}>
                        Beschreibung
                      </div>
                      <div style={{
                        padding: '12px',
                        border: '1px solid var(--bydash-border)',
                        borderRadius: '8px',
                        background: 'rgba(0, 141, 201, 0.03)',
                      }}>
                        <div style={{
                          fontSize: '0.85rem',
                          color: 'var(--bydash-text)',
                          lineHeight: '1.5',
                        }}>
                          {competency.description}
                        </div>
                      </div>
                    </>
                  ) : null
                })()}
              </div>

              {/* Data Source */}
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid var(--bydash-border)',
                fontSize: '0.85rem',
                color: 'var(--bydash-text)',
                opacity: 0.65,
              }}>
                <strong>Quelle:</strong> IQB-Bildungstrend 2022 in der Sekundarstufe I
              </div>
            </div>
          </div>
        </div>

        {/* Skill Level Explanations - Reusable Template */}
        {showSkillLevels && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--bydash-border)', background: 'rgba(0, 141, 201, 0.03)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'flex-start' }}>
              {/* Left Column: Getestete Bereiche */}
              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  marginTop: 0,
                  color: 'var(--bydash-heading)',
                  borderBottom: '2px solid var(--bydash-border)',
                  paddingBottom: '8px',
                }}>
                  Getestete Bereiche
                </h3>

                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--bydash-text)',
                  lineHeight: '1.6',
                  marginBottom: '18px',
                  marginTop: '12px',
                  opacity: 0.8,
                }}>
                  Die Kompetenzstufenmessung des IQB-Bildungstrends erfasst, über welche sprachlichen Fähigkeiten Schülerinnen und Schüler 
                  verfügen und inwieweit sie die bundesweiten Bildungsstandards der Kultusministerkonferenz (KMK) erreichen. <br /> <br />
                  Die Leistungen der Schülerinnen und Schüler werden anhand von sechs Kompetenzstufen beschrieben:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '18px' }}>
                  {competencies.map((competency) => (
                    <div
                      key={competency.bereich}
                      style={{
                        padding: '18px',
                        borderLeft: '4px solid var(--bydash-accent)',
                        background: 'var(--bydash-bg)',
                        borderRadius: '8px',
                      }}
                    >
                      <h4 style={{
                        margin: '0 0 8px 0',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: 'var(--bydash-heading)',
                      }}>
                        {competency.bereich}
                      </h4>
                      <p style={{
                        margin: 0,
                        fontSize: '0.88rem',
                        color: 'var(--bydash-text)',
                        lineHeight: '1.6',
                        opacity: 0.85,
                      }}>
                        {competency.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Kompetenzstufen */}
              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  marginTop: 0,
                  color: 'var(--bydash-heading)',
                  borderBottom: '2px solid var(--bydash-border)',
                  paddingBottom: '8px',
                }}>
                  Kompetenzstufen
                </h3>

                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--bydash-text)',
                  lineHeight: '1.6',
                  marginBottom: '18px',
                  marginTop: '12px',
                  opacity: 0.8,
                }}>
                  Die Leistungen der Schülerinnen und Schüler werden anhand von sechs Kompetenzstufen beschrieben:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {competencies.length > 0 && competenciesByBereich.has(selectedSkill) && (() => {
                    const selectedCompetency = competenciesByBereich.get(selectedSkill)
                    const skillLines = selectedCompetency?.skillLevelInfo.trim().split('\n') || []
                    
                    const skillLevels = [
                      { code: 'V', title: 'Optimalstandard', color: '#01665e' },
                      { code: 'IV', title: 'Regelstandard Plus', color: '#5ab4ac' },
                      { code: 'III', title: 'Regelstandard', color: '#c7eae5', textColor: '#111827' },
                      { code: 'II', title: 'Mindeststandard Plus', color: '#f6e8c3', textColor: '#111827' },
                      { code: 'Ib', title: 'Mindeststandard', color: '#d8b365' },
                      { code: 'Ia', title: 'Unter Mindeststandard', color: '#8c510a' },
                    ]

                    return skillLevels.map((level) => {
                      const skillLine = skillLines.find(line => line.trim().startsWith(level.code))
                      const description = skillLine 
                        ? skillLine.split(':').slice(1).join(':').trim() 
                        : ''

                      return (
                        <div key={level.code} style={{ display: 'flex', gap: '16px', padding: '18px', border: '1px solid var(--bydash-border)', borderRadius: '12px', background: 'var(--bydash-surface)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            color: level.textColor || 'white',
                            flexShrink: 0,
                            background: level.color,
                          }}>
                            {level.code}
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: '600', color: 'var(--bydash-heading)' }}>
                              {level.title}
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--bydash-text)', opacity: 0.8, lineHeight: '1.5' }}>
                              {description}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const DeutschView = memo(DeutschViewComponent)
