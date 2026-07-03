import { useState } from 'react'
import './HelpPopup.css'

type HelpPopupProps = {
  title: string
  content: string | React.ReactNode
}

export function HelpPopup({ title, content }: HelpPopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="help-popup-container">
      <button
        className="help-icon-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Hilfe anzeigen"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          className="help-icon-svg"
        >
          <circle
            cx="10"
            cy="10"
            r="8.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <text
            x="10"
            y="13"
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="currentColor"
            className="help-icon-text"
          >
            ?
          </text>
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="help-popup-overlay" onClick={() => setIsOpen(false)} />
          <div className="help-popup-dialog">
            <div className="help-popup-header">
              <h3>{title}</h3>
              <button
                className="help-popup-close"
                onClick={() => setIsOpen(false)}
                aria-label="Schließen"
                type="button"
              >
                ×
              </button>
            </div>
            <div className="help-popup-content">{content}</div>
          </div>
        </>
      )}
    </div>
  )
}