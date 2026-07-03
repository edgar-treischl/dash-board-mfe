import { memo } from 'react'
import {
  buildBarChartStats,
  getDataForYear,
  getYearOverYearChange,
  SCHOOL_TYPES,
  SCHOOL_TYPE_LABELS,
  SCHOOL_TYPE_COLORS,
  type SchoolYear,
  type SchoolType,
} from '../retention.ts'
import { generateBarChartFindings } from '../utils/findingsGenerator.ts'
import { COMMON_STYLES } from '../config/chartConfig.ts'
import { BarPlot } from './charts/BarPlot.tsx'
import { YearSelect } from './controls'
import { InterpretationBox } from './InterpretationBox.tsx'

type RetentionViewProps = {
  selectedYear: SchoolYear
  onYearChange: (value: SchoolYear) => void
}

function RetentionViewComponent({
  selectedYear,
  onYearChange,
}: RetentionViewProps) {
  const yearData = getDataForYear(selectedYear)
  const stats = buildBarChartStats(yearData)
  
  // Get year-over-year changes for all school types
  const yoyChanges = SCHOOL_TYPES.map((schoolType: SchoolType) => ({
    type: schoolType,
    change: getYearOverYearChange(selectedYear, schoolType),
  }))
  
  // Generate findings from statistics
  const findings = generateBarChartFindings(selectedYear, stats.bySchoolType)

  // Build interpretation tabs
  const interpretationTabs = {
    befund: {
      label: 'Befund',
      content: (
        <div>
          <p className="class-retention-mfe__story-text">
            Wie unterscheiden sich Schularten nach Wiederholungsquoten? Das Balkendiagramm zeigt die Anteile der Schülerinnen und Schüler, die in verschiedenen Schultypen in Bayern Klassen wiederholen.
          </p>
          <ul className="class-retention-mfe__story-text" style={COMMON_STYLES.bulletList}>
            {findings.map((finding, idx) => (
              <li key={idx} style={COMMON_STYLES.listItem} dangerouslySetInnerHTML={{ __html: finding }} />
            ))}
          </ul>
        </div>
      ),
    },
    hinweis: {
      label: 'Hinweis',
      content: (
        <p className="class-retention-mfe__story-text class-retention-mfe__story-text--italic">
          Betroffene Kinder erleben häufiger Leistungsängste, geringeres Selbstvertrauen sowie ein erhöhtes Risiko für Schulabbrüche. Hohe Wiederholungsquoten können daher ein Hinweis darauf sein, dass bestehende Leistungsanforderungen nicht ausreichend durch präventive Förderung, individualisierte Unterstützung und adaptive Lernangebote abgefedert werden.
        </p>
      ),
    },
  }

  return (
    <>
      <section className="class-retention-mfe__explorer-layout">
        <div className="class-retention-mfe__explorer-left">
          {/* Chart */}
          <div className="class-retention-mfe__chart-card">
            <div className="class-retention-mfe__card-heading"></div>

            <div className="class-retention-mfe__controls-section">
              <YearSelect selectedYear={selectedYear} onYearChange={onYearChange} />
            </div>

            <div className="class-retention-mfe__chart-frame">
              <BarPlot data={stats.bySchoolType} year={selectedYear} />
            </div>

            {/* Legend for school types */}
            <div className="class-retention-mfe__chart-legend">
              <div className="class-retention-mfe__legend-label">Schularten</div>
              <ul className="class-retention-mfe__legend-list">
                {SCHOOL_TYPES.map((schoolType: SchoolType) => (
                  <li key={schoolType}>
                    <span
                      className="class-retention-mfe__legend-swatch"
                      style={{ backgroundColor: SCHOOL_TYPE_COLORS[schoolType] }}
                    />
                    {schoolType} ({SCHOOL_TYPE_LABELS[schoolType]})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="class-retention-mfe__explorer-right">
          <InterpretationBox tabs={interpretationTabs} defaultTab="befund" />
        </div>
      </section>

      <section className="class-retention-mfe__stats-section">
        <h3 className="class-retention-mfe__stats-header">Trend im Vergleich zum Vorjahr</h3>
        <div className="class-retention-mfe__stats-row" aria-label="Veränderungen zum Vorjahr">
          {yoyChanges.map(({ type, change }) => (
            <section key={type} className="class-retention-mfe__stat-card">
              <span className="class-retention-mfe__stat-type">{type}</span>
              <strong className={change === null ? '' : change > 0 ? 'class-retention-mfe__stat-increase' : change < 0 ? 'class-retention-mfe__stat-decrease' : ''}>
                {change === null ? 'N/A' : `${change > 0 ? '+' : ''}${change}%`}
              </strong>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}

export const RetentionView = memo(RetentionViewComponent)
