import { memo } from 'react'
import heroSvg from '../assets/hero.svg?raw';

function HeroViewComponent() {
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
    </div>
  )
}

export const HeroView = memo(HeroViewComponent)
