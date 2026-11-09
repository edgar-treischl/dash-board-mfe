import { useMemo, useState } from 'react'
import { BEREICHE, groupDataForChart, getOverallData, type Bereich } from './iqb.ts'
import { StackedBarChart } from './charts/StackedBarChart.tsx'
import { CompetencyCard } from './del_CompetencyCard.tsx'
import { TestSelector } from './del_TestSelector.tsx'
import './TestSelector.css'
import './IQBPage.css'

type CompetencyInfo = {
  bereich: Bereich
  description: string
  skillLevelInfo: string
}

type IQBPageConfig = {
  testId: string
  testLabel: string
  competencies: CompetencyInfo[]
  introText: string
  sourceText: string
  skillLevelExplanation?: React.ReactNode
}

type IQBPageProps = {
  config: IQBPageConfig
  onTestChange?: (testId: string) => void
}

export function IQBPage({ config, onTestChange }: IQBPageProps) {
  const [showSkillLevels, setShowSkillLevels] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<Set<Bereich>>(
    new Set(BEREICHE) // All skills selected by default
  )
  const overallData = getOverallData()

  const competenciesByBereich = useMemo(() => {
    return new Map(config.competencies.map((c) => [c.bereich, c]))
  }, [config.competencies])

  const toggleSkill = (bereich: Bereich) => {
    const updated = new Set(selectedSkills)
    if (updated.has(bereich)) {
      updated.delete(bereich)
    } else {
      updated.add(bereich)
    }
    setSelectedSkills(updated)
  }

  const skillsToDisplay = BEREICHE.filter((b) => selectedSkills.has(b))

  return (
    <div className="iqb-page">
      {/* Test Selector (shown when multiple tests available) */}
      {onTestChange && (
        <div className="iqb-test-selector-wrapper">
          <TestSelector
            tests={[
              { id: 'deutsch', label: 'Deutsch' },
              { id: 'mathe', label: 'Mathematik' },
              // Add more tests as they become available
            ]}
            active={config.testId}
            onChange={onTestChange}
          />
        </div>
      )}

      {/* Intro Section — Minimal */}
      <div className="iqb-intro">
        <p>{config.introText}</p>
        <button
          className="skill-level-toggle"
          onClick={() => setShowSkillLevels(!showSkillLevels)}
          aria-expanded={showSkillLevels}
        >
          {showSkillLevels ? 'Hide' : 'Show'} skill level explanations
        </button>
      </div>

      {/* Competency Hero Section — Also serves as sub-skill selector */}
      <div className="competency-hero">
        <div className="competency-hero-header">
          <h2 className="competency-hero-title">Skills</h2>
          <p className="competency-hero-hint">Click to select/deselect</p>
        </div>
        <div className="competency-grid">
          {BEREICHE.map((bereich) => {
            const info = competenciesByBereich.get(bereich)
            const isSelected = selectedSkills.has(bereich)

            return (
              <button
                key={bereich}
                className={`competency-card-button ${isSelected ? 'is-selected' : ''}`}
                onClick={() => toggleSkill(bereich)}
                aria-pressed={isSelected}
              >
                <CompetencyCard
                  bereich={bereich}
                  description={info?.description || ''}
                  skillLevelInfo={showSkillLevels ? info?.skillLevelInfo : undefined}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Charts Section — Breathing Room */}
      <div className="iqb-charts-section">
        {skillsToDisplay.length === 0 ? (
          <div className="iqb-empty-state">
            <p>Select at least one skill to view results.</p>
          </div>
        ) : (
          skillsToDisplay.map((bereich) => {
            const bereichData = overallData.filter((d) => d.bereich === bereich)
            const groups = groupDataForChart(bereichData, { showBulaInLabel: true })

            return (
              <div key={bereich} className="iqb-chart-block">
                <div className="iqb-chart-title">{bereich}</div>
                <div className="iqb-chart-container">
                  <StackedBarChart groups={groups} showLegend={false} />
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Unified Legend */}
      <div className="iqb-legend-section">
        <div className="iqb-legend-content">
          <p className="iqb-legend-title">Skill Levels</p>
          <div className="iqb-legend-desc">
            <p>V = Advanced | IV = Strong | III = Proficient | II = Developing | Ib = Emerging | Ia = Beginning</p>
            <p className="iqb-note">Values less than 5% are not shown in charts.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="iqb-footer">
        <p className="iqb-source">{config.sourceText}</p>
      </div>
    </div>
  )
}
