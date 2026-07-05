import { memo } from 'react'
import heroSvg from '../assets/hero.png';

function HeroViewComponent() {
  return (
    <div className="class-retention-mfe__hero-container">
      <div className="class-retention-mfe__hero-content">
        <div className="class-retention-mfe__hero-text">
          <p className="class-retention-mfe__eyebrow">Dash Control Center</p>
          <h1>
            <span className="class-retention-mfe__hero-highlight">ByDash</span>
          </h1>
          <p>
            ByDash ist ein Demo-Version für ein Steuerungstool für den Freistaat Bayern. 
          </p>
          <p>
            Die App soll einen Überblick über Bayern, einzelne Regierungsbezirke und soll ein Ankerpunkt für Schulaufsichten sein.
          </p>

          <div className="class-retention-mfe__hero-features">
            <div className="class-retention-mfe__feature">
              <strong>Keine echten Daten!</strong>
              <p>Alle Daten dieser App sind fiktiv und dienen nur zu Demonstrationszwecken.</p>
            </div>
          </div>
        </div>
        <div className="class-retention-mfe__hero-image">
          <img src={heroSvg} alt="Hero Illustration" />
        </div>
      </div>

    </div>
  )
}

export const HeroView = memo(HeroViewComponent)
