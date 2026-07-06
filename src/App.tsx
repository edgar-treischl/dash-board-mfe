import { useState } from 'react'
import { BavariaView } from './components/BavariaPage.tsx'
import { RegierungsView } from './components/RegierungsPage.tsx'
import { HeroView } from './components/HeroPage.tsx'
import { InfoView } from './components/InfoPage.tsx'
import { SAmtView } from './components/SAmtPage.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import {
  SCHOOL_YEARS,
  type SchoolYear,
} from './retention.ts'
import {
  VIEW_OPTIONS,
  VIEW_METADATA,
  CLASS_NAMES,
  ARIA_LABELS,
} from './constants.ts'
import './App.css'

type ViewKey = (typeof VIEW_OPTIONS)[number]['key']

export default function App() {
  const [view, setView] = useState<ViewKey>('home')
  const [selectedYear, setSelectedYear] = useState<SchoolYear>(SCHOOL_YEARS[0])

  const title = VIEW_METADATA[view]

  return (
    <ErrorBoundary>
      <main className={CLASS_NAMES.root}>
        <section className={CLASS_NAMES.panel}>
          <nav className={CLASS_NAMES.viewSwitch} aria-label={ARIA_LABELS.viewSwitchNav}>
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                data-view={option.key}
                className={
                  option.key === view
                    ? `${CLASS_NAMES.viewTab} ${CLASS_NAMES.viewTabActive}`
                    : CLASS_NAMES.viewTab
                }
                onClick={() => setView(option.key)}
              >
                {option.label}
              </button>
            ))}
          </nav>

          {view !== 'home' && (
            <header className={CLASS_NAMES.panelHeader}>
              <div>
                <h1>{title}</h1>
              </div>
            </header>
          )}

          {view === 'home' ? (
            <ErrorBoundary>
              <HeroView />
            </ErrorBoundary>
          ) : view === 'retention' ? (
            <ErrorBoundary>
              <BavariaView />
            </ErrorBoundary>
          ) : view === 'trends' ? (
            <ErrorBoundary>
              <RegierungsView />
            </ErrorBoundary>
          ) : view === 'sex' ? (
            <ErrorBoundary>
              <SAmtView/>
            </ErrorBoundary>
          ) : (
            <ErrorBoundary>
              <InfoView />
            </ErrorBoundary>
          )}
        </section>
      </main>
    </ErrorBoundary>
  )
}
