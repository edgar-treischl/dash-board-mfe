/**
 * Application-wide constants and configuration
 */

/**
 * View options for the main navigation
 * Each view represents a different data visualization or info page
 */
export const VIEW_OPTIONS = [
  { key: 'home' as const, label: 'Startseite' },
  { key: 'retention' as const, label: 'Bayern' },
  { key: 'trends' as const, label: 'Regierungsbezirke' },
  { key: 'sex' as const, label: 'Geschlecht' },
  { key: 'data' as const, label: 'Info' },
] as const

/**
 * View metadata: titles and descriptions for each view
 */
export const VIEW_METADATA: Record<
  (typeof VIEW_OPTIONS)[number]['key'],
  string
> = {
  home: 'Klassenwiederholung',
  retention: 'Bayern',
  trends: 'Regierungsbezirke',
  sex: 'Klassenwiederholungen nach Geschlecht',
  data: 'Über diese App',
}

/**
 * CSS class name prefixes and selectors
 * Using BEM-like naming convention
 */
export const CLASS_NAMES = {
  root: 'class-retention-mfe',
  panel: 'class-retention-mfe__panel',
  viewSwitch: 'class-retention-mfe__view-switch',
  viewTab: 'class-retention-mfe__view-tab',
  viewTabActive: 'class-retention-mfe__view-tab--active',
  panelHeader: 'class-retention-mfe__panel-header',
  explorerLayout: 'class-retention-mfe__explorer-layout',
  explorerLeft: 'class-retention-mfe__explorer-left',
  chartCard: 'class-retention-mfe__chart-card',
  cardHeading: 'class-retention-mfe__card-heading',
  controlsSection: 'class-retention-mfe__controls-section',
  controlGroup: 'class-retention-mfe__control-group',
} as const

/**
 * ARIA labels for accessibility
 */
export const ARIA_LABELS = {
  viewSwitchNav: 'Ansichtsauswahl',
} as const
