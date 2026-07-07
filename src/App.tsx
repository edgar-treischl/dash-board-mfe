import { useState } from 'react'
import { BavariaView } from './components/BavariaPage'
import { RegierungsView } from './components/RegierungsPage'
import { HeroView } from './components/HeroPage'
import { InfoView } from './components/InfoPage'
import { SAmtPage } from './components/SAmtPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import {
  VIEW_OPTIONS,
  CLASS_NAMES,
  ARIA_LABELS,
} from './constants'
import './App.css'

type ViewKey = (typeof VIEW_OPTIONS)[number]['key']

export default function App() {
  const [view, setView] = useState<ViewKey>('home')

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
              <SAmtPage/>
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
