interface ViewSwitcherOption {
  key: string
  label: string
}

interface ViewSwitcherProps {
  options: ViewSwitcherOption[]
  activeKey: string
  onSelect: (key: string) => void
  ariaLabel?: string
}

export function ViewSwitcher({
  options,
  activeKey,
  onSelect,
  ariaLabel = 'View selector',
}: ViewSwitcherProps) {
  return (
    <nav className="class-retention-mfe__view-switcher" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          className={`class-retention-mfe__view-tab ${
            option.key === activeKey ? 'is-active' : ''
          }`}
          onClick={() => onSelect(option.key)}
        >
          {option.label}
        </button>
      ))}
    </nav>
  )
}
