import { memo } from 'react'
import heroSvg from '../assets/hero.svg?raw'

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
              Die Daten stammen aus der jährlichen Dokumentation <strong>„Bayerns Schulen in Zahlen"</strong> vom Bayerischen Staatsministerium für Unterricht und Kultus. Diese bietet einen umfassenden Überblick über die statistischen Daten zum bayerischen Schulwesen anhand von Tabellen und Grafiken.
            </p>
            
            <p className="class-retention-mfe__info-text">
              Diese App zeigt die Entwicklung der Klassenwiederholungsquoten in Bayern von <strong>2018 bis 2024</strong>. Die Daten sind nach Schultyp, Geschlecht und Migrationshintergrund differenziert.
            </p>
            
            <div className="class-retention-mfe__info-features">
              <div className="class-retention-mfe__info-feature">
                <strong>Datenumfang</strong>
                <p>7 Schuljahre (2018–2024)</p>
              </div>
              <div className="class-retention-mfe__info-feature">
                <strong>Schultypen</strong>
                <p>Grund-, Mittel-, Real-, Gymnasien & Gesamtschulen</p>
              </div>
              <div className="class-retention-mfe__info-feature">
                <strong>Gliederungen</strong>
                <p>Nach Geschlecht & Migrationshintergrund</p>
              </div>
            </div>

            <p className="class-retention-mfe__info-text">
              Weitere Informationen zur Datenquelle finden Sie unter:{' '}
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
        
        <div className="class-retention-mfe__info-hero-image">
          <div dangerouslySetInnerHTML={{ __html: heroSvg }} />
        </div>
      </div>
    </div>
  )
}

export const InfoView = memo(InfoViewComponent)
