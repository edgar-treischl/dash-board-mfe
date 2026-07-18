import { memo } from 'react'
import heroSvg from '../assets/hero.svg?raw';

function HeroViewComponent() {
  return (
    <div className="class-retention-mfe__hero-container">
      <div className="class-retention-mfe__hero-content">
        <div className="class-retention-mfe__hero-text">
          <p className="class-retention-mfe__eyebrow">DEMO APP</p>
          <h1>
            <span className="class-retention-mfe__hero-highlight">ByDash</span>
          </h1>
          <p>
            ByDash ist eine Demo-App dass ein Steuerungstool für den Freistaat Bayern erprobt. 
          </p>

          <div className="class-retention-mfe__hero-callout">
            <div className="class-retention-mfe__callout-icon">⚠️</div>
            <div className="class-retention-mfe__callout-content">
              <strong>Keine echten Daten!</strong>
              <p>Alle Daten dieser App sind fiktiv und dienen nur zu Demonstrationszwecken.</p>
            </div>
          </div>

          <div className="class-retention-mfe__hero-features">
            <div className="class-retention-mfe__feature">
              <strong>Demo-App</strong>
              <p>Eine Demo-App die selbst noch in der Entwicklung steckt.</p>
            </div>
            <div className="class-retention-mfe__feature">
              <strong>Beispiel Visualisierung</strong>
              <p>Erkunden Sie examplarische Analyseebenen und Visualisierungen.</p>
            </div>
            <div className="class-retention-mfe__feature">
              <strong>Dash</strong>
              <p>ByDash ist als ein Modul für Dashboarding Plattform konzipiert.</p>
            </div>
          </div>
        </div>
        <div className="class-retention-mfe__hero-image">
          <img src={`data:image/svg+xml;base64,${btoa(heroSvg)}`} alt="Hero Illustration" />
        </div>
      </div>

    </div>
  )
}

export const HeroView = memo(HeroViewComponent)
