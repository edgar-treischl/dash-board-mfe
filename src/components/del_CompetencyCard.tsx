import { useState } from 'react'
import type { Bereich } from './iqb.ts'
import './CompetencyCard.css'

type CompetencyCardProps = {
  bereich: Bereich
  description: string
  skillLevelInfo?: string
}

export function CompetencyCard({ bereich, description, skillLevelInfo }: CompetencyCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="competency-card">
      <div className="competency-header">
        <h3 className="competency-name">{bereich}</h3>
        {(description || skillLevelInfo) && (
          <button
            className="competency-toggle"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            aria-label={`${showDetails ? 'Hide' : 'Show'} details for ${bereich}`}
          >
            <span className="toggle-icon">{showDetails ? '−' : '+'}</span>
          </button>
        )}
      </div>

      {showDetails && (
        <div className="competency-details">
          {description && <p className="competency-description">{description}</p>}
          {skillLevelInfo && <div className="skill-level-info">{skillLevelInfo}</div>}
        </div>
      )}
    </div>
  )
}
