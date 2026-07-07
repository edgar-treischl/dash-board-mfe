import { memo } from 'react'
import heroSvg from '../assets/hero.png?url';


function InfoViewComponent() {
  return (
    <div className="class-retention-mfe__info-hero-container">
      <div className="class-retention-mfe__info-hero-content">
        <div className="class-retention-mfe__info-hero-text">
          <h1>
            <span className="class-retention-mfe__hero-highlight">Datenquelle & Hintergrund</span>
          </h1>
          
          <section className="class-retention-mfe__info-section">
            <p className="class-retention-mfe__info-text">
              Hier könnte eine kurze Beschreibung über die Datenquelle und den Hintergrund des Projekts stehen. Dies ist eine Demo App, die keine echten Daten verwendet. Die Informationen dienen nur zu Demonstrationszwecken.
            </p>
            
            <div className="class-retention-mfe__info-features">
              <div className="class-retention-mfe__info-feature">
                <strong>Datenumfang</strong>
                <p>Kein echten Daten</p>
              </div>
              <div className="class-retention-mfe__info-feature">
                <strong>Schultypen</strong>
                <p>Keine echte Schultypen</p>
              </div>
            </div>

            <p className="class-retention-mfe__info-text">
              Echte Daten über das bayrische Schulsystem finden Sie in:{' '}
              <a 
                href="https://www.km.bayern.de/ministerium/statistik-und-forschung/bayerns-schulen-in-zahlen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="class-retention-mfe__info-link"
              >
                Bayerns Schulen in Zahlen (LfStat)
              </a>
            </p>
          </section>
        </div>
        <div className="class-retention-mfe__hero-image">
          <img src={heroSvg} alt="Hero Illustration" />
        </div>
      </div>
    </div>
  )
}

export const InfoView = memo(InfoViewComponent)
