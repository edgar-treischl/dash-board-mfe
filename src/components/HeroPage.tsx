import { memo } from 'react'
import heroSvg from '../assets/hero.svg?raw';

function HeroViewComponent() {
  return (
    <div className="bydash-mfe__hero-container">
      {/* Left Side: Image with colored background */}
      <div className="bydash-mfe__hero-left">
        <div className="bydash-mfe__hero-image-wrapper">
          <img src={`data:image/svg+xml;base64,${btoa(heroSvg)}`} alt="Hero Illustration" className="bydash-mfe__hero-image" />
        </div>
      </div>

      {/* Right Side: Title, text and features */}
      <div className="bydash-mfe__hero-right">
        <p className="bydash-mfe__hero-eyebrow">DEMO APP</p>
        
        <h1 className="bydash-mfe__hero-title">
          <span className="bydash-mfe__hero-highlight">ByDash</span>
        </h1>
        
        <p className="bydash-mfe__hero-primary">
          ByDash ist eine Demo-App dass ein Steuerungstool für den Freistaat Bayern erprobt. 
        </p>

        <div className="bydash-mfe__hero-callout">
          <div className="bydash-mfe__callout-icon">⚠️</div>
          <div className="bydash-mfe__callout-content">
            <strong>Fiktive Daten!</strong>
            <p>Diese App dient nur zu Demonstrationszwecken.</p>
          </div>
        </div>

        <div className="bydash-mfe__hero-features">
          <div className="bydash-mfe__feature">
            <strong>Demo-App</strong>
            <span>Eine Demo-App die selbst noch in der Entwicklung steckt.</span>
          </div>
          <div className="bydash-mfe__feature">
            <strong>Beispiel Visualisierung</strong>
            <span>Erkunden Sie examplarische Analyseebenen und Visualisierungen.</span>
          </div>
          <div className="bydash-mfe__feature">
            <strong>Dash</strong>
            <span>ByDash ist als ein Modul für Dashboarding Plattform konzipiert.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const HeroView = memo(HeroViewComponent)
