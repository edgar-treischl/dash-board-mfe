import { memo } from 'react'
import { VIEW_OPTIONS } from '../constants'
import heroSvg from '../assets/hero.svg?raw';

type ViewKey = (typeof VIEW_OPTIONS)[number]['key']

function HeroViewComponent() {
  const handleNavigation = (viewKey: ViewKey) => {
    const navButtons = document.querySelectorAll('.class-retention-mfe__view-tab')
    const button = Array.from(navButtons).find(
      (btn) => btn.getAttribute('data-view') === viewKey
    ) as HTMLButtonElement | undefined
    if (button) {
      button.click()
    }
  }

  const navigationItems = [
    {
      viewKey: 'retention' as const,
      title: 'Klassenwiederholung',
      description: 'Detaillierte Darstellung der Wiederholungsquoten nach Schultyp und Schuljahr.'
    },
    {
      viewKey: 'trends' as const,
      title: 'Zeitverlauf',
      description: 'Visualisierung der zeitlichen Entwicklung von 2018 bis 2024.'
    },
    {
      viewKey: 'sex' as const,
      title: 'Geschlecht',
      description: 'Vergleich der Wiederholungsquoten zwischen Schülern und Schülerinnen.'
    },
    {
      viewKey: 'migration' as const,
      title: 'Migration',
      description: 'Analyse nach Migrationshintergrund und Herkunftsland.'
    },
    {
      viewKey: 'data' as const,
      title: 'Info',
      description: 'Mehr Informationen zu Datenquellen und Methodik.'
    }
  ]

  return (
    <div className="class-retention-mfe__hero-container">
      <div className="class-retention-mfe__hero-content">
        <div className="class-retention-mfe__hero-text">
          <p className="class-retention-mfe__eyebrow">Dash-Board</p>
          <h1>
            <span className="class-retention-mfe__hero-highlight">Dash Control Center</span>
          </h1>
          <p>
            Klassenwiederholungen geben einen wichtigen Einblick in den schulischen Erfolg und zeigen, wo Lernschwierigkeiten entstehen. 
          </p>
          <p>
            In dieser App können Sie die Entwicklung der Wiederholungsquoten in Bayern über die Jahre 2018 bis 2024 erkunden.
          </p>

          <div className="class-retention-mfe__hero-features">
            <div className="class-retention-mfe__feature">
              <strong>Wiederholungsquoten</strong>
              <p>Quer- und Längsschnitt (2018 bis 2024)</p>
            </div>
            <div className="class-retention-mfe__feature">
              <strong>Ergebnisse nach</strong>
              <p>Geschlecht & Migrationshintergrund</p>
            </div>
            <div className="class-retention-mfe__feature">
              <strong>Quelle</strong>
              <p>Bayerns Schulen in Zahlen (LfStat) </p>
            </div>
          </div>
        </div>
        <div className="class-retention-mfe__hero-image">
          <div dangerouslySetInnerHTML={{ __html: heroSvg }} />
        </div>
      </div>

      {/* Ebenenauswahl Grid Section */}
      <section className="class-retention-mfe__selection-section">
        <h2 className="class-retention-mfe__selection-title">Ansichten</h2>
        <small>Bitte wählen Sie die gewünschte Ansicht für Ihre Analyse.</small>
        <div className="class-retention-mfe__selection-grid">
          {navigationItems.map((item) => (
            <button
              key={item.viewKey}
              className="class-retention-mfe__level-select-btn"
              onClick={() => handleNavigation(item.viewKey)}
            >
              <strong>{item.title}</strong>
              <span className="class-retention-mfe__level-desc">{item.description}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export const HeroView = memo(HeroViewComponent)
