/**
 * View options for the main navigation
 * Each view represents a different data visualization or info page
 */
export const VIEW_OPTIONS = [
  { key: 'home' as const, label: 'Start' },
  { key: 'bavaria' as const, label: 'Bayern' },
  { key: 'regierung' as const, label: 'Regierungsbezirke' },
  { key: 'samt' as const, label: 'Schulamt' },
  { key: 'info' as const, label: 'Info' },
] as const

/**
 * View metadata
 */
export const VIEW_METADATA: Record<
  (typeof VIEW_OPTIONS)[number]['key'],
  string
> = {
  home: 'ByDash',
  bavaria: 'Bayern',
  regierung: 'Regierungsbezirke',
  samt: 'Schulamt',
  info: 'Über diese App',
}

/**
 * CSS class name prefixes and selectors
 * Using BEM-like naming convention
 */
export const CLASS_NAMES = {
  root: 'bydash-mfe',
  panel: 'bydash-mfe__panel',
  viewSwitch: 'bydash-mfe__view-switch',
  viewTab: 'bydash-mfe__view-tab',
  viewTabActive: 'bydash-mfe__view-tab--active',
  explorerLayout: 'bydash-mfe__explorer-layout',
  explorerLeft: 'bydash-mfe__explorer-left',
  chartCard: 'bydash-mfe__chart-card',
  cardHeading: 'bydash-mfe__card-heading',
  controlsSection: 'bydash-mfe__controls-section',
  controlGroup: 'bydash-mfe__control-group',
} as const

/**
 * ARIA labels for accessibility
 */
export const ARIA_LABELS = {
  viewSwitchNav: 'Ansichtsauswahl',
} as const
